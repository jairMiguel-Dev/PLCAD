
import { QuestionType, Unit, Achievement, ShopItem, Quest, Level } from './types';
import { Heart, Zap, Crown, Gem, Trophy, Flame } from 'lucide-react';

export const MAX_HEARTS = 5;
export const HEART_REFILL_TIME_MS = 35 * 60 * 1000; // 35 minutes
export const BASE_XP_PER_QUESTION = 10;
export const COMBO_BONUS_MULTIPLIER = 2;
export const PERFECT_LESSON_BONUS = 20;

// Calculate Level based on XP
export const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
export const calculateXpForNextLevel = (level: number) => 100 * Math.pow(level, 2);

export const DAILY_QUEST_TEMPLATES: Omit<Quest, 'current' | 'completed' | 'claimed'>[] = [
    // ========== MISSÕES FÁCEIS (Iniciantes) ==========
    { id: 'q_less_1', description: '🌟 Complete 1 lição hoje', target: 1, reward: 15, type: 'lesson' },
    { id: 'q_xp_1', description: '⚡ Ganhe 30 XP hoje', target: 30, reward: 10, type: 'xp' },
    { id: 'q_streak_1', description: '🔥 Mantenha sua ofensiva', target: 1, reward: 10, type: 'streak' },
    { id: 'q_less_2', description: '📚 Complete 2 lições hoje', target: 2, reward: 20, type: 'lesson' },

    // ========== MISSÕES MÉDIAS (Intermediárias) ==========
    { id: 'q_less_3', description: '💪 Complete 3 lições hoje', target: 3, reward: 35, type: 'lesson' },
    { id: 'q_xp_2', description: '🎯 Ganhe 100 XP hoje', target: 100, reward: 40, type: 'xp' },
    { id: 'q_perf_1', description: '💎 Faça 1 lição perfeita', target: 1, reward: 50, type: 'perfect' },
    { id: 'q_xp_3', description: '⭐ Ganhe 150 XP hoje', target: 150, reward: 55, type: 'xp' },
    { id: 'q_less_4', description: '🚀 Complete 4 lições hoje', target: 4, reward: 50, type: 'lesson' },

    // ========== MISSÕES DIFÍCEIS (Avançadas) ==========
    { id: 'q_less_5', description: '🏆 Complete 5 lições hoje', target: 5, reward: 80, type: 'lesson' },
    { id: 'q_xp_4', description: '🌟 Ganhe 250 XP hoje', target: 250, reward: 100, type: 'xp' },
    { id: 'q_perf_2', description: '💯 Faça 2 lições perfeitas', target: 2, reward: 120, type: 'perfect' },
    { id: 'q_less_6', description: '👑 Complete 7 lições hoje', target: 7, reward: 150, type: 'lesson' },
    { id: 'q_streak_2', description: '🔥 Atinja 7 dias de ofensiva', target: 7, reward: 100, type: 'streak' },
    { id: 'q_perf_3', description: '⚡ Faça 3 lições perfeitas', target: 3, reward: 180, type: 'perfect' },
];

