import { Test, TestingModule } from '@nestjs/testing';
import { BusinessReportController } from './business-report.controller';

describe('BusinessReportController', () => {
  let controller: BusinessReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessReportController],
    }).compile();

    controller = module.get<BusinessReportController>(BusinessReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
