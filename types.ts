
export interface ContentItem {
  type: 'paragraph' | 'heading' | 'list' | 'image' | 'custom' | 'cover' | 'bismillah' | 'author' | 'toc' | 'saudi-map-model' |
        'model-diagram' | 'visual-intention' | 'visual-personal' | 'visual-passion' | 'visual-skills' | 'visual-market' | 'visual-product' | 'visual-money';
  text?: string;
  level?: 1 | 2 | 3 | 4;
  items?: string[];
  src?: string;
  alt?: string;
  className?: string;
  content?: ContentItem[];
}

export interface Page {
  pageNumber: number;
  sectionId: string;
  content: ContentItem[];
}

export interface Author {
    name: string;
    title: string;
    bioPoints: string[];
}

export interface SectionTocItem {
  id: string;
  title:string;
  startPage: number;
  pageLabel: string;
}

// --- NEW LMS TYPES ---

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, this is hashed. Here stored in localstorage.
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  completedModules: string[]; // Array of sectionIds that are finished
  quizScores: Record<string, number>; // sectionId -> score
  currentModuleId: string;
  currentUnitIndex: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  pages: Page[]; // The content pages belonging to this module
  isLocked: boolean;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  quiz?: QuizQuestion[];
}
