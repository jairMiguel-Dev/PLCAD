import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance
 */
export const getStripe = () => {
    if (!stripePromise) {
        // Fetch publishable key from backend
        stripePromise = fetch('/api/payments/config')
            .then(res => res.json())
            .then(data => loadStripe(data.publishableKey))
            .catch(err => {
                console.error('Failed to load Stripe:', err);
                return null;
            });
    }
    return stripePromise;
};

/**
 * Create a checkout session for one-time purchases (gems)
 */
export const createCheckoutSession = async (productId: string, userId?: string) => {
    try {
        const response = await fetch('/api/payments/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const { sessionId, url } = await response.json();

        // Redirect to Stripe Checkout
        if (url) {
            window.location.href = url;
        }

        return sessionId;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

/**
 * Create a subscription checkout session (premium)
 */
export const createSubscription = async (productId: string, userId?: string) => {
    try {
        const response = await fetch('/api/payments/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to create subscription');
        }

        const { sessionId, url } = await response.json();

        // Redirect to Stripe Checkout
        if (url) {
            window.location.href = url;
        }

        return sessionId;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
};

/**
 * Retrieve session details after payment
 */
export const getSessionDetails = async (sessionId: string) => {
    try {
        const response = await fetch(`/api/payments/session/${sessionId}`);

        if (!response.ok) {
            throw new Error('Failed to retrieve session');
        }

        return await response.json();
    } catch (error) {
        console.error('Error retrieving session:', error);
        throw error;
    }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId: string) => {
    try {
        const response = await fetch('/api/payments/cancel-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
};

/**
 * Product IDs matching backend
 */
export const STRIPE_PRODUCTS = {
    GEMS_SMALL: 'gems_small',
    GEMS_MEDIUM: 'gems_medium',
    PREMIUM_MONTHLY: 'premium_monthly',
    PREMIUM_YEARLY: 'premium_yearly',
} as const;

export type StripeProductId = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS];
