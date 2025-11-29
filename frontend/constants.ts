import { QuestionType, Unit, Achievement, ShopItem, Quest, Level, ModuleType } from './types';
import { Heart, Zap, Crown, Coins, Gem } from 'lucide-react';

export const MAX_HEARTS = 5;
export const HEART_REFILL_TIME_MS = 35 * 60 * 1000; // 35 minutes
export const BASE_XP_PER_QUESTION = 10;
export const COMBO_BONUS_MULTIPLIER = 2;
export const PERFECT_LESSON_BONUS = 20;

// Calculate Level based on XP
export const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
export const calculateXpForNextLevel = (level: number) => 100 * Math.pow(level, 2);

export const DAILY_QUEST_TEMPLATES: Omit<Quest, 'current' | 'completed' | 'claimed'>[] = [
    { id: 'q_less_1', description: 'Complete 2 lições hoje', target: 2, reward: 10, type: 'lesson' },
    { id: 'q_xp_1', description: 'Ganhe 50 XP hoje', target: 50, reward: 15, type: 'xp' },
    { id: 'q_perf_1', description: 'Faça 1 lição perfeita', target: 1, reward: 25, type: 'perfect' },
    { id: 'q_less_2', description: 'Complete 3 lições hoje', target: 3, reward: 20, type: 'lesson' },
    { id: 'q_xp_2', description: 'Ganhe 100 XP hoje', target: 100, reward: 30, type: 'xp' },
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
        id: 'streak_freeze',
        name: 'Congelar Ofensiva',
        description: 'Mantenha sua sequência mesmo se ficar 1 dia sem jogar.',
        cost: 200,
        icon: Zap,
        type: 'consumable'
    },
    {
        id: 'premium_sub',
        name: 'ProGres Super',
        description: 'Vidas infinitas, zero anúncios, emblema dourado e acesso a conteúdos exclusivos.',
        cost: 19.99, // R$ 19,99/mês
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
        name: 'Saco de Gemas',
        description: '+1200 Gemas',
        cost: 9.99,
        icon: Coins,
        type: 'currency_pack',
        gemAmount: 1200
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
        id: 'on_fire',
        title: 'Compilador Humano',
        description: 'Atinja um combo de 5x em uma lição.',
        icon: '🔥',
        condition: (_, result) => (result ? result.maxCombo >= 5 : false)
    },
    {
        id: 'perfectionist',
        title: 'Clean Code',
        description: 'Complete uma lição sem nenhum erro.',
        icon: '💎',
        condition: (_, result) => (result ? result.mistakeCount === 0 : false)
    },
    {
        id: 'xp_hunter',
        title: 'Full Stack Jr.',
        description: 'Acumule 500 XP total.',
        icon: '⚡',
        condition: (stats) => stats.totalXP >= 500
    },
    {
        id: 'rich',
        title: 'Investidor Tech',
        description: 'Acumule 1000 gemas.',
        icon: '💰',
        condition: (stats) => stats.gems >= 1000
    }
];

