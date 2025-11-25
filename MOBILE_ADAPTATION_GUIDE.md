# Guia de Adaptação Mobile/Desktop - ProGLES

## ✅ Ja Adaptado
- Home.tsx

## 🔧 Padrão de Responsividade Aplicado

### 1. Container Principal
```tsx
<div 
    className="flex flex-col w-full bg-neutral-200 dark:bg-neutral-900 relative transition-colors duration-300 overflow-hidden"
    style={{ height: '100dvh' }} // Força altura real viewport (mobile fix)
>
```

### 2. Header Fixo com Safe Area
```tsx
<header 
    className="fixed top-0 left-0 right-0 z-50 bg-neutral-200/95 dark:bg-neutral-900/95 backdrop-blur-sm"
    style={{ 
        paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
        height: 'calc(62px + env(safe-area-inset-top))' 
    }}
>
```

### 3. Área de Conteúdo Scrollable
```tsx
<div 
    ref={scrollRef}
    className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12"
    style={{
        marginTop: 'calc(62px + env(safe-area-inset-top))',
        paddingBottom: 'env(safe-area-inset-bottom)'
    }}
>
```

### 4. Grid Responsivo
```tsx
{/* Mobile: 1 coluna, Tablet: 2, Desktop: 3 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 5. Texto Responsivo
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
<p className="text-sm md:text-base lg:text-lg">
```

### 6. Padding/Margin Responsivos
```tsx
<div className="p-4 md:p-6 lg:p-8">
<div className="gap-2 md:gap-4 lg:gap-6">
```

## 🎯 Telas Prioritárias para Adaptar

### Alta Prioridade
1. **Profile.tsx** - Muita informação, precisa de layout adaptativo
2. **Shop.tsx** - Cards de produtos precisam reorganizar
3. **Lesson.tsx** - Perguntas e UI de quiz
4. **Review.tsx** - Flashcards e grid de conceitos

### Média Prioridade
5. **Result.tsx** - Tela de resultados
6. **Achievements.tsx** - Grid de conquistas
7. **CodeDebug.tsx** - Editor de código

### Baixa Prioridade (já são bem simples)
8. **Login.tsx / Register.tsx** - Forms simples
9. **Splash.tsx** - Apenas logo
10. **ModuleSelection.tsx** - Poucos cards
11. **FrameworkChoice.tsx** - 2 opções
12. **PaymentSuccess.tsx** - Mensagem simples

## 📱 Breakpoints Tailwind
- `sm:` - 640px (phone landscape)
- `md:` - 768px (tablet)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (large desktop)
- `2xl:` - 1536px (extra large)

## 🎨 Classes Utilitárias Mobile
```tsx
// Esconder em mobile
className="hidden md:block"

// Mostrar apenas mobile
className="block md:hidden"

// Flex direction adaptativo
className="flex flex-col md:flex-row"

// Largura máxima centralizada
className="max-w-7xl mx-auto"
```

## 🔥 Exemplo Completo - Card Adaptativo
```tsx
<motion.div
    className="
        bg-white dark:bg-gray-800 
        rounded-xl md:rounded-2xl 
        p-4 md:p-6 
        shadow-lg 
        border-2 border-gray-200 dark:border-gray-700
        transition-all duration-300
        hover:scale-105 md:hover:scale-110
    "
>
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        {/* Ícone */}
        <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Icon className="text-purple-600" size={24} />
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold">
                Título
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Descrição
            </p>
        </div>
        
        {/* Botão */}
        <button className="
            w-full md:w-auto 
            mt-2 md:mt-0
            px-6 py-2 
            bg-gradient-to-r from-purple-600 to-indigo-600 
            text-white font-bold rounded-lg
        ">
            Ação
        </button>
    </div>
</motion.div>
```

## ⚡ Performance Mobile
```tsx
// Lazy loading de imagens
<img loading="lazy" />

// Reduzir animações em mobile
const isMobile = window.innerWidth < 768;
<motion.div 
    animate={isMobile ? {} : { scale: 1.1 }}
>

// Debounce de scroll
useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            // Lógica
        }, 150);
    };
}, []);
```

## 🎯 Checklist Por Tela

### Profile.tsx
- [ ] Header com safe area
- [ ] Grid de stats responsivo (2 cols mobile, 4 desktop)
- [ ] Heatmap adaptativo
- [ ] Conquistas em grid responsivo
- [ ] Botões full-width em mobile

### Shop.tsx
- [ ] Grid de produtos (1 col mobile, 2-3 desktop)
- [ ] Cards de pacotes adaptativos
- [ ] Banner premium responsivo
- [ ] Preços e descrições com texto adaptativo

### Lesson.tsx
- [ ] Header de questão fixo
- [ ] Opções de resposta full-width mobile
- [ ] Botão verificar fixo no bottom
- [ ] Feedback modal centralizado

### Review.tsx
- [ ] Grid de conceitos responsivo
- [ ] Flashcard tamanho adaptativo
- [ ] Filtros em linha mobile, sidebar desktop
