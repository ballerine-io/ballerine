import { RuleSet } from '@ballerine/common';
import { Test, TestingModule } from '@nestjs/testing';
import { helpers } from './core/test/data-helper';
import { RuleEngineService } from './rule-engine.service';

describe('RuleEngineService', () => {
  let service: RuleEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleEngineService],
    }).compile();

    service = module.get<RuleEngineService>(RuleEngineService);
  });

  it('should run the IN_CASE_INSENSITIVE rule successfully', async () => {
    const rules: RuleSet = {
      operator: 'and',
      rules: [
        {
          key: 'single',
          operator: 'IN_CASE_INSENSITIVE',
          value: ['sole'],
          isPathComparison: false,
        },
        {
          key: 'array',
          operator: 'IN_CASE_INSENSITIVE',
          value: ['ownership'],
          isPathComparison: false,
        },
      ],
    };

    const formData = {
      single: 'A Sole Ownership',
      array: ['THIS IS AN OWNERSHIP COMPANY'],
    };

    const result = await service.run(rules, formData, helpers);

    result.forEach(r => {
      expect(r.status).toEqual('PASSED');
    });
  });
});
