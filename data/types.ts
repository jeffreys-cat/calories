export interface Food {
  name: {
    en: string;
    ja: string;
    de: string;
    es: string;
    fr: string;
    it: string;
    zh: string;
  };
  category: 'fruit' | 'vegetable' | 'nut' | 'staple' | 'meat';
  calories: number;
  sugar: number;
  gi: number;
}

