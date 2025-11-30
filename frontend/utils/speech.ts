// Utility function to get the best Portuguese (pt-BR) voice
export const getPtBrVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    // Try to find pt-BR voice first
    const ptBrVoice = voices.find(voice =>
        voice.lang === 'pt-BR' || voice.lang.startsWith('pt-BR')
    );

    if (ptBrVoice) return ptBrVoice;

    // Fallback to any Portuguese voice
    const ptVoice = voices.find(voice => voice.lang.startsWith('pt'));

    return ptVoice || null;
};

// Utility function to speak text in Portuguese with explicit voice selection
export const speakInPortuguese = (text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Load voices if not loaded yet
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
            const voice = getPtBrVoice();
            if (voice) {
                utterance.voice = voice;
            }
            utterance.lang = 'pt-BR';
            utterance.rate = 0.8;
            if (onEnd) {
                utterance.onend = onEnd;
            }
            window.speechSynthesis.speak(utterance);
        }, { once: true });
    } else {
        const voice = getPtBrVoice();
        if (voice) {
            utterance.voice = voice;
        }
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        if (onEnd) {
            utterance.onend = onEnd;
        }
        window.speechSynthesis.speak(utterance);
    }
};
