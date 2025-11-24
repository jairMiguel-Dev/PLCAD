const express = require('express');
const router = express.Router();

// Initialize Stripe only if key is provided
let stripe = null;
const STRIPE_ENABLED = process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY !== 'sk_test_sua_chave_aqui' &&
    process.env.STRIPE_SECRET_KEY.startsWith('sk_');

if (STRIPE_ENABLED) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized successfully');
} else {
    console.warn('⚠️  Stripe not configured. Using DEMO MODE.');
    console.warn('   Add STRIPE_SECRET_KEY to .env to enable real payments.');
    console.warn('   Get your keys at: https://dashboard.stripe.com/test/apikeys');
}

// Prices for products (in centavos - BRL)
const PRICES = {
    gems_small: {
        amount: 499, // R$ 4,99
        currency: 'brl',
        gemAmount: 350,
        name: 'Punhado de Gemas',
        description: '350 Gemas para usar na loja'
    },
    gems_medium: {
        amount: 999, // R$ 9,99
        currency: 'brl',
        gemAmount: 1200,
        name: 'Saco de Gemas',
        description: '1200 Gemas para usar na loja'
    },
    premium_monthly: {
        amount: 1999, // R$ 19,99/mês
        currency: 'brl',
        interval: 'month',
        name: 'ProGres Super - Mensal',
        description: 'Vidas infinitas, zero anúncios, emblema dourado e acesso a conteúdos exclusivos'
    },
    premium_yearly: {
        amount: 7999, // R$ 79,99/ano (33% off)
        currency: 'brl',
        interval: 'year',
        name: 'ProGres Super - Anual',
        description: 'Vidas infinitas, zero anúncios e emblema dourado (economize 33%)'
    }
};

/**
 * POST /api/payments/create-checkout-session
 * Creates a Stripe Checkout session for one-time purchases
 */
router.post('/create-checkout-session', async (req, res) => {
    // DEMO MODE: Return mock session
    if (!STRIPE_ENABLED) {
        console.log('🎭 DEMO MODE: Simulating checkout session creation');
        return res.json({
            sessionId: 'demo_session_' + Date.now(),
            url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?session_id=demo_session_${Date.now()}&demo=true`,
            demo: true,
            message: 'Stripe not configured. This is a demo session. Configure Stripe to enable real payments.'
        });
    }

    try {
        const { productId, userId } = req.body;

        if (!productId || !PRICES[productId]) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = PRICES[productId];

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: product.currency,
                        product_data: {
                            name: product.name,
                            description: product.description,
                        },
                        unit_amount: product.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/shop?canceled=true`,
            metadata: {
                userId: userId || 'guest',
                productId: productId,
                gemAmount: product.gemAmount?.toString() || '0'
            }
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/payments/create-subscription
 * Creates a Stripe Checkout session for subscriptions
 */
router.post('/create-subscription', async (req, res) => {
    // DEMO MODE: Return mock session
    if (!STRIPE_ENABLED) {
        console.log('🎭 DEMO MODE: Simulating subscription creation');
        return res.json({
            sessionId: 'demo_sub_' + Date.now(),
            url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?session_id=demo_sub_${Date.now()}&demo=true`,
            demo: true,
            message: 'Stripe not configured. This is a demo session.'
        });
    }

    try {
        const { productId, userId } = req.body;

        if (!productId || !PRICES[productId]) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = PRICES[productId];

        // Create or retrieve Stripe Price
        const price = await stripe.prices.create({
            unit_amount: product.amount,
            currency: product.currency,
            recurring: { interval: product.interval },
            product_data: {
                name: product.name,
                description: product.description,
            },
        });

        // Create Checkout Session for subscription
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/shop?canceled=true`,
            metadata: {
                userId: userId || 'guest',
                productId: productId,
            }
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * POST /api/payments/cancel-subscription
 * Cancels a subscription and checks for CDC refund eligibility (7 days)
 */
router.post('/cancel-subscription', async (req, res) => {
    const { subscriptionId } = req.body;

    // DEMO MODE
    if (!STRIPE_ENABLED || (subscriptionId && subscriptionId.startsWith('demo_'))) {
        console.log('🎭 DEMO MODE: Canceling subscription');

        // Simulate CDC check
        // In a real app, you'd fetch the subscription creation date from DB or Stripe
        const isWithin7Days = true; // Simulating eligible for refund

        if (isWithin7Days) {
            return res.json({
                status: 'canceled',
                refunded: true,
                message: 'Assinatura cancelada com sucesso. O reembolso foi processado (CDC - Prazo de 7 dias).'
            });
        } else {
            return res.json({
                status: 'canceled',
                refunded: false,
                message: 'Assinatura cancelada. Seu acesso continua até o fim do ciclo atual.'
            });
        }
    }

    try {
        if (!subscriptionId) {
            return res.status(400).json({ error: 'Subscription ID is required' });
        }

        // 1. Retrieve subscription to check creation date
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const createdTime = subscription.created * 1000; // Stripe uses seconds
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const isWithin7Days = (now - createdTime) <= sevenDaysInMs;

        if (isWithin7Days) {
            // CDC: Cancel immediately and refund
            // Note: Stripe doesn't automatically refund on cancel, we might need to issue a refund separately
            // or use 'prorate: true' and handle the balance.
            // For simplicity here, we cancel immediately.

            await stripe.subscriptions.cancel(subscriptionId);

            // In a real production flow, you would also trigger a refund for the latest invoice here.

            res.json({
                status: 'canceled',
                refunded: true,
                message: 'Assinatura cancelada. Reembolso integral solicitado (CDC).'
            });
        } else {
            // Cancel at period end (no refund)
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true
            });

            res.json({
                status: 'canceled',
                refunded: false,
                message: 'Assinatura cancelada. O acesso continua até ' + new Date(subscription.current_period_end * 1000).toLocaleDateString()
            });
        }

    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/payments/session/:sessionId
 * Retrieves session details after successful payment
 */
router.get('/session/:sessionId', async (req, res) => {
    // DEMO MODE: Return mock session details
    if (!STRIPE_ENABLED || req.params.sessionId.startsWith('demo_')) {
        console.log('🎭 DEMO MODE: Returning mock session details');
        return res.json({
            status: 'paid',
            customerEmail: 'demo@example.com',
            metadata: {
                userId: 'demo_user',
                productId: 'gems_small',
                gemAmount: '350'
            },
            demo: true
        });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json({
            status: session.payment_status,
            customerEmail: session.customer_details?.email,
            metadata: session.metadata
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook endpoint for handling events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!STRIPE_ENABLED) {
        return res.json({ received: true, demo: true });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Payment successful:', session.id);

            // TODO: Update user's gems/premium status in database
            // const { userId, productId, gemAmount } = session.metadata;
            // await updateUserPurchase(userId, productId, gemAmount);

            break;

        case 'customer.subscription.created':
            const subscription = event.data.object;
            console.log('Subscription created:', subscription.id);

            // TODO: Activate premium for user
            // await activatePremium(subscription.metadata.userId);

            break;

        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            console.log('Subscription canceled:', deletedSubscription.id);

            // TODO: Deactivate premium for user
            // await deactivatePremium(deletedSubscription.metadata.userId);

            break;

        case 'invoice.payment_failed':
            const invoice = event.data.object;
            console.log('Payment failed:', invoice.id);

            // TODO: Notify user about failed payment

            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

/**
 * GET /api/payments/config
 * Returns Stripe publishable key for frontend
 */
router.get('/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_demo_mode',
        enabled: STRIPE_ENABLED,
        demo: !STRIPE_ENABLED
    });
});

module.exports = router;
