import { DebugChallenge, DebugDifficulty } from './types';

export const DEBUG_CHALLENGES: DebugChallenge[] = [
    // ==================== INICIANTE ====================
    {
        id: 'debug_beginner_1',
        title: 'Calculadora Quebrada',
        description: 'Esta calculadora deveria somar dois números, mas está retornando resultados errados. Encontre e corrija os bugs!',
        difficulty: DebugDifficulty.BEGINNER,
        bugCount: 2,
        xpReward: 50,
        timeEstimate: '3 min',
        tags: ['variáveis', 'operadores', 'syntax'],
        hints: [
            'Verifique se as variáveis estão sendo declaradas corretamente',
            'O operador de soma está correto?'
        ],
        files: [
            {
                id: 'calc_js',
                name: 'calculator.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `// Calculadora simples
let numero1 = "10";
let numero2 = "5";

let resultado = numero1 - numero2;

console.log("A soma é: " + resultado);`,
                correctCode: `// Calculadora simples
let numero1 = 10;
let numero2 = 5;

let resultado = numero1 + numero2;

console.log("A soma é: " + resultado);`
            }
        ]
    },
    {
        id: 'debug_beginner_2',
        title: 'Saudação com Erro',
        description: 'Um código para saudar o usuário, mas algo está errado com a variável. Corrija!',
        difficulty: DebugDifficulty.BEGINNER,
        bugCount: 1,
        xpReward: 40,
        timeEstimate: '2 min',
        tags: ['variáveis', 'const vs let'],
        hints: [
            'Variáveis const não podem ser reatribuídas'
        ],
        files: [
            {
                id: 'greeting_js',
                name: 'greeting.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `const nome = "Ana";
nome = "João";

console.log("Olá, " + nome + "!");`,
                correctCode: `let nome = "Ana";
nome = "João";

console.log("Olá, " + nome + "!");`
            }
        ]
    },
    {
        id: 'debug_beginner_3',
        title: 'Loop Infinito',
        description: 'Este loop deveria contar de 0 a 5, mas algo está errado!',
        difficulty: DebugDifficulty.BEGINNER,
        bugCount: 1,
        xpReward: 45,
        timeEstimate: '3 min',
        tags: ['loops', 'for'],
        hints: [
            'Verifique a condição de parada do loop'
        ],
        files: [
            {
                id: 'loop_js',
                name: 'counter.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `for (let i = 0; i < 5; i--) {
    console.log(i);
}`,
                correctCode: `for (let i = 0; i < 5; i++) {
    console.log(i);
}`
            }
        ]
    },

    // ==================== INTERMEDIÁRIO ====================
    {
        id: 'debug_inter_1',
        title: 'Lista de Tarefas',
        description: 'Uma aplicação de lista de tarefas com alguns bugs. Adicionar tarefas não funciona corretamente!',
        difficulty: DebugDifficulty.INTERMEDIATE,
        bugCount: 3,
        xpReward: 100,
        timeEstimate: '8 min',
        tags: ['arrays', 'functions', 'DOM'],
        hints: [
            'Verifique como as tarefas estão sendo adicionadas ao array',
            'O método push está sendo usado corretamente?',
            'A função está retornando o valor correto?'
        ],
        files: [
            {
                id: 'todo_js',
                name: 'todoApp.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `let tarefas = [];

function adicionarTarefa(tarefa) {
    tarefas.add(tarefa);
    return tarefas
}

function listarTarefas() {
    for (let i = 0; i <= tarefas.length; i++) {
        console.log(tarefas[i]);
    }
}

adicionarTarefa("Estudar JavaScript");
adicionarTarefa("Fazer exercícios");
listarTarefas();`,
                correctCode: `let tarefas = [];

function adicionarTarefa(tarefa) {
    tarefas.push(tarefa);
    return tarefas;
}

function listarTarefas() {
    for (let i = 0; i < tarefas.length; i++) {
        console.log(tarefas[i]);
    }
}

adicionarTarefa("Estudar JavaScript");
adicionarTarefa("Fazer exercícios");
listarTarefas();`
            }
        ]
    },
    {
        id: 'debug_inter_2',
        title: 'Validador de Email',
        description: 'Esta função deveria validar emails, mas está aceitando emails inválidos.',
        difficulty: DebugDifficulty.INTERMEDIATE,
        bugCount: 2,
        xpReward: 90,
        timeEstimate: '6 min',
        tags: ['strings', 'validation', 'regex'],
        hints: [
            'Verifique a lógica do if',
            'O método includes retorna um boolean'
        ],
        files: [
            {
                id: 'validator_js',
                name: 'emailValidator.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `function validarEmail(email) {
    if (email.includes("@") && email.includes(".")) {
        return false;
    } else {
        return true;
    }
}

console.log(validarEmail("teste@email.com")); // Deveria ser true
console.log(validarEmail("invalido")); // Deveria ser false`,
                correctCode: `function validarEmail(email) {
    if (email.includes("@") && email.includes(".")) {
        return true;
    } else {
        return false;
    }
}

console.log(validarEmail("teste@email.com")); // Deveria ser true
console.log(validarEmail("invalido")); // Deveria ser false`
            }
        ]
    },

    // ==================== AVANÇADO (Projeto Completo) ====================
    {
        id: 'debug_adv_1',
        title: 'Sistema de Login Completo',
        description: 'Um sistema de login com HTML, CSS e JavaScript. Vários bugs estão impedindo o login de funcionar!',
        difficulty: DebugDifficulty.ADVANCED,
        bugCount: 5,
        xpReward: 200,
        timeEstimate: '15 min',
        tags: ['HTML', 'CSS', 'JavaScript', 'Forms', 'Validation'],
        hints: [
            'Verifique os IDs dos elementos HTML',
            'A validação de senha está invertida',
            'O preventDefault está presente?',
            'Existem erros de sintaxe no CSS',
            'Revise o nome dos event listeners'
        ],
        files: [
            {
                id: 'login_html',
                name: 'index.html',
                language: 'html',
                isEditable: true,
                initialCode: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Sistema de Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Login</h1>
        <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="senha" placeholder="Senha" required>
            <button type="submit">Entrar</button>
        </form>
        <div id="mensagem"></div>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
                correctCode: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Sistema de Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Login</h1>
        <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Senha" required>
            <button type="submit">Entrar</button>
        </form>
        <div id="mensagem"></div>
    </div>
    <script src="app.js"></script>
</body>
</html>`
            },
            {
                id: 'login_css',
                name: 'style.css',
                language: 'css',
                isEditable: true,
                initialCode: `.container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc
    border-radius: 8px;
}

input {
    width: 100%
    padding: 10px;
    margin: 10px 0;
}

button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}`,
                correctCode: `.container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
}

button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}`
            },
            {
                id: 'login_js',
                name: 'app.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `const form = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');

