import { QuestionType, Unit, Achievement, ShopItem, Quest, Level } from './types';
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
        description: 'Complete sua primeira lição de JavaScript.',
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
        description: 'Complete uma lição sem nenhum erro de sintaxe.',
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

export const CURRICULUM: Unit[] = [
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
    },
    {
        id: 3,
        title: "Unidade 3: Arrays & Loops",
        description: "Listas e Repetições.",
        levels: [
            {
                id: 301,
                title: "Arrays & Items",
                description: "Coleções.",
                color: 'secondary',
                icon: 'book',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Array', definition: 'Lista de dados.', type: 'Inglês' },
                    { term: 'Item/Element', definition: 'Um dado dentro do array.', type: 'Inglês' },
                    { term: 'Empty', definition: 'Vazio (sem itens).', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_arr',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Listas',
                        prompt: 'Array',
                        englishWord: 'Array',
                        phonetic: '/əˈreɪ/',
                        theoryContent: 'Um **Array** é uma lista de **Items** (ou Elements). \n\nUm array sem nada dentro é chamado de **Empty Array** (Array Vazio).',
                        codeSnippet: 'let list = []; // Empty Array\nlet nums = [1, 2, 3]; // 3 Items',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_arr',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Vocabulário',
                        prompt: 'Conecte:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Empty', pairId: '1a' },
                            { id: '1a', text: 'Vazio', pairId: '1' },
                            { id: '2', text: 'Item', pairId: '2a' },
                            { id: '2a', text: 'Elemento', pairId: '2' },
                            { id: '3', text: 'Array', pairId: '3a' },
                            { id: '3a', text: 'Lista', pairId: '3' }
                        ],
                        correctFeedback: 'Nice!',
                        wrongFeedback: 'Try again.'
                    },
                    {
                        id: 'q_code_empty',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'easy',
                        title: 'Prática',
                        prompt: 'Create an empty array "data":',
                        options: [
                            { id: '1', text: 'let data = [];', isCorrect: true },
                            { id: '2', text: 'let data = {};', isCorrect: false },
                            { id: '3', text: 'let data = empty;', isCorrect: false }
                        ],
                        correctFeedback: 'Correct! [] is an empty array.',
                        wrongFeedback: 'Use brackets [].'
                    }
                ]
            },
            {
                id: 302,
                title: "Index & Length",
                description: "Posições.",
                color: 'info',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Index', definition: 'Posição (começa em 0).', type: 'Inglês' },
                    { term: 'Length', definition: 'Comprimento/Tamanho total.', type: 'Inglês' },
                    { term: 'Last', definition: 'Último.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_idx',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Posições',
                        prompt: 'Index',
                        englishWord: 'Index',
                        theoryContent: 'Cada item tem um **Index** (Índice). O primeiro é 0. \n\nA propriedade **Length** diz quantos itens existem no total.',
                        codeSnippet: 'let arr = ["A", "B"];\n// Index 0 is "A"\n// Length is 2',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_trans_len',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'medium',
                        title: 'Tradução',
                        prompt: 'O que "Length" significa?',
                        options: [
                            { id: '1', text: 'Tamanho/Comprimento', isCorrect: true },
                            { id: '2', text: 'Largura', isCorrect: false },
                            { id: '3', text: 'Lento', isCorrect: false }
                        ],
                        correctFeedback: 'Correct!',
                        wrongFeedback: 'Length = Tamanho.'
                    },
                    {
                        id: 'q_fill_len',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'hard',
                        title: 'Código',
                        prompt: 'Get the size of the array:',
                        codeSnippet: 'let size = list.___;',
                        correctAnswer: 'length',
                        options: [],
                        correctFeedback: 'Yes! .length property.',
                        wrongFeedback: 'Use .length'
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "Unidade 4: Functions",
        description: "Ações e Comandos.",
        levels: [
            {
                id: 401,
                title: "Functions & Calls",
                description: "Criando ações.",
                color: 'warn',
                icon: 'code',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Function', definition: 'Bloco de código reutilizável.', type: 'Inglês' },
                    { term: 'Call', definition: 'Executar/Chamar a função.', type: 'Inglês' },
                    { term: 'Run', definition: 'Rodar o código.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_func',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Funções',
                        prompt: 'Call',
                        englishWord: 'Call',
                        theoryContent: 'Uma **Function** guarda código para usar depois. \n\nPara usar esse código, nós fazemos uma **Call** (Chamada) da função. Dizemos "Call the function" ou "Run the function".',
                        codeSnippet: 'function sayHi() { ... }\nsayHi(); // Calling the function',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_listen_call',
                        type: QuestionType.LISTENING,
                        difficulty: 'medium',
                        title: 'Listening',
                        prompt: 'O que devo fazer?',
                        englishWord: 'Call the function immediately.',
                        options: [
                            { id: '1', text: 'Chamar a função', isCorrect: true },
                            { id: '2', text: 'Criar a função', isCorrect: false },
                            { id: '3', text: 'Parar a função', isCorrect: false }
                        ],
                        correctFeedback: 'Correct! Call = Chamar/Executar.',
                        wrongFeedback: 'Call means execute.'
                    },
                    {
                        id: 'q_drag_call',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'easy',
                        title: 'Prática',
                        prompt: 'Call the function "start":',
                        segments: ['start', '(', ')', ';'],
                        distractors: ['call', 'func'],
                        options: [],
                        correctFeedback: 'Good!',
                        wrongFeedback: 'Just use name().'
                    }
                ]
            },
            {
                id: 402,
                title: "Parameters & Returns",
                description: "Entrada e Saída.",
                color: 'brand',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Parameter', definition: 'Variável de entrada da função.', type: 'Inglês' },
                    { term: 'Argument', definition: 'Valor real passado para a função.', type: 'Inglês' },
                    { term: 'Return', definition: 'Devolver um resultado.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_param',
                        type: QuestionType.THEORY,
                        difficulty: 'medium',
                        title: 'Entradas e Saídas',
                        prompt: 'Return',
                        englishWord: 'Return',
                        theoryContent: 'Funções podem receber dados (**Parameters**) e devolver um resultado final usando **Return**. \n\nO `return` para a função e entrega o valor de volta.',
                        codeSnippet: 'function add(a, b) { // Parameters\n  return a + b; // Return value\n}',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_func',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'hard',
                        title: 'Conceitos',
                        prompt: 'Ligue:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Parameter', pairId: '1a' },
                            { id: '1a', text: 'Input (Definição)', pairId: '1' },
                            { id: '2', text: 'Argument', pairId: '2a' },
                            { id: '2a', text: 'Input (Valor Real)', pairId: '2' },
                            { id: '3', text: 'Return', pairId: '3a' },
                            { id: '3a', text: 'Output/Devolução', pairId: '3' }
                        ],
                        correctFeedback: 'Excellent!',
                        wrongFeedback: 'Review params vs args.'
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "Unidade 5: Ambiente Dev",
        description: "Ferramentas do dia a dia.",
        levels: [
            {
                id: 501,
                title: "Git Basics",
                description: "Controle de versão.",
                color: 'secondary',
                icon: 'code',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'Repository', definition: 'Onde o projeto fica guardado.', type: 'Inglês' },
                    { term: 'Commit', definition: 'Salvar mudanças (ponto na história).', type: 'Inglês' },
                    { term: 'Push', definition: 'Enviar mudanças para a nuvem.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_git',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Git Vocabulary',
                        prompt: 'Commit',
                        englishWord: 'Commit',
                        phonetic: '/kəˈmɪt/',
                        theoryContent: 'No Git, um **Commit** é como um "Save Game". Você salva o estado atual do seu código. \n\nDepois, você faz um **Push** para enviar esses commits para o servidor (GitHub).',
                        codeSnippet: 'git commit -m "Fix bugs"\ngit push origin main',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_trans_push',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Tradução',
                        prompt: 'O que "Push" faz?',
                        options: [
                            { id: '1', text: 'Envia código', isCorrect: true },
                            { id: '2', text: 'Baixa código', isCorrect: false },
                            { id: '3', text: 'Apaga código', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! Push = Empurrar/Enviar.',
                        wrongFeedback: 'Push empurra para o servidor.'
                    },
                    {
                        id: 'q_match_git',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Git Terms',
                        prompt: 'Associe:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Commit', pairId: '1a' },
                            { id: '1a', text: 'Salvar Mudança', pairId: '1' },
                            { id: '2', text: 'Push', pairId: '2a' },
                            { id: '2a', text: 'Enviar', pairId: '2' },
                            { id: '3', text: 'Pull', pairId: '3a' },
                            { id: '3a', text: 'Baixar/Puxar', pairId: '3' }
                        ],
                        correctFeedback: 'Git master!',
                        wrongFeedback: 'Review Push vs Pull.'
                    }
                ]
            },
            {
                id: 502,
                title: "Terminal & CLI",
                description: "Linha de comando.",
                color: 'info',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Directory', definition: 'Pasta.', type: 'Inglês' },
                    { term: 'Path', definition: 'Caminho do arquivo.', type: 'Inglês' },
                    { term: 'Flag', definition: 'Opção de comando (ex: -v).', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_cli',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'O Terminal',
                        prompt: 'Directory',
                        englishWord: 'Directory',
                        phonetic: '/dɪˈrek.tər.i/',
                        theoryContent: 'No terminal, não dizemos "pasta", dizemos **Directory**. \n\nO endereço de um arquivo é o seu **Path** (Caminho).',
                        codeSnippet: 'cd /home/user/projects\n# Changing Directory',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_trans_dir',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Vocabulário',
                        prompt: 'O que é um "Directory"?',
                        options: [
                            { id: '1', text: 'Uma pasta', isCorrect: true },
                            { id: '2', text: 'Um arquivo', isCorrect: false },
                            { id: '3', text: 'Um comando', isCorrect: false }
                        ],
                        correctFeedback: 'Correct!',
                        wrongFeedback: 'Directory = Pasta.'
                    },
                    {
                        id: 'q_listen_path',
                        type: QuestionType.LISTENING,
                        difficulty: 'medium',
                        title: 'Listening',
                        prompt: 'O que foi pedido?',
                        englishWord: 'Check the file path.',
                        options: [
                            { id: '1', text: 'Verificar o caminho', isCorrect: true },
                            { id: '2', text: 'Criar o arquivo', isCorrect: false },
                            { id: '3', text: 'Apagar a pasta', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! Path = Caminho.',
                        wrongFeedback: 'Path means location/way.'
                    }
                ]
            },
            {
                id: 503,
                title: "Workflow",
                description: "Fluxo de trabalho.",
                color: 'warn',
                icon: 'trophy',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Bug', definition: 'Erro ou falha no código.', type: 'Inglês' },
                    { term: 'Feature', definition: 'Nova funcionalidade.', type: 'Inglês' },
                    { term: 'Deploy', definition: 'Publicar o site/app.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_flow',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Dia a Dia',
                        prompt: 'Deploy',
                        englishWord: 'Deploy',
                        phonetic: '/dɪˈplɔɪ/',
                        theoryContent: 'Quando terminamos uma **Feature** (Funcionalidade) e corrigimos os **Bugs**, fazemos o **Deploy**. \n\nDeploy significa colocar o sistema no ar para os usuários.',
                        codeSnippet: 'npm run deploy',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_flow',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Workflow',
                        prompt: 'Conecte:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Bug', pairId: '1a' },
                            { id: '1a', text: 'Erro/Falha', pairId: '1' },
                            { id: '2', text: 'Feature', pairId: '2a' },
                            { id: '2a', text: 'Funcionalidade', pairId: '2' },
                            { id: '3', text: 'Deploy', pairId: '3a' },
                            { id: '3a', text: 'Publicar', pairId: '3' }
                        ],
                        correctFeedback: 'Ready for work!',
                        wrongFeedback: 'Review the terms.'
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        title: "Unidade 6: Web & APIs",
        description: "Como a internet funciona.",
        levels: [
            {
                id: 601,
                title: "HTTP Basics",
                description: "Conversa entre computadores.",
                color: 'brand',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Request', definition: 'Pedido feito ao servidor.', type: 'Inglês' },
                    { term: 'Response', definition: 'Resposta do servidor.', type: 'Inglês' },
                    { term: 'Server', definition: 'Computador que serve dados.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_http',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'A Web',
                        prompt: 'Request',
                        englishWord: 'Request',
                        theoryContent: 'A web funciona com perguntas e respostas. \n\nO seu navegador faz um **Request** (Pedido) e o **Server** (Servidor) manda uma **Response** (Resposta).',
                        codeSnippet: 'Client -> Request -> Server\nClient <- Response <- Server',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_trans_req',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'medium',
                        title: 'Tradução',
                        prompt: 'O que é um "Request"?',
                        options: [
                            { id: '1', text: 'Um pedido/solicitação', isCorrect: true },
                            { id: '2', text: 'Uma recusa', isCorrect: false },
                            { id: '3', text: 'Um teste', isCorrect: false }
                        ],
                        correctFeedback: 'Correct!',
                        wrongFeedback: 'Request é solicitar algo.'
                    }
                ]
            },
            {
                id: 602,
                title: "JSON Data",
                description: "Formato de dados.",
                color: 'info',
                icon: 'code',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Key', definition: 'Chave (nome do dado).', type: 'Inglês' },
                    { term: 'Value', definition: 'Valor do dado.', type: 'Inglês' },
                    { term: 'Parse', definition: 'Converter texto para código.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_json',
                        type: QuestionType.THEORY,
                        difficulty: 'medium',
                        title: 'Dados',
                        prompt: 'Parse',
                        englishWord: 'Parse',
                        theoryContent: 'Dados vêm como texto. Para o código entender, precisamos fazer o **Parse** (Analisar/Converter). \n\nJSON é o formato mais comum, com pares de **Key** (Chave) e **Value** (Valor).',
                        codeSnippet: 'JSON.parse(\'{"id": 1}\');',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_json',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'JSON Terms',
                        prompt: 'Associe:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Key', pairId: '1a' },
                            { id: '1a', text: 'Chave', pairId: '1' },
                            { id: '2', text: 'Value', pairId: '2a' },
                            { id: '2a', text: 'Valor', pairId: '2' },
                            { id: '3', text: 'Parse', pairId: '3a' },
                            { id: '3a', text: 'Converter', pairId: '3' }
                        ],
                        correctFeedback: 'Good job!',
                        wrongFeedback: 'Try again.'
                    }
                ]
            }
        ]
    }
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

        // Recycle questions from existing levels to simulate content for now
        // In a real app, this would call an AI endpoint or DB
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

