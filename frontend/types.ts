

export enum ScreenState {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  MODULE_SELECTION = 'MODULE_SELECTION',
  FRAMEWORK_CHOICE = 'FRAMEWORK_CHOICE', // Premium: Choose React or Node.js
  HOME = 'HOME', // The Path Map
  LESSON = 'LESSON',
  RESULT = 'RESULT',
  PROFILE = 'PROFILE',
  REVIEW = 'REVIEW',
  SHOP = 'SHOP',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  CODE_DEBUG = 'CODE_DEBUG' // New: Code Debugging Challenges
}

export enum ModuleType {
  ENGLISH = 'ENGLISH',
  LOGIC = 'LOGIC',
  COMBO = 'COMBO',
  REACT = 'REACT', // Premium framework
  NODEJS = 'NODEJS' // Premium framework
}


export enum QuestionType {
  THEORY = 'THEORY',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CODE_BUILDER = 'CODE_BUILDER',
  TRANSLATION = 'TRANSLATION',
  PAIR_MATCH = 'PAIR_MATCH',
  DRAG_AND_DROP = 'DRAG_AND_DROP',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING'
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TheoryContent {
  concept: string; // e.g., "Variáveis"
  title: string; // e.g., "O que são variáveis?"
  explanation: string; // Explicação informal e didática
  examples?: string[]; // Exemplos de código
  tips?: string[]; // Dicas práticas
}

export interface PairItem {
  id: string;
  text: string;
  pairId: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  prompt: string;

  theory?: TheoryContent; // Teoria interativa antes da questão
  phonetic?: string;
  englishWord?: string;

  codeSnippet?: string;
  options: Option[];
  pairs?: PairItem[];

  segments?: string[];
  distractors?: string[];
  correctAnswer?: string;

  correctFeedback: string;
  wrongFeedback: string;
}

export interface ReviewConcept {
  term: string;
  definition: string;
  type: 'Lógica' | 'Inglês' | 'Sintaxe';
  example?: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  color: 'brand' | 'info' | 'secondary' | 'warn';
  icon: 'star' | 'book' | 'code' | 'trophy' | 'zap';
  totalQuestions: number;
  questions: Question[];
  stars: number;
  learnableConcepts: ReviewConcept[]; // New field for dynamic Review screen
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  levels: Level[];
}

// --- GAMIFICATION TYPES ---

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats, lastResult?: LessonResult) => boolean;
}

export interface Quest {
  id: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  type: 'lesson' | 'xp' | 'perfect' | 'streak';
}

export interface UserSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface UserStats {
  hearts: number;
  totalXP: number;
  level: number;
  streakDays: number;
  gems: number;
  completedLevels: number[];
  unlockedAchievements: string[];
  lessonsCompleted: number;
  perfectLessons: number;
  isPremium: boolean;
  lastHeartLostTime: number | null; // Timestamp for regeneration
  hasSeenOnboarding: boolean;
  selectedModule: ModuleType | null;
  activeQuests: Quest[];
  lastQuestGenDate: string | null; // YYYY-MM-DD
  username: string; // User display name
  hasAcceptedTerms: boolean; // Terms of use acceptance
  conceptMastery: Record<string, number>; // "Array": 80, "Boolean": 20
  settings: UserSettings;
  skipTokens: number; // Número de pulos de questão disponíveis
}

export interface LessonResult {
  baseXP: number;
  comboBonus: number;
  perfectBonus: number;
  totalXP: number;
  correctCount: number;
  mistakeCount: number;
  maxCombo: number;
  newAchievements: Achievement[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number; // If type is currency_pack, cost is in real money (simulated), else in gems
  icon: any;
  type: 'consumable' | 'subscription' | 'currency_pack';
  gemAmount?: number; // For currency packs
}

export interface PaymentMethod {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
}

// ==================== CODE DEBUG TYPES ====================

export enum DebugDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface CodeFile {
  id: string;
  name: string; // e.g., "app.js", "styles.css", "index.html"
  language: string; // e.g., "javascript", "css", "html"
  initialCode: string; // Code with bugs
  correctCode: string; // Solution without bugs
  isEditable: boolean; // Some files may be read-only
}

export interface DebugChallenge {
  id: string;
  title: string;
  description: string; // What the code should do
  difficulty: DebugDifficulty;
  files: CodeFile[]; // Single file for beginners, multiple for advanced
  bugCount: number; // How many bugs to find
  hints: string[]; // Optional hints
  xpReward: number;
  timeEstimate?: string; // e.g., "5 min"
  tags: string[]; // e.g., ["variáveis", "loops", "syntax"]
}
