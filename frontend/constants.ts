
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
        title: "Unidade 1: Primeiros Passos",
        description: "Variáveis, Strings e Números.",
        levels: [
            {
                id: 101,
                title: "Variáveis: Let & Const",
                description: "Onde guardamos dados.",
                color: 'brand',
                icon: 'code',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'Variable', definition: 'Um espaço na memória para guardar dados.', type: 'Inglês', example: 'The score variable is 10.' },
                    { term: 'const', definition: 'Declara uma variável constante que não pode mudar.', type: 'Sintaxe', example: 'const pi = 3.14;' },
                    { term: 'let', definition: 'Declara uma variável que pode ser reatribuída.', type: 'Sintaxe', example: 'let age = 20;' }
                ],
                questions: [
                    {
                        id: 't1',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Variáveis',
                        prompt: 'Variable Declaration',
                        englishWord: 'Variable',
                        phonetic: '/ˈveə.ri.ə.bəl/',
                        theoryContent: 'Imagine uma **Variable** como uma caixa etiquetada. \n\nSe a caixa for aberta (**let**), você pode trocar o que tem dentro. Se a caixa for lacrada (**const**), o valor é constante e nunca muda.',
                        codeSnippet: 'let score = 10;\nscore = 20; // ✅\n\nconst pi = 3.14;\npi = 0; // ❌ Erro!',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: '',
                    },
                    {
                        id: 'q1',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'easy',
                        title: 'Prática',
                        prompt: 'Declare uma variável "name" que PODE mudar:',
                        options: [
                            { id: '1', text: 'let name;', isCorrect: true },
                            { id: '2', text: 'const name;', isCorrect: false },
                            { id: '3', text: 'var name;', isCorrect: false },
                        ],
                        correctFeedback: 'Isso! "let" permite mudanças.',
                        wrongFeedback: 'Use "let" para valores mutáveis.',
                    },
                    {
                        id: 'q2',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'medium',
                        title: 'Sintaxe',
                        prompt: 'Crie uma constante para a gravidade:',
                        codeSnippet: '___ gravity = 9.8;',
                        correctAnswer: 'const',
                        options: [],
                        correctFeedback: 'Exato! A gravidade não muda, então é const.',
                        wrongFeedback: 'Use a palavra reservada para constantes.'
                    },
                    {
                        id: 'q3',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Inglês Técnico',
                        prompt: 'O que significa "Assign a value"?',
                        options: [
                            { id: '1', text: 'Atribuir um valor', isCorrect: true },
                            { id: '2', text: 'Assinar um contrato', isCorrect: false },
                            { id: '3', text: 'Apagar um valor', isCorrect: false }
                        ],
                        correctFeedback: 'Correct! Assignment = Atribuição (=).',
                        wrongFeedback: 'Assign vem de designar/atribuir.'
                    }
                ]
            },
            {
                id: 102,
                title: "Tipos de Dados: Strings",
                description: "Trabalhando com textos.",
                color: 'info',
                icon: 'book',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'String', definition: 'Uma sequência de caracteres (texto).', type: 'Lógica', example: '"Hello World"' },
                    { term: 'Quotes', definition: 'Aspas. Usadas para delimitar Strings.', type: 'Inglês', example: 'Single (\') or Double (") quotes.' }
                ],
                questions: [
                    {
                        id: 't_str',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Texto é String',
                        prompt: 'Strings',
                        englishWord: 'String',
                        phonetic: '/strɪŋ/',
                        theoryContent: 'Em programação, texto é chamado de **String** (fio/corda de caracteres). Sempre usamos aspas ("" ou \'\'). \n\nSem aspas, o JavaScript acha que é uma variável!',
                        codeSnippet: 'let dog = "Rex"; // String\nlet cat = Rex; // Erro (variável Rex não existe)',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_drag_str',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'medium',
                        title: 'Monte o Código',
                        prompt: 'Crie uma variável com o texto Hello:',
                        options: [],
                        segments: ['const', 'msg', '=', '"Hello";'],
                        distractors: ['Hello', 'let'],
                        correctFeedback: 'Perfeito!',
                        wrongFeedback: 'Lembre das aspas na String.'
                    },
                    {
                        id: 'q_listen_str',
                        type: QuestionType.LISTENING,
                        difficulty: 'medium',
                        title: 'Listening',
                        prompt: 'Qual tipo de dado foi mencionado?',
                        englishWord: 'We use a String to store text data.',
                        options: [
                            { id: '1', text: 'String', isCorrect: true },
                            { id: '2', text: 'Number', isCorrect: false },
                            { id: '3', text: 'Boolean', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! String stores text.',
                        wrongFeedback: 'Ouça atentamente: "Text data".'
                    }
                ]
            },
            {
                id: 103,
                title: "Console & Output",
                description: "Debugando código.",
                color: 'secondary',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'console.log', definition: 'Comando para exibir dados no terminal.', type: 'Sintaxe', example: 'console.log(x);' },
                    { term: 'Output', definition: 'A saída de dados de um programa.', type: 'Inglês', example: 'Check the output window.' }
                ],
                questions: [
                    {
                        id: 't_log',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'O Diário de Bordo',
                        prompt: 'Console Log',
                        englishWord: 'Output',
                        phonetic: '/ˈaʊt.pʊt/',
                        theoryContent: '`console.log()` é seu melhor amigo. Ele "imprime" informações no painel de desenvolvedor. Usamos isso para verificar se nosso código está funcionando como esperado.',
                        codeSnippet: 'console.log("O sistema está online!");',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_log',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Associe',
                        prompt: 'Conecte os termos:',
                        options: [],
                        pairs: [
                            { id: 'p1', text: 'console.log', pairId: 'r1' },
                            { id: 'r1', text: 'Mostrar dados', pairId: 'p1' },
                            { id: 'p2', text: 'Erro', pairId: 'r2' },
                            { id: 'r2', text: 'Bug', pairId: 'p2' },
                            { id: 'p3', text: 'Input', pairId: 'r3' },
                            { id: 'r3', text: 'Entrada', pairId: 'p3' },
                        ],
                        correctFeedback: 'Muito bem!',
                        wrongFeedback: 'Tente novamente.'
                    },
                    {
                        id: 'q_code_log',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'easy',
                        title: 'Prática',
                        prompt: 'Mostre o valor de "x" no console:',
                        options: [
                            { id: '1', text: 'console.log(x);', isCorrect: true },
                            { id: '2', text: 'print(x);', isCorrect: false },
                            { id: '3', text: 'console(x);', isCorrect: false }
                        ],
                        correctFeedback: 'Exato! .log() é o método.',
                        wrongFeedback: 'Faltou o .log ou usou comando de outra linguagem.'
                    }
                ]
            },
            {
                id: 104,
                title: "Números e Operações",
                description: "Matemática básica.",
                color: 'warn',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Number', definition: 'Tipo de dado numérico.', type: 'Lógica', example: 'let age = 25;' },
                    { term: 'Operators', definition: 'Símbolos para operações (+, -, *, /).', type: 'Sintaxe', example: 'let sum = 10 + 5;' }
                ],
                questions: [
                    {
                        id: 't_num',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Matemática',
                        prompt: 'Numbers',
                        englishWord: 'Integer',
                        phonetic: '/ˈɪn.tɪ.dʒər/',
                        theoryContent: 'JavaScript faz contas facilmente. Use `+` para somar, `-` para subtrair, `*` para multiplicar e `/` para dividir. Não use aspas para números!',
                        codeSnippet: 'let score = 10 + 5; // 15\nlet double = score * 2; // 30',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_calc',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'easy',
                        title: 'Cálculo',
                        prompt: 'Some 10 com 20:',
                        codeSnippet: 'let total = 10 ___ 20;',
                        correctAnswer: '+',
                        options: [],
                        correctFeedback: 'Isso! + soma valores.',
                        wrongFeedback: 'Qual símbolo usamos para adição?'
                    },
                    {
                        id: 'q_drag_math',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'medium',
                        title: 'Monte a Conta',
                        prompt: 'Crie uma variável "price" igual a 50:',
                        options: [],
                        segments: ['let', 'price', '=', '50;'],
                        distractors: ['"50"', 'const'],
                        correctFeedback: 'Correto! Sem aspas para números.',
                        wrongFeedback: 'Números não levam aspas.'
                    }
                ]
            },
            {
                id: 105,
                title: "Variáveis: Reatribuição",
                description: "Mudando o passado.",
                color: 'brand',
                icon: 'code',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Reassignment', definition: 'Dar um novo valor a uma variável existente.', type: 'Lógica', example: 'x = 5; x = 10;' }
                ],
                questions: [
                    {
                        id: 't_reassign',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Mudando Valores',
                        prompt: 'Reassignment',
                        englishWord: 'Update',
                        phonetic: '/ʌpˈdeɪt/',
                        theoryContent: 'Com `let`, você pode atualizar o valor de uma variável. Basta usar o nome dela e o sinal de igual. Não use `let` novamente!',
                        codeSnippet: 'let points = 0;\npoints = 10; // ✅ Atualizou!\nlet points = 20; // ❌ Erro: já existe!',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_update',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'medium',
                        title: 'Atualize',
                        prompt: 'Mude o valor de "lives" para 0:',
                        options: [
                            { id: '1', text: 'lives = 0;', isCorrect: true },
                            { id: '2', text: 'let lives = 0;', isCorrect: false },
                            { id: '3', text: 'lives == 0;', isCorrect: false }
                        ],
                        correctFeedback: 'Perfeito! Sem "let" para atualizar.',
                        wrongFeedback: 'Não redeclare a variável, apenas atribua.'
                    },
                    {
                        id: 'q_match_var',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'easy',
                        title: 'Conceitos',
                        prompt: 'Associe:',
                        options: [],
                        pairs: [
                            { id: 'p1', text: 'let', pairId: 'r1' },
                            { id: 'r1', text: 'Pode mudar', pairId: 'p1' },
                            { id: 'p2', text: 'const', pairId: 'r2' },
                            { id: 'r2', text: 'Fixo', pairId: 'p2' }
                        ],
                        correctFeedback: 'Isso aí!',
                        wrongFeedback: 'Revise let vs const.'
                    }
                ]
            },
            {
                id: 106,
                title: "Tipos Booleanos",
                description: "Verdadeiro ou Falso?",
                color: 'info',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Boolean', definition: 'Um valor que é true (verdadeiro) ou false (falso).', type: 'Lógica', example: 'let isActive = true;' }
                ],
                questions: [
                    {
                        id: 't_bool',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Sim ou Não',
                        prompt: 'Boolean',
                        englishWord: 'True/False',
                        phonetic: '/truː/',
                        theoryContent: 'Booleans são a base da lógica. Eles só podem ser `true` ou `false`. Sem aspas! Usamos para "ligar/desligar" coisas.',
                        codeSnippet: 'let isGameOver = false;\nlet hasKey = true;',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_bool_val',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'easy',
                        title: 'Tradução',
                        prompt: 'O que significa "false"?',
                        options: [
                            { id: '1', text: 'Falso', isCorrect: true },
                            { id: '2', text: 'Falha', isCorrect: false },
                            { id: '3', text: 'Vazio', isCorrect: false }
                        ],
                        correctFeedback: 'Correct!',
                        wrongFeedback: 'False = Falso.'
                    },
                    {
                        id: 'q_drag_bool',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'medium',
                        title: 'Código',
                        prompt: 'Declare que o usuário é admin:',
                        options: [],
                        segments: ['let', 'isAdmin', '=', 'true;'],
                        distractors: ['"true"', 'yes'],
                        correctFeedback: 'Boa!',
                        wrongFeedback: 'Booleans são palavras reservadas, sem aspas.'
                    }
                ]
            },
            {
                id: 107,
                title: "Comentários",
                description: "Notas invisíveis.",
                color: 'secondary',
                icon: 'book',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Comment', definition: 'Texto ignorado pelo computador, útil para humanos.', type: 'Sintaxe', example: '// Isso é um comentário' }
                ],
                questions: [
                    {
                        id: 't_comment',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Anotações',
                        prompt: 'Comments',
                        englishWord: 'Ignore',
                        phonetic: '/ɪɡˈnɔːr/',
                        theoryContent: 'Use `//` para criar um comentário de uma linha. O computador ignora tudo depois das barras. É ótimo para explicar seu código!',
                        codeSnippet: 'let x = 10; // Define x como 10\n// Este código não faz nada',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_comment_syntax',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'easy',
                        title: 'Sintaxe',
                        prompt: 'Crie um comentário:',
                        codeSnippet: '___ Minha anotação',
                        correctAnswer: '//',
                        options: [],
                        correctFeedback: 'Isso! Duas barras.',
                        wrongFeedback: 'Use duas barras.'
                    },
                    {
                        id: 'q_listening_comment',
                        type: QuestionType.LISTENING,
                        difficulty: 'easy',
                        title: 'Listening',
                        prompt: 'O que o código faz com comentários?',
                        englishWord: 'The computer ignores comments.',
                        options: [
                            { id: '1', text: 'Ignora', isCorrect: true },
                            { id: '2', text: 'Executa', isCorrect: false },
                            { id: '3', text: 'Apaga', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! It ignores them.',
                        wrongFeedback: 'Ouça: "ignores".'
                    }
                ]
            },
            {
                id: 108,
                title: "Juntando Textos",
                description: "Concatenação.",
                color: 'warn',
                icon: 'code',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Concatenation', definition: 'Unir duas strings.', type: 'Lógica', example: '"A" + "B" = "AB"' }
                ],
                questions: [
                    {
                        id: 't_concat',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Somando Palavras',
                        prompt: 'Concatenation',
                        englishWord: 'Join',
                        phonetic: '/dʒɔɪn/',
                        theoryContent: 'Você pode "somar" strings para juntá-las. Isso se chama **Concatenação**. Cuidado com os espaços!',
                        codeSnippet: 'let nome = "Ana";\nlet saudacao = "Oi " + nome; // "Oi Ana"',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_concat_res',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'medium',
                        title: 'Resultado',
                        prompt: 'Qual o resultado de "Java" + "Script"?',
                        options: [
                            { id: '1', text: '"JavaScript"', isCorrect: true },
                            { id: '2', text: '"Java Script"', isCorrect: false },
                            { id: '3', text: 'Erro', isCorrect: false }
                        ],
                        correctFeedback: 'Exato! Cola sem espaço.',
                        wrongFeedback: 'O computador não adiciona espaço sozinho.'
                    },
                    {
                        id: 'q_drag_concat',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'hard',
                        title: 'Monte a Frase',
                        prompt: 'Crie "Super Mario":',
                        options: [],
                        segments: ['"Super"', '+', '" "', '+', '"Mario"'],
                        distractors: ['-'],
                        correctFeedback: 'Perfeito!',
                        wrongFeedback: 'Precisa do espaço no meio.'
                    }
                ]
            },
            {
                id: 109,
                title: "Template Literals",
                description: "Strings modernas.",
                color: 'info',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Template Literal', definition: 'String com crases que aceita variáveis dentro.', type: 'Sintaxe', example: '`Oi ${nome}`' }
                ],
                questions: [
                    {
                        id: 't_template',
                        type: QuestionType.THEORY,
                        difficulty: 'medium',
                        title: 'Super Strings',
                        prompt: 'Backticks',
                        englishWord: 'Embed',
                        phonetic: '/ɪmˈbed/',
                        theoryContent: 'Em vez de usar `+`, use crases (`` ` ``) e `${}` para colocar variáveis dentro do texto. É muito mais limpo!',
                        codeSnippet: 'let user = "Leo";\nlet msg = `Bem-vindo ${user}!`;',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_template_syntax',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'medium',
                        title: 'Sintaxe',
                        prompt: 'Complete para interpolar:',
                        codeSnippet: '`Olá ___{name}`',
                        correctAnswer: '$',
                        options: [],
                        correctFeedback: 'Isso! Cifrão antes das chaves.',
                        wrongFeedback: 'Sintaxe é ${variavel}.'
                    },
                    {
                        id: 'q_match_quote',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'easy',
                        title: 'Aspas',
                        prompt: 'Qual usa qual?',
                        options: [],
                        pairs: [
                            { id: 'p1', text: 'String Normal', pairId: 'r1' },
                            { id: 'r1', text: '"Aspas"', pairId: 'p1' },
                            { id: 'p2', text: 'Template Literal', pairId: 'r2' },
                            { id: 'r2', text: '`Crases`', pairId: 'p2' }
                        ],
                        correctFeedback: 'Boa!',
                        wrongFeedback: 'Confundiu aspas com crases.'
                    }
                ]
            },
            {
                id: 110,
                title: "Revisão Unidade 1",
                description: "Teste seus conhecimentos.",
                color: 'brand',
                icon: 'trophy',
                totalQuestions: 5,
                stars: 0,
                learnableConcepts: [],
                questions: [
                    {
                        id: 'rev_1',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'hard',
                        title: 'Desafio Final',
                        prompt: 'Declare uma constante "pi" com valor 3.14:',
                        options: [
                            { id: '1', text: 'const pi = 3.14;', isCorrect: true },
                            { id: '2', text: 'let pi = 3.14;', isCorrect: false },
                            { id: '3', text: 'var pi = 3.14;', isCorrect: false }
                        ],
                        correctFeedback: 'Excelente!',
                        wrongFeedback: 'Pi é constante.'
                    },
                    {
                        id: 'rev_2',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'medium',
                        title: 'Conceito',
                        prompt: 'O que é uma "String"?',
                        options: [
                            { id: '1', text: 'Texto', isCorrect: true },
                            { id: '2', text: 'Número', isCorrect: false },
                            { id: '3', text: 'Lista', isCorrect: false }
                        ],
                        correctFeedback: 'Isso!',
                        wrongFeedback: 'String é texto.'
                    },
                    {
                        id: 'rev_3',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'medium',
                        title: 'Output',
                        prompt: 'Comando para mostrar na tela:',
                        codeSnippet: 'console.___(msg);',
                        correctAnswer: 'log',
                        options: [],
                        correctFeedback: 'console.log!',
                        wrongFeedback: 'log.'
                    },
                    {
                        id: 'rev_4',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'hard',
                        title: 'Lógica',
                        prompt: 'Crie uma mensagem "Oi Dev":',
                        options: [],
                        segments: ['let', 'm', '=', '`Oi ${role}`;'],
                        distractors: ['+'],
                        correctFeedback: 'Muito bem!',
                        wrongFeedback: 'Use template literals.'
                    },
                    {
                        id: 'rev_5',
                        type: QuestionType.LISTENING,
                        difficulty: 'easy',
                        title: 'Inglês',
                        prompt: 'Qual palavra significa "Variável"?',
                        englishWord: 'Variable',
                        options: [
                            { id: '1', text: 'Variable', isCorrect: true },
                            { id: '2', text: 'Value', isCorrect: false },
                            { id: '3', text: 'Variety', isCorrect: false }
                        ],
                        correctFeedback: 'Yes!',
                        wrongFeedback: 'Variable.'
                    }
                ]
            },
        ]
    },
    {
        id: 2,
        title: "Unidade 2: Lógica Booleana",
        description: "Verdadeiro, Falso e Decisões.",
        levels: [
            {
                id: 201,
                title: "True ou False?",
                description: "O tipo Boolean.",
                color: 'warn',
                icon: 'trophy',
                totalQuestions: 3,
                learnableConcepts: [
                    { term: 'Boolean', definition: 'Um valor que pode ser apenas verdadeiro ou falso.', type: 'Lógica' },
                    { term: 'Condition', definition: 'Uma condição que determina o fluxo do código.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_bool',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Binário',
                        prompt: 'Booleans',
                        englishWord: 'Condition',
                        phonetic: '/kənˈdɪʃ.ən/',
                        theoryContent: 'Um **Boolean** é o tipo de dado mais simples: só pode ser `true` (verdadeiro) ou `false` (falso). É a base de toda tomada de decisão no código.',
                        codeSnippet: 'let isOnline = true;\nlet hasError = false;',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_match_bool',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Tradução',
                        prompt: 'Traduza os termos lógicos:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'True', pairId: '1a' },
                            { id: '1a', text: 'Verdadeiro', pairId: '1' },
                            { id: '2', text: 'False', pairId: '2a' },
                            { id: '2a', text: 'Falso', pairId: '2' },
                            { id: '3', text: 'Boolean', pairId: '3a' },
                            { id: '3a', text: 'Lógico', pairId: '3' }
                        ],
                        correctFeedback: 'Ótimo!',
                        wrongFeedback: 'Ups, tente de novo.'
                    },
                    {
                        id: 'q_fill_bool',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'medium',
                        title: 'Código',
                        prompt: 'Declare que o usuário é admin (verdadeiro):',
                        codeSnippet: 'let isAdmin = ___;',
                        correctAnswer: 'true',
                        options: [],
                        correctFeedback: 'Isso! Sem aspas, pois é uma palavra reservada.',
                        wrongFeedback: 'Use "true" (minúsculo).'
                    }
                ],
                stars: 0
            },
            {
                id: 202,
                title: "If / Else",
                description: "Tomando caminhos diferentes.",
                color: 'brand',
                icon: 'code',
                totalQuestions: 4,
                stars: 0,
                learnableConcepts: [
                    { term: 'if', definition: 'Executa um bloco se a condição for verdadeira.', type: 'Sintaxe' },
                    { term: 'else', definition: 'Executa um bloco caso a condição do if falhe.', type: 'Sintaxe' },
                    { term: 'Statement', definition: 'Uma instrução ou comando no código.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_if',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Se... Senão...',
                        prompt: 'Statements',
                        englishWord: 'Statement',
                        theoryContent: 'Usamos `if` para executar código APENAS se uma condição for `true`. O `else` captura qualquer outro caso.',
                        codeSnippet: 'if (age >= 18) {\n  enterParty();\n} else {\n  goHome();\n}',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_drag_if',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'hard',
                        title: 'Lógica',
                        prompt: 'Monte: Se pontuação > 10, ganha.',
                        segments: ['if', '(score > 10)', '{', 'win();', '}'],
                        distractors: ['else', 'then'],
                        options: [],
                        correctFeedback: 'Código válido!',
                        wrongFeedback: 'Siga a estrutura: if (condição) { ação }'
                    },
                    {
                        id: 'q_trans_if',
                        type: QuestionType.TRANSLATION,
                        difficulty: 'medium',
                        title: 'Inglês',
                        prompt: 'O que significa "Else"?',
                        options: [
                            { id: '1', text: 'Senão / Caso contrário', isCorrect: true },
                            { id: '2', text: 'Então', isCorrect: false },
                            { id: '3', text: 'Fim', isCorrect: false }
                        ],
                        correctFeedback: 'Correto. Else cobre o que sobra.',
                        wrongFeedback: 'Else é a alternativa.'
                    },
                    {
                        id: 'q_fill_else',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'medium',
                        title: 'Syntax',
                        prompt: 'Complete a estrutura condicional:',
                        codeSnippet: 'if (x) { ... } ___ { ... }',
                        correctAnswer: 'else',
                        options: [],
                        correctFeedback: 'Boa!',
                        wrongFeedback: 'O oposto do if é o else.'
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Unidade 3: Arrays & Listas",
        description: "Organizando coleções de dados.",
        levels: [
            {
                id: 301,
                title: "O que é um Array?",
                description: "Listas ordenadas.",
                color: 'secondary',
                icon: 'book',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Array', definition: 'Uma estrutura para armazenar múltiplos itens.', type: 'Lógica', example: '[1, 2, 3]' },
                    { term: 'Brackets', definition: 'Colchetes [ ]. Usados para criar arrays.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_arr',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Listas',
                        prompt: 'Arrays',
                        englishWord: 'Array',
                        phonetic: '/əˈreɪ/',
                        theoryContent: 'Um **Array** é uma super-variável que guarda vários itens em ordem. Usamos colchetes `[]` para criá-lo.',
                        codeSnippet: 'let fruits = ["Maçã", "Banana", "Uva"];',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_mc_arr',
                        type: QuestionType.MULTIPLE_CHOICE,
                        difficulty: 'easy',
                        title: 'Identificação',
                        prompt: 'Qual destas opções é um Array válido?',
                        options: [
                            { id: '1', text: '["A", "B", "C"]', isCorrect: true },
                            { id: '2', text: '(1, 2, 3)', isCorrect: false },
                            { id: '3', text: '{1, 2, 3}', isCorrect: false }
                        ],
                        correctFeedback: 'Correto! Colchetes [] definem arrays.',
                        wrongFeedback: 'Arrays usam colchetes [].'
                    },
                    {
                        id: 'q_code_arr',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'medium',
                        title: 'Criação',
                        prompt: 'Crie um array vazio chamado "list":',
                        options: [
                            { id: '1', text: 'const list = [];', isCorrect: true },
                            { id: '2', text: 'const list = {};', isCorrect: false },
                            { id: '3', text: 'const list = new Array;', isCorrect: false }
                        ],
                        correctFeedback: 'Moderna e limpa. [] é o ideal.',
                        wrongFeedback: 'Use a notação literal [].'
                    }
                ]
            },
            {
                id: 302,
                title: "Acessando Itens",
                description: "O Índice Zero.",
                color: 'info',
                icon: 'zap',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Index', definition: 'A posição numérica de um item em um array.', type: 'Inglês' },
                    { term: 'Zero-based', definition: 'Contagem que começa em 0, não em 1.', type: 'Lógica' }
                ],
                questions: [
                    {
                        id: 't_idx',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Zero-based Indexing',
                        prompt: 'Index',
                        englishWord: 'Index',
                        theoryContent: 'Em JS, a contagem começa no **ZERO**. O primeiro item da lista está na posição 0, não 1. Isso confunde todo mundo no começo!',
                        codeSnippet: 'let colors = ["Red", "Blue"];\n// colors[0] é "Red"\n// colors[1] é "Blue"',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_fill_idx',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'hard',
                        title: 'Lógica',
                        prompt: 'Pegue o PRIMEIRO item do array "users":',
                        codeSnippet: 'let first = users[___];',
                        correctAnswer: '0',
                        options: [],
                        correctFeedback: 'Exato! O índice 0 é o primeiro.',
                        wrongFeedback: 'Lembre-se: programadores contam a partir do 0.'
                    },
                    {
                        id: 'q_match_idx',
                        type: QuestionType.PAIR_MATCH,
                        difficulty: 'medium',
                        title: 'Conceitos',
                        prompt: 'Ligue o conceito:',
                        options: [],
                        pairs: [
                            { id: '1', text: 'Index 0', pairId: '1a' },
                            { id: '1a', text: 'Primeiro Item', pairId: '1' },
                            { id: '2', text: 'Length', pairId: '2a' },
                            { id: '2a', text: 'Tamanho Total', pairId: '2' },
                            { id: '3', text: 'Undefined', pairId: '3a' },
                            { id: '3a', text: 'Item não existe', pairId: '3' }
                        ],
                        correctFeedback: 'Excelente memória!',
                        wrongFeedback: 'Tente novamente.'
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "Unidade 4: Funções",
        description: "Reutilizando lógica.",
        levels: [
            {
                id: 401,
                title: "Declarando Funções",
                description: "Criando comandos novos.",
                color: 'warn',
                icon: 'code',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Function', definition: 'Um bloco de código reutilizável.', type: 'Inglês' },
                    { term: 'Call', definition: 'Ação de executar a função.', type: 'Inglês' }
                ],
                questions: [
                    {
                        id: 't_func',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Receitas de Código',
                        prompt: 'Functions',
                        theoryContent: 'Funções são blocos de código que você dá um nome. Quando você "chama" o nome, o código roda. É como ensinar um truque novo pro computador.',
                        codeSnippet: 'function pular() {\n  player.y += 10;\n}',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_drag_func',
                        type: QuestionType.DRAG_AND_DROP,
                        difficulty: 'medium',
                        title: 'Estrutura',
                        prompt: 'Crie uma função vazia chamada "start":',
                        segments: ['function', 'start()', '{', '}'],
                        distractors: ['call', 'var'],
                        options: [],
                        correctFeedback: 'Correto!',
                        wrongFeedback: 'Sintaxe: function nome() { }'
                    },
                    {
                        id: 'q_listen_call',
                        type: QuestionType.LISTENING,
                        difficulty: 'hard',
                        title: 'Inglês',
                        prompt: 'Qual ação o código faz?',
                        englishWord: 'Call the function to execute the code.',
                        options: [
                            { id: '1', text: 'Chamar a função', isCorrect: true },
                            { id: '2', text: 'Apagar a função', isCorrect: false },
                            { id: '3', text: 'Criar a função', isCorrect: false }
                        ],
                        correctFeedback: 'Yes! Call = Chamar/Executar.',
                        wrongFeedback: 'Call significa chamar.'
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "Unidade 5: Objetos",
        description: "Modelando o mundo real.",
        levels: [
            {
                id: 501,
                title: "Chave e Valor",
                description: "O formato JSON.",
                color: 'brand',
                icon: 'trophy',
                totalQuestions: 3,
                stars: 0,
                learnableConcepts: [
                    { term: 'Object', definition: 'Coleção de propriedades (chave: valor).', type: 'Lógica' },
                    { term: 'Property', definition: 'Uma característica de um objeto.', type: 'Inglês' },
                    { term: 'Dot Notation', definition: 'Acessar valores usando ponto (obj.prop).', type: 'Sintaxe' }
                ],
                questions: [
                    {
                        id: 't_obj',
                        type: QuestionType.THEORY,
                        difficulty: 'easy',
                        title: 'Dicionários',
                        prompt: 'Objects',
                        englishWord: 'Properties',
                        theoryContent: 'Objetos agrupam dados relacionados usando **chaves** e **valores**. Usamos chaves `{}`. É perfeito para descrever um usuário, um produto ou um post.',
                        codeSnippet: 'const user = {\n  name: "Ana",\n  age: 25\n};',
                        options: [],
                        correctFeedback: '',
                        wrongFeedback: ''
                    },
                    {
                        id: 'q_code_obj',
                        type: QuestionType.CODE_BUILDER,
                        difficulty: 'medium',
                        title: 'Acesso',
                        prompt: 'Como pegamos o nome do usuário?',
                        options: [
                            { id: '1', text: 'user.name', isCorrect: true },
                            { id: '2', text: 'user[name]', isCorrect: false },
                            { id: '3', text: 'user->name', isCorrect: false }
                        ],
                        correctFeedback: 'Dot notation (ponto) é o padrão!',
                        wrongFeedback: 'Use o ponto (.) para acessar propriedades.'
                    },
                    {
                        id: 'q_fill_obj',
                        type: QuestionType.FILL_IN_BLANK,
                        difficulty: 'hard',
                        title: 'Sintaxe',
                        prompt: 'Defina a chave "id" como 1:',
                        codeSnippet: 'const item = { id___ 1 };',
                        correctAnswer: ':',
                        options: [],
                        correctFeedback: 'Isso! Dois pontos separam chave e valor.',
                        wrongFeedback: 'Em objetos, usamos dois pontos (:).'
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
    for (const unit of CURRICULUM) {
        const level = unit.levels.find(l => l.id === id);
        if (level) return level;
    }

    // 2. If id is high, it might be generated. 
    // Since we don't store generated levels in constants, we re-generate 
    // deterministically or assume App/Home passed the data context. 
    // However, for this demo, we'll implement a simple deterministic generator based on ID 
    // so direct linking works.
    if (id > 900) {
        const seedUnitId = Math.floor(id / 100); // approx
        const generatedUnit = generateRandomUnit(seedUnitId, Math.floor(id / 10) * 10); // approximate logic
        return generatedUnit.levels.find(l => l.id === id) || generatedUnit.levels[0];
    }

    return undefined;
};
