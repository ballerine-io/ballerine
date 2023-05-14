import { Test, TestingModule } from '@nestjs/testing';
import { CaseFileService } from './case-file.service';

describe('CaseFileService', () => {
  let service: CaseFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseFileService],
    }).compile();

    service = module.get<CaseFileService>(CaseFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