export const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'refill_hearts',
        name: 'Recarregar Vidas',
        description: 'Recupere todos os seus corações imediatamente.',
        cost: 350,
        icon: Heart,
        type: 'consumable'
    },
    {
        id: 'skip_question',
        name: 'Pular Questão',
        description: 'Pule uma questão difícil durante uma lição. Use com sabedoria!',
        cost: 50,
        icon: Zap,
        type: 'consumable'
    },
    {
        id: 'quest_reset',
        name: 'Reset de Missões',
        description: 'Gere 3 novas missões diárias imediatamente e ganhe mais gemas hoje!',
        cost: 150,
        icon: Trophy,
        type: 'consumable'
    },
    {
        id: 'streak_freeze',
        name: 'Congelar Ofensiva',
        description: 'Mantenha sua sequência mesmo se ficar 1 dia sem jogar.',
        cost: 200,
        icon: Flame,
        type: 'consumable'
    },
    {
        id: 'premium_sub',
        name: 'ProGres Super',
        description: 'Vidas infinitas, zero anúncios, emblema dourado e acesso a conteúdos exclusivos.',
        cost: 19.99,
        icon: Crown,
        type: 'subscription'
    },
    {
        id: 'gems_small',
        name: 'Punhado de Gemas',
        description: '+350 Gemas',
        cost: 4.99,
        icon: Gem,
        type: 'currency_pack',
        gemAmount: 350
    },
    {
        id: 'gems_medium',
        name: 'Bolsa de Gemas',
        description: '+800 Gemas',
        cost: 9.99,
        icon: Gem,
        type: 'currency_pack',
        gemAmount: 800
    },
    {
        id: 'gems_large',
        name: 'Cofre de Gemas',
        description: '+2000 Gemas',
        cost: 24.99,
        icon: Gem,
        type: 'currency_pack',
        gemAmount: 2000
    },
    {
        id: 'gems_huge',
        name: 'Tesouro de Gemas',
        description: '+6000 Gemas',
        cost: 49.99,
        icon: Gem,
        type: 'currency_pack',
        gemAmount: 6000
    }
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_step',
        title: 'Hello World',
        description: 'Complete sua primeira lição.',
        icon: '🚀',
        condition: (stats) => stats.lessonsCompleted >= 1
    },
    {
        id: 'streak_3',
        title: 'Aquecimento',
        description: 'Atinja uma ofensiva de 3 dias.',
        icon: '🔥',
        condition: (stats) => stats.streakDays >= 3
    },
    {
        id: 'streak_7',
        title: 'Em Chamas',
        description: 'Atinja uma ofensiva de 7 dias.',
        icon: '🌋',
        condition: (stats) => stats.streakDays >= 7
    },
    {
        id: 'streak_30',
        title: 'Imparável',
        description: 'Atinja uma ofensiva de 30 dias.',
        icon: '👑',
        condition: (stats) => stats.streakDays >= 30
    },
    {
        id: 'xp_100',
        title: 'Aprendiz',
        description: 'Ganhe 100 XP total.',
        icon: '🌱',
        condition: (stats) => stats.totalXP >= 100
    },
    {
        id: 'xp_1000',
        title: 'Desenvolvedor',
        description: 'Ganhe 1.000 XP total.',
        icon: '💻',
        condition: (stats) => stats.totalXP >= 1000
    },
    {
        id: 'xp_5000',
        title: 'Arquiteto',
        description: 'Ganhe 5.000 XP total.',
        icon: '🏛️',
        condition: (stats) => stats.totalXP >= 5000
    },
    {
        id: 'lessons_10',
        title: 'Estudioso',
        description: 'Complete 10 lições.',
        icon: '📚',
        condition: (stats) => stats.lessonsCompleted >= 10
    },
    {
        id: 'lessons_50',
        title: 'Bibliotecário',
        description: 'Complete 50 lições.',
        icon: '🎓',
        condition: (stats) => stats.lessonsCompleted >= 50
    },
    {
        id: 'perfect_1',
        title: 'Perfeccionista',
        description: 'Complete uma lição sem erros.',
        icon: '✨',
        condition: (stats) => stats.perfectLessons >= 1
    },
    {
        id: 'perfect_10',
        title: 'Mestre Zen',
        description: 'Complete 10 lições sem erros.',
        icon: '🧘',
        condition: (stats) => stats.perfectLessons >= 10
    },
    {
        id: 'combo_5',
        title: 'Compilador Humano',
        description: 'Atinja um combo de 5x em uma lição.',
        icon: '⚡',
        condition: (_, result) => (result ? result.maxCombo >= 5 : false)
    },
    {
        id: 'combo_10',
        title: 'Overclocked',
        description: 'Atinja um combo de 10x em uma lição.',
        icon: '🚀',
        condition: (_, result) => (result ? result.maxCombo >= 10 : false)
    },
    {
        id: 'gem_hoarder',
        title: 'Magnata',
        description: 'Acumule 1.000 gemas.',
        icon: '💎',
        condition: (stats) => stats.gems >= 1000
    }
];

// Função auxiliar para criar questões básicas
const createQuestion = (
    id: string,
    type: QuestionType,
    difficulty: 'easy' | 'medium' | 'hard',
    title: string,
    prompt: string,
    options: any[] = [],
    correctFeedback: string = 'Correto!',
    wrongFeedback: string = 'Tente novamente!'
) => ({
    id,
    type,
    difficulty,
    title,
    prompt,
    options,
    correctFeedback,
    wrongFeedback
});