form.addEventListener('click', function(e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (password.length > 6) {
        mensagem.textContent = 'Senha muito curta!';
        mensagem.style.color = 'red';
    } else if (!email.includes('@')) {
        mensagem.textContent = 'Email inválido!';
        mensagem.style.color = 'red';
    } else {
        mensagem.textContent = 'Login realizado com sucesso!';
        mensagem.style.color = 'green';
    }
});`,
                correctCode: `const form = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (password.length < 6) {
        mensagem.textContent = 'Senha muito curta!';
        mensagem.style.color = 'red';
    } else if (!email.includes('@')) {
        mensagem.textContent = 'Email inválido!';
        mensagem.style.color = 'red';
    } else {
        mensagem.textContent = 'Login realizado com sucesso!';
        mensagem.style.color = 'green';
    }
});`
            }
        ]
    },
    {
        id: 'debug_adv_2',
        title: 'Galeria de Imagens Interativa',
        description: 'Uma galeria de imagens com modal e navegação. Encontre todos os bugs!',
        difficulty: DebugDifficulty.ADVANCED,
        bugCount: 4,
        xpReward: 180,
        timeEstimate: '12 min',
        tags: ['DOM', 'Events', 'CSS', 'JavaScript'],
        hints: [
            'Verifique os event listeners',
            'A classe CSS está correta?',
            'O índice do array está correto?',
            'querySelector vs querySelectorAll'
        ],
        files: [
            {
                id: 'gallery_html',
                name: 'gallery.html',
                language: 'html',
                isEditable: true,
                initialCode: `<!DOCTYPE html>
<html>
<head>
    <title>Galeria</title>
    <link rel="stylesheet" href="gallery.css">
</head>
<body>
    <div class="gallery">
        <img src="img1.jpg" alt="Imagem 1" class="gallery-img">
        <img src="img2.jpg" alt="Imagem 2" class="gallery-img">
        <img src="img3.jpg" alt="Imagem 3" class="gallery-img">
    </div>
    <div id="modal" class="modal">
        <span class="close">&times;</span>
        <img id="modalImg" class="modal-content">
    </div>
    <script src="gallery.js"></script>
</body>
</html>`,
                correctCode: `<!DOCTYPE html>
<html>
<head>
    <title>Galeria</title>
    <link rel="stylesheet" href="gallery.css">
</head>
<body>
    <div class="gallery">
        <img src="img1.jpg" alt="Imagem 1" class="gallery-img">
        <img src="img2.jpg" alt="Imagem 2" class="gallery-img">
        <img src="img3.jpg" alt="Imagem 3" class="gallery-img">
    </div>
    <div id="modal" class="modal">
        <span class="close">&times;</span>
        <img id="modalImg" class="modal-content">
    </div>
    <script src="gallery.js"></script>
</body>
</html>`
            },
            {
                id: 'gallery_css',
                name: 'gallery.css',
                language: 'css',
                isEditable: true,
                initialCode: `.gallery img {
    width: 200px;
    margin: 10px;
    cursor: pointer;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
}

.modal-conten {
    margin: auto;
    display: block;
    max-width: 80%;
}

.close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}`,
                correctCode: `.gallery img {
    width: 200px;
    margin: 10px;
    cursor: pointer;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
}

.modal-content {
    margin: auto;
    display: block;
    max-width: 80%;
}

.close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}`
            },
            {
                id: 'gallery_js',
                name: 'gallery.js',
                language: 'javascript',
                isEditable: true,
                initialCode: `const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const images = document.querySelector('.gallery-img');
const closeBtn = document.querySelector('.close');

images.forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
    });
});

closeBtn.addEventListener('click', {
    modal.style.display = 'none';
});`,
                correctCode: `const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const images = document.querySelectorAll('.gallery-img');
const closeBtn = document.querySelector('.close');

images.forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});`
            }
        ]
    }
];
