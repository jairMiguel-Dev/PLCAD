// Script para migrar progresso do localStorage para o banco de dados
// Execute este script no console do navegador quando estiver logado

async function migrateProgressToBackend() {
    const token = localStorage.getItem('auth_token');
    const localProgress = localStorage.getItem('progres_user_v3');

    if (!token) {
        console.error('❌ Você precisa estar logado para migrar os dados');
        return;
    }

    if (!localProgress) {
        console.error('❌ Não há progresso local para migrar');
        return;
    }

    try {
        const progress = JSON.parse(localProgress);

        console.log('📦 Progresso encontrado:', progress);
        console.log('⏳ Enviando para o servidor...');

        // Salvar progresso
        const progressResponse = await fetch('http://localhost:5000/api/auth/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ progress })
        });

        if (progressResponse.ok) {
            console.log('✅ Progresso migrado com sucesso!');
            console.log('🔄 Recarregue a página para ver as mudanças');
        } else {
            const error = await progressResponse.json();
            console.error('❌ Erro ao migrar:', error);
        }
    } catch (error) {
        console.error('❌ Erro ao processar:', error);
    }
}

// Para executar, chame:
// migrateProgressToBackend()

console.log('✅ Script de migração carregado!');
console.log('📝 Para migrar seu progresso, execute: migrateProgressToBackend()');
