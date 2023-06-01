import { generateIndividuals } from './utils/generate-individuals/generate-individuals';

import { TIndividual } from '../types';

export const individuals = {
  __data: generateIndividuals(20),
  findAll() {
    return this.__data;
  },
  findById(id: string) {
    return this.findAll().find(individual => individual.id === id);
  },
  updateById(id: string, data: Partial<TIndividual>) {
    this.__data = this.findAll().map(individual => {
      if (individual.id !== id) return individual;

      return {
        ...individual,
        ...data,
      };
    });
  },
};
