
export interface ContentItem {
  // Updated to include specific visual model types
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
