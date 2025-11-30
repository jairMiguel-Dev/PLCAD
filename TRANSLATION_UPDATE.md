# Atualização de Traduções e Pronúncias

## Objetivo
Adicionar tradução em português e pronúncia fonética simplificada para todas as questões de inglês.

## Mudanças Necessárias

### 1. Interface Question (types.ts) ✅
Já adicionado o campo `translation?: string`

### 2. Componentes de Renderização (Lesson.tsx)

#### renderListening - ATUALIZADO
```tsx
const renderListening = () => (
    <div className="w-full max-w-xl mx-auto px-6 pt-4 pb-32 flex flex-col">
        <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>
        
        {/* Card com frase, tradução e pronúncia */}
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

#### renderSpeaking - ATUALIZADO
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

### 3. Dados do Currículo (constants.ts)

Adicionar `translation` e `phonetic` para cada questão de inglês:

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
{
    id: 'e_s1',
    type: QuestionType.SPEAKING,
    difficulty: 'medium',
    title: 'Speaking',
    prompt: 'Say: "I have no blockers"',
    englishWord: 'I have no blockers',
    translation: 'Não tenho impedimentos',
    phonetic: 'Ai rrév nou blá.kers',
    options: [],
    correctFeedback: 'Perfect pronunciation!',
    wrongFeedback: 'Try to emphasize "blockers".'
}
```

## Próximos Passos

1. ✅ Atualizar `types.ts` com campo `translation`
2. ⏳ Atualizar `Lesson.tsx` com os novos componentes
3. ⏳ Adicionar traduções e pronúncias em `constants.ts` para TODAS as questões de inglês

## Exemplo de Pronúncia Fonética Simplificada

- **Hello** → "Re.lou"
- **Standup** → "Stén.dâp"
- **Blocker** → "Blá.ker"
- **Yesterday** → "Iés.ter.dei"
- **Today** → "Tu.déi"
- **LGTM** → "El.dji.ti.em"
- **Can you fix this typo?** → "Kén iu fiks dis tái.pou?"
- **Please update the documentation** → "Pliz âp.deit dâ dó.kiu.men.téi.shon"
