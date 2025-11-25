import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Database, Lock, Eye, AlertTriangle, CheckCircle, FileText, Zap } from 'lucide-react';
import { Button } from './Button';

interface TermsModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, onDecline }) => {
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');
    const [hasScrolled, setHasScrolled] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
        if (isNearBottom && !hasScrolled) {
            setHasScrolled(true);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                style={{ height: '100dvh' }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                    <Shield size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">ProGLES</h2>
                                    <p className="text-purple-100 text-sm">Versão Beta - Termos de Uso</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('terms')}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${activeTab === 'terms'
                                        ? 'bg-white text-purple-600'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <FileText className="inline mr-2" size={16} />
                                Termos de Uso
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${activeTab === 'privacy'
                                        ? 'bg-white text-purple-600'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <Eye className="inline mr-2" size={16} />
                                Privacidade
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-800 dark:text-gray-200"
                        onScroll={handleScroll}
                    >
                        {activeTab === 'terms' ? (
                            <>
                                {/* Aviso Beta */}
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">
                                                🚧 Software em Fase Beta
                                            </h3>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                O ProGLES está em desenvolvimento ativo. Funcionalidades podem ser modificadas,
                                                adicionadas ou removidas sem aviso prévio. Use por sua conta e risco.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                                        <CheckCircle size={24} />
                                        1. Aceitação dos Termos
                                    </h3>
                                    <p className="leading-relaxed">
                                        Ao acessar e usar a plataforma ProGLES, você concorda integralmente com estes Termos de Uso.
                                        Se você não concorda com qualquer parte destes termos, não deve usar a plataforma.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                                        <Database size={24} />
                                        2. Armazenamento de Dados
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        <strong>Banco de Dados PostgreSQL:</strong> Seus dados de progresso, conquistas e informações
                                        de conta são armazenados em um banco de dados PostgreSQL seguro e hospedado em servidores confiáveis.
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                                        <li>Email e senha (criptografada com bcrypt)</li>
                                        <li>Nome de usuário e progresso nas lições</li>
                                        <li>XP, conquistas, streak e gemas</li>
                                        <li>Status de assinatura premium</li>
                                        <li>Histórico de missões e conceitos aprendidos</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                                        <Lock size={24} />
                                        3. Segurança
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        Implementamos medidas de segurança padrão da indústria:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                                        <li><strong>Criptografia de senhas</strong> com bcrypt (10 rounds)</li>
                                        <li><strong>Autenticação JWT</strong> com tokens de 7 dias de validade</li>
                                        <li><strong>HTTPS obrigatório</strong> em todas as comunicações</li>
                                        <li><strong>Proteção CORS</strong> contra requisições não autorizadas</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                                        <Zap size={24} />
                                        4. Conta e Responsabilidades
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        <strong>Você é responsável por:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                                        <li>Manter a confidencialidade de sua senha</li>
                                        <li>Todas as atividades realizadas em sua conta</li>
                                        <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                                        <li>Fornecer informações verdadeiras durante o cadastro</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3">
                                        5. Assinatura Premium
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        Assinaturas premium são processadas via <strong>Stripe</strong>. Ao assinar, você concorda com:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                                        <li>Cobranças recorrentes até cancelamento</li>
                                        <li>Cancelamento pode ser feito a qualquer momento no perfil</li>
                                        <li>Sem reembolsos para períodos parciais já cobrados</li>
                                        <li>Benefícios premium cessam imediatamente após cancelamento</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3">
                                        6. Exclusão de Conta
                                    </h3>
                                    <p className="leading-relaxed">
                                        Você pode <strong>excluir sua conta permanentemente</strong> a qualquer momento através
                                        das configurações do perfil. Esta ação é <strong className="text-red-600">IRREVERSÍVEL</strong> e
                                        resultará na exclusão completa de todos os seus dados do banco de dados PostgreSQL.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3">
                                        7. Limitações de Responsabilidade
                                    </h3>
                                    <p className="leading-relaxed">
                                        O ProGLES Beta é fornecido "como está". Não garantimos disponibilidade ininterrupta,
                                        ausência de bugs ou que atenderá suas expectativas específicas. Não nos responsabilizamos
                                        por perdas de progresso devido a falhas técnicas durante a fase beta.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400 mb-3">
                                        8. Modificações nos Termos
                                    </h3>
                                    <p className="leading-relaxed">
                                        Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas
                                        serão notificadas através da plataforma. O uso contínuo após modificações constitui aceitação
                                        dos novos termos.
                                    </p>
                                </section>
                            </>
                        ) : (
                            <>
                                {/* Política de Privacidade */}
                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                        <Database size={24} />
                                        Coleta de Dados
                                    </h3>
                                    <p className="leading-relaxed mb-3">
                                        Coletamos e armazenamos os seguintes dados em nosso banco PostgreSQL:
                                    </p>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <strong>Dados de Conta:</strong> Email, nome de usuário, senha criptografada (bcrypt)
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <strong>Progresso:</strong> Níveis completados, XP total, streak, gemas, conquistas
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <strong>Aprendizado:</strong> Conceitos dominados, missões ativas, vidas restantes
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <strong>Financeiro:</strong> Status de assinatura premium (via Stripe)
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                        <Eye size={24} />
                                        Uso dos Dados
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        Usamos seus dados exclusivamente para:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                                        <li>Fornecer e melhorar a experiência de aprendizado</li>
                                        <li>Sincronizar progresso entre dispositivos</li>
                                        <li>Processar pagamentos de assinaturas premium</li>
                                        <li>Analisar métricas agregadas de uso (nunca individualizadas)</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                        <Lock size={24} />
                                        Proteção de Dados
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        <strong>Medidas de segurança implementadas:</strong>
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                                        <p className="font-semibold text-blue-800 dark:text-blue-300">🔐 Criptografia</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                                            <li>Senhas: bcrypt com 10 salt rounds</li>
                                            <li>Comunicação: HTTPS/TLS 1.3</li>
                                            <li>Tokens: JWT com assinatura HMAC SHA-256</li>
                                        </ul>

                                        <p className="font-semibold text-blue-800 dark:text-blue-300 mt-3">🛡️ Infraestrutura</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                                            <li>Banco PostgreSQL gerenciado (Render/Neon)</li>
                                            <li>Backups automáticos diários</li>
                                            <li>Firewall e proteção DDoS</li>
                                            <li>Logs de acesso monitorados</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3">
                                        Compartilhamento de Dados
                                    </h3>
                                    <p className="leading-relaxed">
                                        <strong className="text-green-600 dark:text-green-400">Nunca vendemos seus dados.</strong>
                                        Compartilhamos informações apenas com:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-gray-700 dark:text-gray-300">
                                        <li><strong>Stripe:</strong> Dados de pagamento (email, nome) para processar assinaturas</li>
                                        <li><strong>Provedores de hospedagem:</strong> Render/Neon (armazenamento seguro)</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3">
                                        Seus Direitos (LGPD)
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        Você tem direito a:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                                        <li><strong>Acessar:</strong> Visualizar todos os dados armazenados sobre você</li>
                                        <li><strong>Corrigir:</strong> Atualizar informações incorretas (perfil)</li>
                                        <li><strong>Excluir:</strong> Apagar permanentemente sua conta e todos os dados</li>
                                        <li><strong>Portabilidade:</strong> Exportar seus dados (em desenvolvimento)</li>
                                        <li><strong>Revogar:</strong> Cancelar consentimento a qualquer momento</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3">
                                        Cookies e Rastreamento
                                    </h3>
                                    <p className="leading-relaxed">
                                        Usamos <strong>apenas cookies essenciais</strong> para autenticação (token JWT no localStorage).
                                        Não utilizamos cookies de rastreamento, analytics ou publicidade de terceiros.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mb-3">
                                        Contato
                                    </h3>
                                    <p className="leading-relaxed">
                                        Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:
                                    </p>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mt-2">
                                        <p className="font-mono text-purple-700 dark:text-purple-300">
                                            📧 Email: privacy@progles.com<br />
                                            🌐 GitHub: github.com/jairMiguel-Dev/PLCAD
                                        </p>
                                    </div>
                                </section>
                            </>
                        )}

                        {/* Última atualização */}
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p>Última atualização: 25 de novembro de 2024</p>
                            <p className="mt-1">Versão Beta 2.0</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t-2 border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {onDecline && (
                                <button
                                    onClick={onDecline}
                                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition-colors"
                                >
                                    Recusar
                                </button>
                            )}
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={onAccept}
                                disabled={!hasScrolled}
                                className="flex-1"
                            >
                                {hasScrolled ? (
                                    <>
                                        <CheckCircle className="inline mr-2" size={20} />
                                        Aceito os Termos e Política
                                    </>
                                ) : (
                                    'Role até o fim para aceitar'
                                )}
                            </Button>
                        </div>
                        {!hasScrolled && (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                ⬇️ Continue lendo para habilitar o botão de aceitar
                            </p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