// --- ENGLISH TRACK ---
export const ENGLISH_CURRICULUM: Unit[] = [
    {
        id: 1,
        title: "Unit 1: The Daily Standup",
        description: "Fale sobre seu progresso diário.",
        levels: [
            {
                id: 101,
                title: "Greetings & Status",
                description: "Iniciando a reunião.",
                color: 'info',
                icon: 'zap',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'Standup', definition: 'Reunião diária rápida.', type: 'Inglês', example: 'Let\'s start the standup.' },
                    { term: 'Blocker', definition: 'Algo que impede seu progresso.', type: 'Inglês', example: 'I have a blocker on the API.' }
                ],
                questions: [
                    {
                        id: 'e_t1',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'The Standup',
                        prompt: 'Standup Meeting',
                        englishWord: 'Standup',
                        phonetic: '/ˈstænd.ʌp/',
                        theoryContent: 'A **Standup** is a short daily meeting where you say what you did yesterday, what you will do today, and if you have any **Blockers**.',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'e_l1',
                        type: QuestionType.LISTENING,
                        difficulty: 'easy',
                        title: 'Listening',
                        prompt: 'What did they say?',
                        englishWord: 'I am working on the login page.',
                        options: [
                            { id: '1', text: 'Estou trabalhando na página de login.', isCorrect: true },
                            { id: '2', text: 'Terminei a página de login.', isCorrect: false },
                            { id: '3', text: 'Vou começar a página de login.', isCorrect: false }
                        ],
                        correctFeedback: 'Correct!',
                        wrongFeedback: 'Listen for "working on".'
                    },
                    {
                        id: 'e_s1',
                        type: QuestionType.SPEAKING,
                        difficulty: 'medium',
                        title: 'Speaking',
                        prompt: 'Say: "I have no blockers"',
                        englishWord: 'I have no blockers',
                        options: [],
                        correctFeedback: 'Perfect pronunciation!',
                        wrongFeedback: 'Try to emphasize "blockers".'
                    },
                    {
                        id: 'e_m1',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'easy',
                        title: 'Vocabulary',
                        prompt: 'Match terms:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Yesterday', pairId: '1a' },
                            { id: '1a', text: 'Ontem', pairId: '1' },
                            { id: '2', text: 'Today', pairId: '2a' },
                            { id: '2a', text: 'Hoje', pairId: '2' },
                            { id: '3', text: 'Blocker', pairId: '3a' },
                            { id: '3a', text: 'Impedimento', pairId: '3' }
                        ],
                        correctFeedback: 'Good job!',
                        wrongFeedback: 'Review the time words.'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Unit 2: Code Review",
        description: "Dando e recebendo feedback.",
        levels: [
            {
                id: 201,
                title: "LGTM & Comments",
                description: "Aprovando código.",
                color: 'brand',
                icon: 'code',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'LGTM', definition: 'Looks Good To Me (Parece bom para mim).', type: 'Inglês' },
                    { term: 'Nitpick', definition: 'Um detalhe pequeno/chato.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 'e_t2',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Review Acronyms',
                        prompt: 'LGTM',
                        englishWord: 'LGTM',
                        theoryContent: '**LGTM** stands for "Looks Good To Me". Use it when you approve a Pull Request without changes.',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'e_s2',
                        type: QuestionType.SPEAKING,
                        difficulty: 'hard',
                        title: 'Speaking',
                        prompt: 'Say: "Can you fix this typo?"',
                        englishWord: 'Can you fix this typo?',
                        options: [],
                        correctFeedback: 'Excellent!',
                        wrongFeedback: 'Clear enunciation helps.'
                    },
                    {
                        id: 'e_l2',
                        type: QuestionType.LISTENING,
                        difficulty: 'medium',
                        title: 'Listening',
                        prompt: 'What is the request?',
                        englishWord: 'Please update the documentation.',
                        options: [
                            { id: '1', text: 'Atualize a documentação.', isCorrect: true },
                            { id: '2', text: 'Apague a documentação.', isCorrect: false },
                            { id: '3', text: 'Leia a documentação.', isCorrect: false }
                        ],
                        correctFeedback: 'Correct!',
                        wrongFeedback: 'Update = Atualizar.'
                    }
                ]
            }
        ]
    }
];

