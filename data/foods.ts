import { Food } from './types';
import { fruits } from './fruits';
import { vegetables } from './vegetables';
import { nuts } from './nuts';
import { staples } from './staples';
import { meats } from './meats';

export const foods: Food[] = [
  ...fruits,
  ...vegetables,
  ...nuts,
  ...staples,
  ...meats
];

export type { Food };

