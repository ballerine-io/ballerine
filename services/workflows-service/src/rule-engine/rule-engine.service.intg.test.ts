import { Test, TestingModule } from '@nestjs/testing';
import { RuleEngineService } from './rule-engine.service';
import { RuleSet } from '@ballerine/common';

describe('RuleEngineService', () => {
  let service: RuleEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleEngineService],
    }).compile();

    service = module.get<RuleEngineService>(RuleEngineService);
  });

  it('should run the IN_CASE_INSENSITIVE rule successfully', () => {
    const rules: RuleSet = {
      operator: 'and',
      rules: [
        {
          key: 'single',
          operator: 'IN_CASE_INSENSITIVE',
          value: ['sole'],
        },
        {
          key: 'array',
          operator: 'IN_CASE_INSENSITIVE',
          value: ['ownership'],
        },
      ],
    };

    const formData = {
      single: 'A Sole Ownership',
      array: ['THIS IS AN OWNERSHIP COMPANY'],
    };

    const result = service.run(rules, formData);

    result.forEach(r => {
      expect(r.status).toEqual('PASSED');
    });
  });
});