// --- LOGIC TRACK ---
export const LOGIC_CURRICULUM: Unit[] = [
    {
        id: 1,
        title: "Unidade 1: Lógica Pura",
        description: "Algoritmos e Estruturas.",
        levels: [
            {
                id: 101,
                title: "Fluxo de Controle",
                description: "Sequência e Decisão.",
                color: 'warn',
                icon: 'code',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'Sequence', definition: 'Ordem de execução.', type: 'Lógica' },
                    { term: 'Branch', definition: 'Ramificação (if/else).', type: 'Lógica' }
                ],
                questions: [
                    {
                        id: 'l_q1',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'easy',
                        title: 'Sequência',
                        prompt: 'Ordene para: Acordar -> Comer -> Codar',
                        options: [],
                        segments: ['wakeUp();', 'eat();', 'code();'],
                        distractors: ['sleep();'],
                        correctFeedback: 'Lógica correta!',
                        wrongFeedback: 'A ordem importa.'
                    },
                    {
                        id: 'l_q2',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'medium',
                        title: 'Decisão',
                        prompt: 'Se x > 5, retorne true:',
                        options: [
                            { id: '1', text: 'if (x > 5) return true;', isCorrect: true },
                            { id: '2', text: 'if (x < 5) return true;', isCorrect: false },
                            { id: '3', text: 'return x > 5;', isCorrect: true } // Also correct technically but maybe strictly looking for if structure? Let's keep simple.
                        ],
                        correctFeedback: 'Boa!',
                        wrongFeedback: 'Verifique a condição.'
                    },
                    {
                        id: 'l_q3',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'hard',
                        title: 'Loop',
                        prompt: 'Repita 10 vezes:',
                        codeSnippet: 'for (let i = 0; i < ___; i++)',
                        correctAnswer: '10',
                        options: [],
                        correctFeedback: 'Exato!',
                        wrongFeedback: 'O limite é 10.'
                    },
                    {
                        id: 'l_q4',
                        type: QuestionType.MULTIPLE_CHOICE,
                        difficulty: 'medium',
                        title: 'Lógica',
                        prompt: 'Qual o valor de !true?',
                        options: [
                            { id: '1', text: 'false', isCorrect: true },
                            { id: '2', text: 'true', isCorrect: false },
                            { id: '3', text: 'undefined', isCorrect: false }
                        ],
                        correctFeedback: 'Negação inverte o valor.',
                        wrongFeedback: '! significa NÃO.'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Unidade 2: Estruturas de Dados",
        description: "Organizando informação.",
        levels: [
            {
                id: 201,
                title: "Arrays & Objects",
                description: "Coleções complexas.",
                color: 'secondary',
                icon: 'book',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Index', definition: 'Posição no array.', type: 'Lógica' },
                    { term: 'Key', definition: 'Identificador no objeto.', type: 'Lógica' }
                ],
                questions: [
                    {
                        id: 'l_q5',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'medium',
                        title: 'Acesso',
                        prompt: 'Acesse o segundo item de "arr":',
                        options: [
                            { id: '1', text: 'arr[1]', isCorrect: true },
                            { id: '2', text: 'arr[2]', isCorrect: false },
                            { id: '3', text: 'arr.2', isCorrect: false }
                        ],
                        correctFeedback: 'Índice 1 é o segundo item.',
                        wrongFeedback: 'Começa em 0.'
                    },
                    {
                        id: 'l_q6',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'hard',
                        title: 'Objetos',
                        prompt: 'Acesse a propriedade "id":',
                        codeSnippet: 'user.___',
                        correctAnswer: 'id',
                        options: [],
                        correctFeedback: 'Dot notation.',
                        wrongFeedback: 'Use .id'
                    },
                    {
                        id: 'l_q7',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'hard',
                        title: 'Construção',
                        prompt: 'Crie um objeto vazio:',
                        options: [],
                        segments: ['const', 'obj', '=', '{}', ';'],
                        distractors: ['[]', 'empty'],
                        correctFeedback: 'Correct syntax.',
                        wrongFeedback: 'Objects use {}'
                    }
                ]
            }
        ]
    }
];

// --- COMBO TRACK (Original) ---
export const COMBO_CURRICULUM: Unit[] = [
    {
        id: 1,
        title: "Unidade 1: Fundamentos & Vocabulário",
        description: "Iniciando sua jornada bilíngue.",
        levels: [
            {
                id: 101,
                title: "Variáveis & Assignment",
                description: "Guardando dados.",
                color: 'brand',
                icon: 'code',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'Variable', definition: 'Um espaço na memória para guardar dados.', type: 'Inglês', example: 'The score variable is 10.' },
                    { term: 'Assign', definition: 'Atribuir um valor a uma variável (=).', type: 'Inglês', example: 'Assign 10 to x.' },
                    { term: 'Value', definition: 'O dado guardado na variável.', type: 'Inglês', example: 'The value is 5.' }
                ],
                questions: [
                    {
                        id: 't1',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'O que é uma Variable?',
                        prompt: 'Variable',
                        englishWord: 'Variable',
                        phonetic: '/ˈveə.ri.ə.bəl/',
                        theoryContent: 'Uma **Variable** (Variável) é como uma caixa etiquetada onde guardamos um **Value** (Valor). \n\nPara colocar algo na caixa, usamos o sinal de igual `=`. Em inglês, chamamos isso de **Assignment** (Atribuição).',
                        codeSnippet: 'let score = 10; // Assign 10 to score',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: '',
                    },
                    {
                        id: 'q1',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Vocabulário',
                        prompt: 'O que significa "Assign"?',
                        options: [
                            { id: '1', text: 'Atribuir', isCorrect: true },
                            { id: '2', text: 'Assinar', isCorrect: false },
                            { id: '3', text: 'Apagar', isCorrect: false },
                        ],
                        correctFeedback: 'Correct! Assign = Atribuir valor.',
                        wrongFeedback: 'Assign é usado para definir valores (=).',
                    },
                    {
                        id: 'q2',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'easy',
                        title: 'Prática',
                        prompt: 'Assign the value 10 to "x":',
                        options: [
                            { id: '1', text: 'let x = 10;', isCorrect: true },
                            { id: '2', text: 'let x == 10;', isCorrect: false },
                            { id: '3', text: 'x : 10;', isCorrect: false },
                        ],
                        correctFeedback: 'Perfect! "=" is the assignment operator.',
                        wrongFeedback: 'Use "=" to assign.',
                    },
                    {
                        id: 'q3',
                        type: QuestionType.LISTENING,
                        difficulty: 'medium',
                        title: 'Listening',
                        prompt: 'O que foi dito?',
                        englishWord: 'Assign a value to the variable.',
                        options: [
                            { id: '1', text: 'Atribua um valor à variável.', isCorrect: true },
                            { id: '2', text: 'Assine o valor da variável.', isCorrect: false },
                            { id: '3', text: 'Verifique o valor da variável.', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! Assign = Atribuir.',
                        wrongFeedback: 'Listen closely: "Assign".'
                    }
                ]
            },
            {
                id: 102,
                title: "Strings & Characters",
                description: "Textos em código.",
                color: 'info',
                icon: 'book',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'String', definition: 'Texto em programação.', type: 'Inglês', example: '"Hello"' },
                    { term: 'Character', definition: 'Uma única letra ou símbolo.', type: 'Inglês', example: '"A"' },
                    { term: 'Quote', definition: 'Aspas (" ou \').', type: 'Inglês', example: 'Single quotes.' }
                ],
                questions: [
                    {
                        id: 't_str',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Texto é String',
                        prompt: 'String',
                        englishWord: 'String',
                        phonetic: '/strɪŋ/',
                        theoryContent: 'Em inglês técnico, texto é **String**. Uma String é feita de **Characters** (Caracteres). \n\nSempre usamos **Quotes** (Aspas) para definir uma String.',
                        codeSnippet: 'let name = "Leo"; // String with double quotes',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_str',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Vocabulário',
                        prompt: 'Conecte os termos:',
                        options: [],
                        pairs: [
                            { id: 'p1', text: 'String', pairId: 'r1' },
                            { id: 'r1', text: 'Texto', pairId: 'p1' },
                            { id: 'p2', text: 'Quote', pairId: 'r2' },
                            { id: 'r2', text: 'Aspas', pairId: 'p2' },
                            { id: 'p3', text: 'Character', pairId: 'r3' },
                            { id: 'r3', text: 'Letra/Símbolo', pairId: 'p3' }
                        ],
                        correctFeedback: 'Great job!',
                        wrongFeedback: 'Review the terms.'
                    },
                    {
                        id: 'q_drag_str',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'medium',
                        title: 'Code It',
                        prompt: 'Create a String "Hello":',
                        options: [],
                        segments: ['let', 's', '=', '"Hello";'],
                        distractors: ['Hello', 'quote'],
                        correctFeedback: 'Correct! Quotes are essential.',
                        wrongFeedback: 'Don\'t forget the quotes.'
                    }
                ]
            },
            {
                id: 103,
                title: "Output & Console",
                description: "Vendo resultados.",
                color: 'secondary',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Output', definition: 'O resultado exibido pelo programa.', type: 'Inglês' },
                    { term: 'Print', definition: 'Escrever/Mostrar algo na tela.', type: 'Inglês' },
                    { term: 'Error', definition: 'Um problema ou falha no código.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_log',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Saída de Dados',
                        prompt: 'Output',
                        englishWord: 'Output',
                        phonetic: '/ˈaʊt.pʊt/',
                        theoryContent: 'Para ver o que seu código está fazendo, geramos um **Output** (Saída). \n\nO comando `console.log()` serve para **Print** (Imprimir/Mostrar) mensagens no terminal de desenvolvimento.',
                        codeSnippet: 'console.log("System Ready"); // Prints "System Ready"',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_trans_print',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Tradução',
                        prompt: 'O que significa "Print" em programação?',
                        options: [
                            { id: '1', text: 'Mostrar na tela', isCorrect: true },
                            { id: '2', text: 'Imprimir em papel', isCorrect: false },
                            { id: '3', text: 'Digitar', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! Print = Mostrar output.',
                        wrongFeedback: 'No contexto dev, é mostrar na tela.'
                    },
                    {
                        id: 'q_code_log',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'easy',
                        title: 'Prática',
                        prompt: 'Print "Error" to the console:',
                        options: [
                            { id: '1', text: 'console.log("Error");', isCorrect: true },
                            { id: '2', text: 'print("Error");', isCorrect: false },
                            { id: '3', text: 'log.console("Error");', isCorrect: false }
                        ],
                        correctFeedback: 'Correct syntax!',
                        wrongFeedback: 'Use console.log().'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Unidade 2: Lógica & Conditions",
        description: "Tomando decisões.",
        levels: [
            {
                id: 201,
                title: "Booleans & Conditions",
                description: "Verdadeiro ou Falso.",
                color: 'warn',
                icon: 'trophy',
                totalQuestions: 3,
                learnableConcepts: [
                    { term: 'Boolean', definition: 'Tipo verdadeiro (true) ou falso (false).', type: 'Inglês' },
                    { term: 'Condition', definition: 'Uma verificação lógica.', type: 'Inglês' },
                    { term: 'Statement', definition: 'Uma instrução completa de código.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_bool',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Lógica Binária',
                        prompt: 'Boolean',
                        englishWord: 'True/False',
                        theoryContent: 'Um **Boolean** só tem dois estados: `true` (Verdadeiro) ou `false` (Falso). \n\nUsamos booleans em **Conditions** (Condições) para decidir se um código deve rodar ou não.',
                        codeSnippet: 'let isValid = true;\nif (isValid) { ... }',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_cond',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Termos',
                        prompt: 'Associe:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'True', pairId: '1a' },
                            { id: '1a', text: 'Verdadeiro', pairId: '1' },
                            { id: '2', text: 'False', pairId: '2a' },
                            { id: '2a', text: 'Falso', pairId: '2' },
                            { id: '3', text: 'Condition', pairId: '3a' },
                            { id: '3a', text: 'Condição', pairId: '3' }
                        ],
                        correctFeedback: 'Good!',
                        wrongFeedback: 'Try again.'
                    },
                    {
                        id: 'q_fill_if',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'medium',
                        title: 'Syntax',
                        prompt: 'Check if x is true:',
                        codeSnippet: 'if (x ___ true) { ... }',
                        correctAnswer: '===',
                        options: [],
                        correctFeedback: 'Triple equals check equality.',
                        wrongFeedback: 'Use === for comparison.'
                    }
                ],
                stars: 0
            },
            {
                id: 202,
                title: "If / Else Statements",
                description: "Caminhos alternativos.",
                color: 'brand',
                icon: 'code',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'If Statement', definition: 'Bloco "Se".', type: 'Inglês' },
                    { term: 'Else', definition: 'Bloco "Senão" (Caso contrário).', type: 'Inglês' },
                    { term: 'Block', definition: 'Grupo de código entre chaves { }.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_if',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Se... Senão...',
                        prompt: 'Else',
                        englishWord: 'Else',
                        theoryContent: 'O **If Statement** verifica uma condição. Se falhar, o código pula para o bloco **Else** (Senão/Caso contrário). \n\nO código dentro das chaves `{}` é chamado de **Block**.',
                        codeSnippet: 'if (isOnline) {\n  // Block 1\n} else {\n  // Block 2\n}',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_trans_else',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Tradução',
                        prompt: 'O que "Else" significa neste contexto?',
                        options: [
                            { id: '1', text: 'Caso contrário', isCorrect: true },
                            { id: '2', text: 'E também', isCorrect: false },
                            { id: '3', text: 'Depois', isCorrect: false }
                        ],
                        correctFeedback: 'Correct! Else = Caso contrário.',
                        wrongFeedback: 'Else cobre a alternativa.'
                    },
                    {
                        id: 'q_drag_block',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'medium',
                        title: 'Estrutura',
                        prompt: 'Create an else block:',
                        segments: ['else', '{', 'runCode();', '}'],
                        distractors: ['if', '('],
                        options: [],
                        correctFeedback: 'Valid syntax.',
                        wrongFeedback: 'Else doesn\'t need parentheses.'
                    }
                ]
            }
        ]
    }
];

// --- DYNAMIC LEVEL GENERATION FOR INFINITE SCROLL ---

const ADJECTIVES = ['Advanced', 'Complex', 'Deep', 'Master', 'Legacy', 'Async', 'Virtual', 'Cyber', 'Mega', 'Ultra'];
const TOPICS = ['Algorithms', 'Patterns', 'Refactoring', 'Debugging', 'Deploy', 'Cloud', 'API', 'Database', 'Security', 'UI'];

export const generateRandomUnit = (startUnitId: number, startLevelId: number, mode: ModuleType = ModuleType.COMBO): Unit => {
    const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const unitTitle = `Unidade ${startUnitId}: ${randomAdjective} ${randomTopic}`;
    const unitDesc = `Conceitos avançados de ${randomTopic.toLowerCase()}.`;

    const levels: Level[] = [];
    const colors: Level['color'][] = ['brand', 'info', 'secondary', 'warn'];
    const icons: Level['icon'][] = ['star', 'code', 'book', 'trophy', 'zap'];

    const sourceCurriculum = mode === ModuleType.ENGLISH ? ENGLISH_CURRICULUM :
        mode === ModuleType.LOGIC ? LOGIC_CURRICULUM :
            COMBO_CURRICULUM;

    for (let i = 0; i < 3; i++) {
        const levelId = startLevelId + i;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];

        // Recycle questions from existing levels to simulate content for now
        const randomSourceUnit = sourceCurriculum[Math.floor(Math.random() * sourceCurriculum.length)];
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

// Helper to get a level even if it's dynamically generated
export const getLevelById = (id: number, mode: ModuleType = ModuleType.COMBO): Level | undefined => {
    const curriculum = mode === ModuleType.ENGLISH ? ENGLISH_CURRICULUM :
        mode === ModuleType.LOGIC ? LOGIC_CURRICULUM :
            COMBO_CURRICULUM;

    // 1. Try static curriculum
    let level: Level | undefined;
    for (const unit of curriculum) {
        const found = unit.levels.find(l => l.id === id);
        if (found) {
            level = found;
            break;
        }
    }

    // 2. If id is high, it might be generated. 
    if (!level && id > 900) {
        const seedUnitId = Math.floor(id / 100); // approx
        const generatedUnit = generateRandomUnit(seedUnitId, Math.floor(id / 10) * 10, mode);
        level = generatedUnit.levels.find(l => l.id === id) || generatedUnit.levels[0];
    }

    if (level) {
        // SHUFFLE OPTIONS
        const questions = level.questions.map(q => {
            if (q.options && q.options.length > 1 && (
                q.type === QuestionType.MULTIPLE_CHOICE ||
                q.type === QuestionType.LISTENING ||
                q.type === QuestionType.CODE_BUILDER
            )) {
                return {
                    ...q,
                    options: [...q.options].sort(() => Math.random() - 0.5)
                };
            }
            return q;
        });

        // GARANTIA DE TEORIA
        const theoryQuestions = questions.filter(q => q.type === QuestionType.THEORY || q.theory);
        const practiceQuestions = questions.filter(q => q.type !== QuestionType.THEORY && !q.theory);

        let selectedQuestions: typeof level.questions = [];

        if (theoryQuestions.length > 0) {
            selectedQuestions.push(theoryQuestions[0]);
            const remaining = [...theoryQuestions.slice(1), ...practiceQuestions];
            const shuffledRemaining = remaining.sort(() => Math.random() - 0.5);
            const countToTake = Math.min(4, shuffledRemaining.length);
            selectedQuestions = [...selectedQuestions, ...shuffledRemaining.slice(0, countToTake)];
        } else {
            selectedQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
        }

        return {
            ...level,
            questions: selectedQuestions,
            totalQuestions: selectedQuestions.length
        };
    }

    return undefined;
};

// Export the default curriculum for backward compatibility if needed, but prefer using the mode
export const CURRICULUM = COMBO_CURRICULUM; 
