import { Cell } from '@app/components/organisms/UIRenderer/elements/Cell';
import { Task } from '@app/components/organisms/UIRenderer/elements/Task';
import { Title } from '@app/components/organisms/UIRenderer/elements/Title';
import { ElementsMap } from '@app/components/organisms/UIRenderer/types/elements.types';

export const baseElements: ElementsMap = {
  task: Task,
  cell: Cell,
  title: Title,
};