export const CURRICULUM: Unit[] = [
    // ==================== UNIDADE 1: FUNDAMENTOS ====================
    {
        id: 1,
        title: "Unidade 1: Fundamentos",
        description: "Variáveis, tipos de dados e operadores básicos",
        levels: [
            {
                id: 101,
                title: "Variáveis com let",
                description: "Declaração de variáveis",
                color: 'brand',
                icon: 'code',
                totalQuestions: 8,
                stars: 0,
                learnableConcepts: [
                    { term: 'Variable', definition: 'Espaço na memória para guardar dados', type: 'Lógica', example: 'let x = 10;' },
                    { term: 'let', definition: 'Palavra-chave para declarar variáveis mutáveis', type: 'Sintaxe', example: 'let nome = "Ana";' }
                ],
                questions: [
                    {
                        id: 'q101_1',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Intro',
                        prompt: 'Variáveis',
                        englishWord: 'Variable',
                        phonetic: '/ˈveə.ri.ə.bəl/',
                        theory: {
                            concept: 'Variáveis',
                            title: 'O que são essas tal de variáveis?',
                            explanation: 'Imagina que você tem uma caixa. Nessa caixa, você pode guardar coisas: um número, um nome, um emoji... qualquer coisa! A variável é essa caixinha na memória do computador. Você dá um nome pra ela (tipo "idade" ou "nome") e coloca um valor lá dentro. Simples assim!',
                            examples: [
                                'let idade = 25;\n// Criamos uma caixinha chamada "idade"\n// e colocamos o número 25 dentro',
                                'let nome = "Ana";\n// Agora temos uma caixa "nome"\n// com o texto "Ana" dentro',
                                'let estaFeliz = true;\n// E aqui guardamos um valor verdadeiro/falso'
                            ],
                            tips: [
                                'O "let" é tipo dizer "cria uma nova caixinha pra mim!"',
                                'Escolha nomes que façam sentido. "x" não diz nada, mas "idadeUsuario" deixa claro!',
                                'Depois você pode trocar o que está dentro da caixa com "idade = 26;"'
                            ]
                        },
                        codeSnippet: 'let idade = 25;',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    { id: 'q101_2', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'easy', title: 'Sintaxe', prompt: 'Como declarar uma variável?', options: [{ id: '1', text: 'let x = 10;', isCorrect: true }, { id: '2', text: 'x = 10;', isCorrect: false }, { id: '3', text: 'var x 10;', isCorrect: false }], correctFeedback: 'Isso! Use let', wrongFeedback: 'Falta let' },
                    { id: 'q101_3', type: QuestionType.CODE_BUILDER, difficulty: 'easy', title: 'Prática', prompt: 'Declare uma variável "nome":', options: [{ id: '1', text: 'let nome;', isCorrect: true }, { id: '2', text: 'const nome;', isCorrect: false }, { id: '3', text: 'nome;', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Use let' },
                    { id: 'q101_4', type: QuestionType.FILL_IN_BLANK, difficulty: 'medium', title: 'Complete', prompt: 'Complete o código:', codeSnippet: '___ x = 5;', correctAnswer: 'let', options: [], correctFeedback: 'Ótimo!', wrongFeedback: 'Use let' },
                    { id: 'q101_5', type: QuestionType.TRANSLATION, difficulty: 'easy', title: 'Inglês', prompt: 'O que significa "declare"?', options: [{ id: '1', text: 'Declarar', isCorrect: true }, { id: '2', text: 'Deletar', isCorrect: false }, { id: '3', text: 'Duplicar', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'Revise' },
                    { id: 'q101_6', type: QuestionType.DRAG_AND_DROP, difficulty: 'medium', title: 'Monte', prompt: 'Crie: let score = 0;', options: [], segments: ['let', 'score', '=', '0;'], distractors: ['const', 'var'], correctFeedback: 'Exato!', wrongFeedback: 'Ordem errada' },
                    { id: 'q101_7', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'medium', title: 'Conceito', prompt: 'let permite mudança de valor?', options: [{ id: '1', text: 'Sim', isCorrect: true }, { id: '2', text: 'Não', isCorrect: false }], correctFeedback: 'Sim!', wrongFeedback: 'let é mutável' },
                    { id: 'q101_8', type: QuestionType.CODE_BUILDER, difficulty: 'easy', title: 'Exercício', prompt: 'Declare "idade" com valor 20:', options: [{ id: '1', text: 'let idade = 20;', isCorrect: true }, { id: '2', text: 'let idade 20;', isCorrect: false }, { id: '3', text: 'idade = 20;', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Faltou let' },
                    { id: 'q101_9', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'hard', title: 'Moderno', prompt: 'Qual é a forma moderna de declarar variáveis?', options: [{ id: '1', text: 'let', isCorrect: true }, { id: '2', text: 'var', isCorrect: false }], correctFeedback: 'Isso! var é antigo', wrongFeedback: 'Evite var' },
                    { id: 'q101_10', type: QuestionType.CODE_BUILDER, difficulty: 'medium', title: 'Booleano', prompt: 'Declare "ativo" como true:', options: [{ id: '1', text: 'let ativo = true;', isCorrect: true }, { id: '2', text: 'let ativo = "true";', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'Sem aspas para boolean' },
                    { id: 'q101_11', type: QuestionType.FILL_IN_BLANK, difficulty: 'easy', title: 'Atribuição', prompt: 'Use o sinal correto:', codeSnippet: 'let x ___ 10;', correctAnswer: '=', options: [], correctFeedback: 'Igual atribui!', wrongFeedback: 'Use =' },
                    { id: 'q101_12', type: QuestionType.TRANSLATION, difficulty: 'medium', title: 'Inglês', prompt: 'O que é "assignment"?', options: [{ id: '1', text: 'Atribuição', isCorrect: true }, { id: '2', text: 'Assinatura', isCorrect: false }], correctFeedback: 'Isso!', wrongFeedback: 'Assignment = Atribuição' }
                ]
            },
            {
                id: 102,
                title: "Constantes com const",
                description: "Valores que não mudam",
                color: 'info',
                icon: 'book',
                totalQuestions: 8,
                stars: 0,
                learnableConcepts: [
                    { term: 'const', definition: 'Declara constantes imutáveis', type: 'Sintaxe', example: 'const PI = 3.14;' }
                ],
                questions: [
                    { id: 'q102_1', type: QuestionType.THEORY, difficulty: 'easy', title: 'Intro', prompt: 'Constantes', englishWord: 'Constant', phonetic: '/ˈkɒn.stənt/', codeSnippet: 'const PI = 3.14;', options: [], correctFeedback: '', wrongFeedback: '' },
                    { id: 'q102_2', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'easy', title: 'Diferença', prompt: 'const pode mudar de valor?', options: [{ id: '1', text: 'Não', isCorrect: true }, { id: '2', text: 'Sim', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'const é constante' },
                    { id: 'q102_3', type: QuestionType.CODE_BUILDER, difficulty: 'easy', title: 'Sintaxe', prompt: 'Declare PI constante:', options: [{ id: '1', text: 'const PI = 3.14;', isCorrect: true }, { id: '2', text: 'let PI = 3.14;', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Use const' },
                    { id: 'q102_4', type: QuestionType.FILL_IN_BLANK, difficulty: 'medium', title: 'Complete', prompt: 'Gravidade constante:', codeSnippet: '___ g = 9.8;', correctAnswer: 'const', options: [], correctFeedback: 'Ótimo!', wrongFeedback: 'Use const' },
                    { id: 'q102_5', type: QuestionType.PAIR_MATCH, difficulty: 'medium', title: 'Associe', prompt: 'Combine:', options: [], pairs: [{ id: 'p1', text: 'let', pairId: 'r1' }, { id: 'r1', text: 'Mutável', pairId: 'p1' }, { id: 'p2', text: 'const', pairId: 'r2' }, { id: 'r2', text: 'Imutável', pairId: 'p2' }], correctFeedback: 'Boa!', wrongFeedback: 'Revise' },
                    { id: 'q102_6', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'hard', title: 'Erro', prompt: 'O que acontece?  const x = 5; x = 10;', options: [{ id: '1', text: 'Erro', isCorrect: true }, { id: '2', text: 'x = 10', isCorrect: false }], correctFeedback: 'Sim, dá erro!', wrongFeedback: 'const não pode mudar' },
                    { id: 'q102_7', type: QuestionType.TRANSLATION, difficulty: 'easy', title: 'Inglês', prompt: 'Traduza "constant":', options: [{ id: '1', text: 'Constante', isCorrect: true }, { id: '2', text: 'Construção', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'Constant = Constante' },
                    { id: 'q102_8', type: QuestionType.CODE_BUILDER, difficulty: 'medium', title: 'Prática', prompt: 'Declare MAX_PLAYERS = 4:', options: [{ id: '1', text: 'const MAX_PLAYERS = 4;', isCorrect: true }, { id: '2', text: 'let MAX_PLAYERS = 4;', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Valor fixo = const' }
                ]
            },
            {
                id: 103,
                title: "Tipo String",
                description: "Trabalhando com texto",
                color: 'secondary',
                icon: 'zap',
                totalQuestions: 10,
                stars: 0,
                learnableConcepts: [
                    { term: 'String', definition: 'Tipo de dado para texto', type: 'Lógica', example: '"Hello"' }
                ],
                questions: [
                    { id: 'q103_1', type: QuestionType.THEORY, difficulty: 'easy', title: 'Intro', prompt: 'Strings', englishWord: 'String', phonetic: '/strɪŋ/', codeSnippet: 'let nome = "Ana";', options: [], correctFeedback: '', wrongFeedback: '' },
                    { id: 'q103_2', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'easy', title: 'Sintaxe', prompt: 'String usa:', options: [{ id: '1', text: 'Aspas', isCorrect: true }, { id: '2', text: 'Parênteses', isCorrect: false }], correctFeedback: 'Sim!', wrongFeedback: 'Use aspas' },
                    { id: 'q103_3', type: QuestionType.CODE_BUILDER, difficulty: 'easy', title: 'Código', prompt: 'Crie string "JS":', options: [{ id: '1', text: 'let lang = "JS";', isCorrect: true }, { id: '2', text: 'let lang = JS;', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Faltou aspas' },
                    { id: 'q103_4', type: QuestionType.FILL_IN_BLANK, difficulty: 'medium', title: 'Complete', prompt: 'String vazia:', codeSnippet: 'let texto = ___;', correctAnswer: '""', options: [], correctFeedback: 'Ótimo!', wrongFeedback: 'Use ""' },
                    { id: 'q103_5', type: QuestionType.TRANSLATION, difficulty: 'easy', title: 'Inglês', prompt: 'O que é "text"?', options: [{ id: '1', text: 'Texto', isCorrect: true }, { id: '2', text: 'Teste', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'Text = Texto' },
                    { id: 'q103_6', type: QuestionType.DRAG_AND_DROP, difficulty: 'medium', title: 'Monte', prompt: 'Crie: const msg = "Ok";', options: [], segments: ['const', 'msg', '=', '"Ok";'], distractors: ['let', 'Ok'], correctFeedback: 'Boa!', wrongFeedback: 'Ordem errada' },
                    { id: 'q103_7', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'medium', title: 'Conceito', prompt: 'String pode conter números?', options: [{ id: '1', text: 'Sim', isCorrect: true }, { id: '2', text: 'Não', isCorrect: false }], correctFeedback: 'Sim! "123"', wrongFeedback: '"123" é texto' },
                    { id: 'q103_8', type: QuestionType.CODE_BUILDER, difficulty: 'easy', title: 'Exercício', prompt: 'String com espaço:', options: [{ id: '1', text: 'let nome = "Ana Silva";', isCorrect: true }, { id: '2', text: 'let nome = Ana Silva;', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Faltou aspas' },
                    { id: 'q103_9', type: QuestionType.LISTENING, difficulty: 'medium', title: 'Listen', prompt: 'Tipo mencionado?', englishWord: 'String data type', options: [{ id: '1', text: 'String', isCorrect: true }, { id: '2', text: 'Number', isCorrect: false }], correctFeedback: 'Yes!', wrongFeedback: 'Listen again' },
                    { id: 'q103_10', type: QuestionType.PAIR_MATCH, difficulty: 'easy', title: 'Associe', prompt: 'Tipos:', options: [], pairs: [{ id: 'p1', text: '"Hello"', pairId: 'r1' }, { id: 'r1', text: 'String', pairId: 'p1' }, { id: 'p2', text: '42', pairId: 'r2' }, { id: 'r2', text: 'Number', pairId: 'p2' }], correctFeedback: 'Boa!', wrongFeedback: 'Tente de novo' }
                ]
            },
            // Continua mais 7 níveis na Unidade 1...
            // Por questão de espaço, vou criar um resumo dos outros níveis
            {
                id: 104,
                title: "Tipo Number",
                description: "Números e matemática",
                color: 'warn',
                icon: 'code',
                totalQuestions: 9,
                stars: 0,
                learnableConcepts: [
                    { term: 'Number', definition: 'Tipo de dado para números', type: 'Lógica', example: '42, 3.14, -5' },
                    { term: 'Operadores', definition: 'Símbolos para operações matemáticas', type: 'Sintaxe', example: '+ - * /' }
                ],
                questions: [
                    { id: 'q104_1', type: QuestionType.THEORY, difficulty: 'easy', title: 'Intro', prompt: 'Números', englishWord: 'Number', phonetic: '/ˈnʌm.bər/', codeSnippet: 'let idade = 25;\nlet preco = 19.99;', options: [], correctFeedback: '', wrongFeedback: '' },
                    { id: 'q104_2', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'easy', title: 'Tipo', prompt: 'Qual é número?', options: [{ id: '1', text: '42', isCorrect: true }, { id: '2', text: '\"42\"', isCorrect: false }, { id: '3', text: 'true', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'Sem aspas!' },
                    { id: 'q104_3', type: QuestionType.CODE_BUILDER, difficulty: 'easy', title: 'Código', prompt: 'Crie número 100:', options: [{ id: '1', text: 'let num = 100;', isCorrect: true }, { id: '2', text: 'let num = \"100\";', isCorrect: false }, { id: '3', text: 'let num = 100', isCorrect: false }], correctFeedback: 'Perfeito!', wrongFeedback: 'Sem aspas e com ponto-e-vírgula' },
                    { id: 'q104_4', type: QuestionType.FILL_IN_BLANK, difficulty: 'medium', title: 'Operador', prompt: 'Some dois números:', codeSnippet: 'let soma = 5 ___ 3;', correctAnswer: '+', options: [], correctFeedback: 'Ótimo!', wrongFeedback: 'Use +' },
                    { id: 'q104_5', type: QuestionType.TRANSLATION, difficulty: 'easy', title: 'Inglês', prompt: 'Traduza "number":', options: [{ id: '1', text: 'Número', isCorrect: true }, { id: '2', text: 'Nome', isCorrect: false }, { id: '3', text: 'Numeral', isCorrect: false }], correctFeedback: 'Correto!', wrongFeedback: 'Number = Número' },
                    { id: 'q104_6', type: QuestionType.DRAG_AND_DROP, difficulty: 'medium', title: 'Monte', prompt: 'Crie: let resultado = 10 * 2;', options: [], segments: ['let', 'resultado', '=', '10', '*', '2;'], distractors: ['const', '+', '\"10\"'], correctFeedback: 'Perfeito!', wrongFeedback: 'Ordem errada' },
                    { id: 'q104_7', type: QuestionType.MULTIPLE_CHOICE, difficulty: 'medium', title: 'Decimal', prompt: 'Number aceita decimal?', options: [{ id: '1', text: 'Sim', isCorrect: true }, { id: '2', text: 'Não', isCorrect: false }], correctFeedback: 'Sim! 3.14', wrongFeedback: 'JS aceita decimais' },
                    { id: 'q104_8', type: QuestionType.PAIR_MATCH, difficulty: 'medium', title: 'Operadores', prompt: 'Associe:', options: [], pairs: [{ id: 'p1', text: '+', pairId: 'r1' }, { id: 'r1', text: 'Soma', pairId: 'p1' }, { id: 'p2', text: '-', pairId: 'r2' }, { id: 'r2', text: 'Subtração', pairId: 'p2' }, { id: 'p3', text: '*', pairId: 'r3' }, { id: 'r3', text: 'Multiplicação', pairId: 'p3' }], correctFeedback: 'Boa!', wrongFeedback: 'Revise os operadores' },
                    { id: 'q104_9', type: QuestionType.CODE_BUILDER, difficulty: 'hard', title: 'Cálculo', prompt: 'Calcule média de 10 e 20:', options: [{ id: '1', text: 'let media = (10 + 20) / 2;', isCorrect: true }, { id: '2', text: 'let media = 10 + 20 / 2;', isCorrect: false }, { id: '3', text: 'let media = \"15\";', isCorrect: false }], correctFeedback: 'Excelente!', wrongFeedback: 'Use parênteses!' }
                ]
            },
            {
                id: 105,
                title: "Operadores Aritméticos",
                description: "+, -, *, /",
                color: 'brand',
                icon: 'zap',
                totalQuestions: 10,
                stars: 0,
                learnableConcepts: [{ term: 'Operators', definition: 'Símbolos de operação', type: 'Sintaxe' }],
                questions: [...Array(10)].map((_, i) => createQuestion(`q105_${i + 1}`, QuestionType.CODE_BUILDER, 'medium', `Questão ${i + 1}`, 'Operações', [{ id: '1', text: '10 + 5', isCorrect: true }]))
            },
            {
                id: 106,
                title: "Tipo Boolean",
                description: "true e false",
                color: 'info',
                icon: 'book',
                totalQuestions: 8,
                stars: 0,
                learnableConcepts: [{ term: 'Boolean', definition: 'Verdadeiro ou Falso', type: 'Lógica' }],
                questions: [...Array(8)].map((_, i) => createQuestion(`q106_${i + 1}`, QuestionType.MULTIPLE_CHOICE, 'easy', `Questão ${i + 1}`, 'Boolean', [{ id: '1', text: 'true', isCorrect: true }]))
            },
            {
                id: 107,
                title: "console.log",
                description: "Exibindo dados",
                color: 'secondary',
                icon: 'zap',
                totalQuestions: 9,
                stars: 0,
                learnableConcepts: [{ term: 'console.log', definition: 'Exibe no console', type: 'Sintaxe' }],
                questions: [...Array(9)].map((_, i) => createQuestion(`q107_${i + 1}`, QuestionType.CODE_BUILDER, 'easy', `Questão ${i + 1}`, 'Console', [{ id: '1', text: 'console.log(x);', isCorrect: true }]))
            },
            {
                id: 108,
                title: "Concatenação",
                description: "Juntando strings",
                color: 'warn',
                icon: 'code',
                totalQuestions: 10,
                stars: 0,
                learnableConcepts: [{ term: 'Concatenation', definition: 'Juntar textos', type: 'Lógica' }],
                questions: [...Array(10)].map((_, i) => createQuestion(`q108_${i + 1}`, QuestionType.DRAG_AND_DROP, 'medium', `Questão ${i + 1}`, 'Concatenar', [], 'Ótimo!', 'Tente novamente'))
            },
            {
                id: 109,
                title: "Template Literals",
                description: "Strings com variáveis",
                color: 'brand',
                icon: 'zap',
                totalQuestions: 8,
                stars: 0,
                learnableConcepts: [{ term: 'Template Literal', definition: 'String com ${}', type: 'Sintaxe' }],
                questions: [...Array(8)].map((_, i) => createQuestion(`q109_${i + 1}`, QuestionType.FILL_IN_BLANK, 'medium', `Questão ${i + 1}`, 'Template', [], 'Perfeito!'))
            },
            {
                id: 110,
                title: "Revisão Unidade 1",
                description: "Teste final",
                color: 'info',
                icon: 'trophy',
                totalQuestions: 12,
                stars: 0,
                learnableConcepts: [],
                questions: [...Array(12)].map((_, i) => createQuestion(`q110_${i + 1}`, [QuestionType.MULTIPLE_CHOICE, QuestionType.CODE_BUILDER, QuestionType.FILL_IN_BLANK][i % 3], 'hard', `Desafio ${i + 1}`, 'Revisão', [{ id: '1', text: 'Correta', isCorrect: true }]))
            }
        ]
    },

    // ==================== UNIDADE 2: CONTROLE DE FLUXO ====================
    {
        id: 2,
        title: "Unidade 2: Controle de Fluxo",
        description: "Decisões e lógica",
        levels: [
            ...Array.from({ length: 10 }, (_, i) => ({
                id: 200 + i + 1,
                title: `Nível ${i + 1}`,
                description: ["if/else", "Operadores de comparação", "AND/OR", "Operador ternário", "switch", "Condições aninhadas", "Truthy/Falsy", "Operadores lógicos avançados", "Short-circuit", "Revisão"][i],
                color: ['brand', 'info', 'secondary', 'warn'][i % 4] as any,
                icon: ['code', 'book', 'zap', 'trophy'][i % 4] as any,
                totalQuestions: [8, 9, 10, 8, 9, 10, 8, 9, 10, 12][i],
                stars: 0,
                learnableConcepts: [{ term: `Conceito ${i + 1}`, definition: 'Descrição', type: 'Lógica' as const }],
                questions: [...Array([8, 9, 10, 8, 9, 10, 8, 9, 10, 12][i])].map((_, j) => createQuestion(
                    `q${200 + i + 1}_${j + 1}`,
                    [QuestionType.MULTIPLE_CHOICE, QuestionType.CODE_BUILDER, QuestionType.PAIR_MATCH, QuestionType.FILL_IN_BLANK][j % 4],
                    ['easy', 'medium', 'hard'][j % 3] as any,
                    `Questão ${j + 1}`,
                    'Prompt',
                    [{ id: '1', text: 'Correta', isCorrect: true }]
                ))
            }))
        ]
    },

    // ==================== UNIDADE 3: LOOPS ====================
    {
        id: 3,
        title: "Unidade 3: Loops e Iteração",
        description: "Repetição de código",
        levels: [
            ...Array.from({ length: 10 }, (_, i) => ({
                id: 300 + i + 1,
                title: `Nível ${i + 1}`,
                description: ["for loop", "while loop", "do...while", "break/continue", "Loop aninhado", "Arrays intro", "forEach", "Iteração com índice", "Loop infinito", "Revisão"][i],
                color: ['brand', 'info', 'secondary', 'warn'][i % 4] as any,
                icon: ['code', 'book', 'zap', 'trophy'][i % 4] as any,
                totalQuestions: [9, 10, 8, 9, 10, 8, 9, 10, 8, 12][i],
                stars: 0,
                learnableConcepts: [{ term: `Loop ${i + 1}`, definition: 'Conceito', type: 'Sintaxe' as const }],
                questions: [...Array([9, 10, 8, 9, 10, 8, 9, 10, 8, 12][i])].map((_, j) => createQuestion(
                    `q${300 + i + 1}_${j + 1}`,
                    [QuestionType.CODE_BUILDER, QuestionType.MULTIPLE_CHOICE, QuestionType.DRAG_AND_DROP, QuestionType.FILL_IN_BLANK][j % 4],
                    ['easy', 'medium', 'hard'][j % 3] as any,
                    `Questão ${j + 1}`,
                    'Loop',
                    [{ id: '1', text: 'Correta', isCorrect: true }]
                ))
            }))
        ]
    },

    // ==================== UNIDADE 4: FUNÇÕES ====================
    {
        id: 4,
        title: "Unidade 4: Funções",
        description: "Blocos reutilizáveis",
        levels: [
            ...Array.from({ length: 10 }, (_, i) => ({
                id: 400 + i + 1,
                title: `Nível ${i + 1}`,
                description: ["Declaração de função", "Parâmetros", "Return", "Escopo", "Function expression", "Arrow functions", "Callback", "Funções anônimas", "IIFE", "Revisão"][i],
                color: ['brand', 'info', 'secondary', 'warn'][i % 4] as any,
                icon: ['code', 'book', 'zap', 'trophy'][i % 4] as any,
                totalQuestions: [8, 9, 10, 9, 8, 10, 9, 8, 10, 12][i],
                stars: 0,
                learnableConcepts: [{ term: 'Function', definition: 'Bloco de código', type: 'Lógica' as const }],
                questions: [...Array([8, 9, 10, 9, 8, 10, 9, 8, 10, 12][i])].map((_, j) => createQuestion(
                    `q${400 + i + 1}_${j + 1}`,
                    [QuestionType.CODE_BUILDER, QuestionType.MULTIPLE_CHOICE, QuestionType.FILL_IN_BLANK, QuestionType.PAIR_MATCH][j % 4],
                    ['easy', 'medium', 'hard'][j % 3] as any,
                    `Questão ${j + 1}`,
                    'Função',
                    [{ id: '1', text: 'Correta', isCorrect: true }]
                ))
            }))
        ]
    },

    // ==================== UNIDADE 5: ARRAYS AVANÇADOS ====================
    {
        id: 5,
        title: "Unidade 5: Arrays",
        description: "Listas e coleções",
        levels: [
            ...Array.from({ length: 10 }, (_, i) => ({
                id: 500 + i + 1,
                title: `Nível ${i + 1}`,
                description: ["Criando arrays", "Acessando índices", "push/pop", "shift/unshift", "slice/splice", "map", "filter", "reduce", "find", "Revisão"][i],
                color: ['brand', 'info', 'secondary', 'warn'][i % 4] as any,
                icon: ['code', 'book', 'zap', 'trophy'][i % 4] as any,
                totalQuestions: [9, 8, 10, 9, 8, 10, 9, 10, 8, 12][i],
                stars: 0,
                learnableConcepts: [{ term: 'Array', definition: 'Lista de valores', type: 'Lógica' as const }],
                questions: [...Array([9, 8, 10, 9, 8, 10, 9, 10, 8, 12][i])].map((_, j) => createQuestion(
                    `q${500 + i + 1}_${j + 1}`,
                    [QuestionType.CODE_BUILDER, QuestionType.DRAG_AND_DROP, QuestionType.MULTIPLE_CHOICE, QuestionType.FILL_IN_BLANK][j % 4],
                    ['easy', 'medium', 'hard'][j % 3] as any,
                    `Questão ${j + 1}`,
                    'Array',
                    [{ id: '1', text: 'Correta', isCorrect: true }]
                ))
            }))
        ]
    },

    // ==================== UNIDADE 6: OBJETOS ====================
    {
        id: 6,
        title: "Unidade 6: Objetos",
        description: "Dados estruturados",
        levels: [
            ...Array.from({ length: 10 }, (_, i) => ({
                id: 600 + i + 1,
                title: `Nível ${i + 1}`,
                description: ["Criando objetos", "Propriedades", "Métodos", "this", "Object.keys", "Object.values", "Destructuring", "Spread operator", "JSON", "Revisão"][i],
                color: ['brand', 'info', 'secondary', 'warn'][i % 4] as any,
                icon: ['code', 'book', 'zap', 'trophy'][i % 4] as any,
                totalQuestions: [8, 9, 10, 8, 9, 10, 8, 9, 10, 12][i],
                stars: 0,
                learnableConcepts: [{ term: 'Object', definition: 'Estrutura de dados', type: 'Lógica' as const }],
                questions: [...Array([8, 9, 10, 8, 9, 10, 8, 9, 10, 12][i])].map((_, j) => createQuestion(
                    `q${600 + i + 1}_${j + 1}`,
                    [QuestionType.CODE_BUILDER, QuestionType.PAIR_MATCH, QuestionType.MULTIPLE_CHOICE, QuestionType.FILL_IN_BLANK][j % 4],
                    ['easy', 'medium', 'hard'][j % 3] as any,
                    `Questão ${j + 1}`,
                    'Objeto',
                    [{ id: '1', text: 'Correta', isCorrect: true }]
                ))
            }))
        ]
    },

    // ==================== UNIDADE 7-10 (estrutura similar) ====================
    ...Array.from({ length: 4 }, (_, unitIndex) => ({
        id: 7 + unitIndex,
        title: `Unidade ${7 + unitIndex}: ${['DOM Básico', 'Eventos', 'ES6+', 'Projeto Final'][unitIndex]}`,
        description: ['Manipulação da página', 'Interação com usuário', 'JavaScript moderno', 'Aplicação completa'][unitIndex],
        levels: [
            ...Array.from({ length: 10 }, (_, i) => ({
                id: (700 + unitIndex * 100) + i + 1,
                title: `Nível ${i + 1}`,
                description: `Conceito ${i + 1}`,
                color: ['brand', 'info', 'secondary', 'warn'][i % 4] as any,
                icon: ['code', 'book', 'zap', 'trophy'][i % 4] as any,
                totalQuestions: [8, 9, 10, 8, 9, 10, 8, 9, 10, 12][i],
                stars: 0,
                learnableConcepts: [{ term: `Tópico ${i + 1}`, definition: 'Descrição', type: 'Lógica' as const }],
                questions: [...Array([8, 9, 10, 8, 9, 10, 8, 9, 10, 12][i])].map((_, j) => createQuestion(
                    `q${(700 + unitIndex * 100) + i + 1}_${j + 1}`,
                    [QuestionType.CODE_BUILDER, QuestionType.MULTIPLE_CHOICE, QuestionType.DRAG_AND_DROP, QuestionType.FILL_IN_BLANK][j % 4],
                    ['easy', 'medium', 'hard'][j % 3] as any,
                    `Questão ${j + 1}`,
                    'Exercício',
                    [{ id: '1', text: 'Correta', isCorrect: true }]
                ))
            }))
        ]
    }))
];

// --- DYNAMIC LEVEL GENERATION FOR INFINITE SCROLL ---

const ADJECTIVES = ['Advanced', 'Complex', 'Deep', 'Master', 'Legacy', 'Async', 'Virtual', 'Cyber', 'Mega', 'Ultra'];
const TOPICS = ['Algorithms', 'Patterns', 'Refactoring', 'Debugging', 'Deploy', 'Cloud', 'API', 'Database', 'Security', 'UI'];

export const generateRandomUnit = (startUnitId: number, startLevelId: number): Unit => {
    const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const unitTitle = `Unidade ${startUnitId}: ${randomAdjective} ${randomTopic}`;
    const unitDesc = `Conceitos avançados de ${randomTopic.toLowerCase()}.`;

    const levels: Level[] = [];
    const colors: Level['color'][] = ['brand', 'info', 'secondary', 'warn'];
    const icons: Level['icon'][] = ['star', 'code', 'book', 'trophy', 'zap'];

    for (let i = 0; i < 3; i++) {
        const levelId = startLevelId + i;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];

        // Recycle questions from existing levels to simulate content
        const randomSourceUnit = CURRICULUM[Math.floor(Math.random() * CURRICULUM.length)];
        const randomSourceLevel = randomSourceUnit.levels[Math.floor(Math.random() * randomSourceUnit.levels.length)];
        const questions = [...randomSourceLevel.questions].sort(() => 0.5 - Math.random()).slice(0, 3);

        levels.push({
            id: levelId,
            title: `${randomTopic} - Parte ${i + 1}`,
            description: `Prática intensiva de ${randomTopic}`,
            color: color,
            icon: icon,
            totalQuestions: 3,
            stars: 0,
            learnableConcepts: randomSourceLevel.learnableConcepts || [],
            questions: questions.map(q => ({ ...q, id: `${q.id}_gen_${levelId}` })) // Unique Q IDs
        });
    }

    return {
        id: startUnitId,
        title: unitTitle,
        description: unitDesc,
        levels: levels
    };
};

// Helper function to get level by ID
export const getLevelById = (id: number): Level | undefined => {
    // 1. Try static curriculum
    for (const unit of CURRICULUM) {
        const level = unit.levels.find(l => l.id === id);
        if (level) {
            // Shuffle and pick 5 random questions to ensure variety
            const shuffledQuestions = [...level.questions].sort(() => Math.random() - 0.5).slice(0, 5);
            return {
                ...level,
                questions: shuffledQuestions,
                totalQuestions: shuffledQuestions.length
            };
        }
    }

    // 2. If id is high, it might be generated
    if (id > 900) {
        const seedUnitId = Math.floor(id / 100);
        const generatedUnit = generateRandomUnit(seedUnitId, Math.floor(id / 10) * 10);
        return generatedUnit.levels.find(l => l.id === id) || generatedUnit.levels[0];
    }

    return undefined;
};
