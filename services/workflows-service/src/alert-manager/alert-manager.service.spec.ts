import { Test, TestingModule } from '@nestjs/testing';
import { AlertManagerService } from './AlertManagerService';

describe('AlertManagerService', () => {
  let service: AlertManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertManagerService],
    }).compile();

    service = module.get<AlertManagerService>(AlertManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
