# GUIA COMPLETO: Adicionar Tradução e Pronúncia aos Exercícios de Inglês

## ✅ PASSO 1: Atualizar types.ts (JÁ FEITO)
O campo `translation?: string` já foi adicionado à interface `Question`.

## ⏳ PASSO 2: Atualizar Lesson.tsx

### Localização: frontend/screens/Lesson.tsx

#### 2.1 - Substituir renderListening (linhas 388-412)

```tsx
const renderListening = () => (
    <div className="w-full max-w-xl mx-auto px-6 pt-4 pb-32 flex flex-col">
        <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>
        
        {/* Card com frase em inglês, tradução e pronúncia */}
        {currentQuestion.englishWord && (
            <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-sm">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">{currentQuestion.englishWord}</p>
                {currentQuestion.translation && (
                    <p className="text-base text-blue-700 dark:text-blue-300 mb-2">
                        <span className="font-semibold">Tradução:</span> {currentQuestion.translation}
                    </p>
                )}
                {currentQuestion.phonetic && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                        <span className="font-semibold">Como se fala:</span> {currentQuestion.phonetic}
                    </p>
                )}
            </div>
        )}
        
        <div className="flex justify-center mb-10">
            <button onClick={() => currentQuestion.englishWord && playAudio(currentQuestion.englishWord)} className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)] border-2 ${isPlayingAudio ? 'bg-brand text-white border-brand-dark scale-105' : 'bg-brand text-white border-brand-dark hover:brightness-110'}`}>
                <Volume2 size={48} className={isPlayingAudio ? 'animate-bounce' : ''} />
                <span className="text-xs font-black uppercase tracking-widest">Ouvir</span>
            </button>
        </div>
        <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.id;
                let styles = "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 border-2 border-b-4";
                if (isSelected) styles = "bg-info/10 border-info text-info-dark border-2 border-b-4";
                if (isCheckSubmitted && option.isCorrect) styles = "bg-brand/10 border-brand text-brand-dark border-2 border-b-4";
                if (isCheckSubmitted && isSelected && !option.isCorrect) styles = "bg-danger/10 border-danger text-danger border-2 border-b-4";
                return (
                    <button key={option.id} onClick={() => !isCheckSubmitted && setSelectedOption(option.id)} className={`w-full p-4 rounded-xl font-mono text-left text-lg transition-all active:scale-[0.98] ${styles}`}>
                        {option.text}
                    </button>
                )
            })}
        </div>
    </div>
);
```

#### 2.2 - Substituir renderSpeaking (linhas 414-447)

```tsx
const renderSpeaking = () => (
    <div className="w-full max-w-xl mx-auto px-6 pt-4 pb-32 flex flex-col items-center text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>

        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 w-full shadow-lg">
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-4">{currentQuestion.englishWord}</p>
            
            {currentQuestion.translation && (
                <p className="text-lg text-purple-700 dark:text-purple-300 mb-3">
                    <span className="font-semibold">Tradução:</span> {currentQuestion.translation}
                </p>
            )}
            
            {currentQuestion.phonetic && (
                <p className="text-base text-purple-600 dark:text-purple-400 font-mono mb-4">
                    <span className="font-semibold">Como se fala:</span> {currentQuestion.phonetic}
                </p>
            )}
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4 border-t border-purple-200 dark:border-purple-700 pt-4">Diga esta frase em voz alta</p>
        </div>

        <button
            onClick={() => {
                if (isCheckSubmitted) return;
                setIsPlayingAudio(true);
                setTimeout(() => {
                    setIsPlayingAudio(false);
                    setSelectedOption('spoken');
                }, 2000);
            }}
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-[0_10px_0_rgba(0,0,0,0.1)] border-4 ${selectedOption === 'spoken'
                    ? 'bg-green-500 border-green-600 text-white'
                    : isPlayingAudio
                        ? 'bg-red-500 border-red-600 text-white scale-110 animate-pulse'
                        : 'bg-brand border-brand-dark text-white hover:scale-105'
                }`}
        >
            {selectedOption === 'spoken' ? <Check size={48} /> : <Volume2 size={48} />}
            <span className="font-black uppercase tracking-widest text-sm">
                {selectedOption === 'spoken' ? 'Gravado' : isPlayingAudio ? 'Ouvindo...' : 'Falar'}
            </span>
        </button>
    </div>
);
```

## ⏳ PASSO 3: Atualizar constants.ts

### Localização: frontend/constants.ts

Adicionar os campos `translation` e `phonetic` em TODAS as questões de inglês (LISTENING e SPEAKING).

### Unit 1 - Questão e_l1 (linha ~144)
```typescript
englishWord: 'I am working on the login page.',
translation: 'Estou trabalhando na página de login.',
phonetic: 'Ai em uór.king on dâ ló.guin peidj',
```

### Unit 1 - Questão e_s1 (linha ~159)
```typescript
englishWord: 'I have no blockers',
translation: 'Não tenho impedimentos',
phonetic: 'Ai rrév nou blá.kers',
```

### Unit 2 - Questão e_s2 (linha ~226)
```typescript
englishWord: 'Can you fix this typo?',
translation: 'Você pode corrigir este erro de digitação?',
phonetic: 'Kén iu fiks dis tái.pou?',
```

### Unit 2 - Questão e_l2 (linha ~237)
```typescript
englishWord: 'Please update the documentation.',
translation: 'Por favor, atualize a documentação.',
phonetic: 'Pliz âp.deit dâ dó.kiu.men.téi.shon',
```

## 📝 EXEMPLO COMPLETO DE QUESTÃO ATUALIZADA

```typescript
{
    id: 'e_l1',
    type: QuestionType.LISTENING,
    difficulty: 'easy',
    title: 'Listening',
    prompt: 'What did they say?',
    englishWord: 'I am working on the login page.',
    translation: 'Estou trabalhando na página de login.',
    phonetic: 'Ai em uór.king on dâ ló.guin peidj',
    options: [
        { id: '1', text: 'Estou trabalhando na página de login.', isCorrect: true },
        { id: '2', text: 'Terminei a página de login.', isCorrect: false },
        { id: '3', text: 'Vou começar a página de login.', isCorrect: false }
    ],
    correctFeedback: 'Correct!',
    wrongFeedback: 'Listen for "working on".'
},
```

## 🎯 RESULTADO ESPERADO

Após implementar essas mudanças:

1. **Exercícios de Listening**: Mostrarão um card azul com a frase em inglês, tradução e pronúncia ANTES do botão "Ouvir"
2. **Exercícios de Speaking**: Mostrarão um card roxo/rosa com a frase em inglês, tradução e pronúncia ANTES do botão "Falar"

## ✅ CHECKLIST

- [x] Campo `translation` adicionado em types.ts
- [ ] Função `renderListening` atualizada em Lesson.tsx
- [ ] Função `renderSpeaking` atualizada em Lesson.tsx  
- [ ] Questão `e_l1` atualizada em constants.ts
- [ ] Questão `e_s1` atualizada em constants.ts
- [ ] Questão `e_s2` atualizada em constants.ts
- [ ] Questão `e_l2` atualizada em constants.ts
- [ ] Testar no navegador

## 🚀 PRÓXIMOS PASSOS

Depois de implementar, execute:
```bash
npm run build
git add .
git commit -m "feat: add translation and phonetic pronunciation to English exercises"
git push
```
