import { ClsService } from 'nestjs-cls';

export const mockClsService = () => {
  let topLevelContext = {};

  return {
    provide: ClsService,
    useValue: {
      get: jest.fn().mockReturnValue(topLevelContext),
      set: (context: any) => {
        topLevelContext = context;
      },
    },
  };
};
