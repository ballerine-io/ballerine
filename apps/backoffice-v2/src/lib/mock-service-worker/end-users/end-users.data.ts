import { generateEndUsers } from './utils/generate-end-users/generate-end-users';
import { TEndUser } from '../../../api/types';

export const endUsers = {
  __data: generateEndUsers(20),
  findAll() {
    return this.__data;
  },
  findById(id: string) {
    return this.findAll().find(endUser => endUser.id === id);
  },
  updateById(id: string, data: Partial<TEndUser>) {
    this.__data = this.findAll().map(endUser => {
      if (endUser.id !== id) return endUser;

      return {
        ...endUser,
        ...data,
      };
    });
  },
};
