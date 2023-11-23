import { Cell } from '@/components/organisms/UIRenderer/elements/Cell';
import { Task } from '@/components/organisms/UIRenderer/elements/Task';
import { Title } from '@/components/organisms/UIRenderer/elements/Title';
import { ElementsMap } from '@/components/organisms/UIRenderer/types/elements.types';

export const baseElements: ElementsMap = {
  task: Task,
  cell: Cell,
  title: Title,
};
