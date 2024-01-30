import { Test, TestingModule } from '@nestjs/testing';
import { AlertManagerController } from './alert-manager.controller';

describe('AlertManagerController', () => {
  let controller: AlertManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertManagerController],
    }).compile();

    controller = module.get<AlertManagerController>(AlertManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
