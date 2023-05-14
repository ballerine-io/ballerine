import { Test, TestingModule } from '@nestjs/testing';
import { CaseFileController } from './case-file.controller';
import { CaseFileService } from './case-file.service';

describe('CaseFileController', () => {
  let controller: CaseFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaseFileController],
      providers: [CaseFileService],
    }).compile();

    controller = module.get<CaseFileController>(CaseFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