// Helper to get a level even if it's dynamically generated
export const getLevelById = (id: number): Level | undefined => {
    // 1. Try static curriculum
    let level: Level | undefined;
    for (const unit of CURRICULUM) {
        const found = unit.levels.find(l => l.id === id);
        if (found) {
            level = found;
            break;
        }
    }

    // 2. If id is high, it might be generated. 
    // Since we don't store generated levels in constants, we re-generate 
    // deterministically or assume App/Home passed the data context. 
    // However, for this demo, we'll implement a simple deterministic generator based on ID 
    // so direct linking works.
    if (!level && id > 900) {
        const seedUnitId = Math.floor(id / 100); // approx
        const generatedUnit = generateRandomUnit(seedUnitId, Math.floor(id / 10) * 10); // approximate logic
        level = generatedUnit.levels.find(l => l.id === id) || generatedUnit.levels[0];
    }

    if (level) {
        // SHUFFLE OPTIONS: Randomize the order of options for relevant question types
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

        // GARANTIA DE TEORIA: Separa questões de teoria das práticas
        const theoryQuestions = questions.filter(q => q.type === QuestionType.THEORY || q.theory);
        const practiceQuestions = questions.filter(q => q.type !== QuestionType.THEORY && !q.theory);

        let selectedQuestions: typeof level.questions = [];

        // Se houver teoria, garante que a primeira questão seja de teoria
        if (theoryQuestions.length > 0) {
            // Pega a primeira teoria definida (geralmente a intro)
            selectedQuestions.push(theoryQuestions[0]);

            // Mistura o resto (outras teorias + práticas)
            const remaining = [...theoryQuestions.slice(1), ...practiceQuestions];
            const shuffledRemaining = remaining.sort(() => Math.random() - 0.5);

            // Preenche até 5 questões (1 teoria + 4 aleatórias)
            const countToTake = Math.min(4, shuffledRemaining.length);
            selectedQuestions = [...selectedQuestions, ...shuffledRemaining.slice(0, countToTake)];
        } else {
            // Se não tiver teoria, segue o fluxo normal aleatório
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
