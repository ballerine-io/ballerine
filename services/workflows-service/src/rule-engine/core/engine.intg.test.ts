import { Test, TestingModule } from '@nestjs/testing';
import { RuleStoreService, RuleStoreServiceFindAllOptions } from '../rule-store.service';
import { RuleEngineService } from '../rule-engine.service';
import { RuleEngineModule } from '../rule-engine.module';
import { ConditionOperator, ConditionType } from './condition/enums';
import { RuleSet } from './types';

const rules: RuleSet = [
  {
    id: 'rule1',
    conditions: [
      {
        key: 'age',
        type: ConditionType.GT,
        value: 18,
        conditions: [{ key: 'country', type: ConditionType.EQUALS, value: 'USA' }],
        operator: ConditionOperator.AND,
      },
    ],
    operator: ConditionOperator.AND,
  },
  {
    id: 'rule2',
    conditions: [
      { key: 'age', type: ConditionType.LT, value: 18 },
      { key: 'country', type: ConditionType.EQUALS, value: 'USA' },
    ],
    // Implicit default operator ConditionOperator.AND
  },
  {
    id: 'rule3',
    conditions: [
      { key: 'age', type: ConditionType.GT, value: 65 },
      { key: 'country', type: ConditionType.EQUALS, value: 'USA' },
    ],
    operator: ConditionOperator.OR,
  },
];

const ruleStoreService = {
  findAll: (): any | null => {
    return rules;
  },
};

describe('Engine', () => {
  let service: RuleEngineService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RuleStoreService,
          useValue: ruleStoreService,
        },
        RuleEngineService,
        RuleEngineModule,
      ],
    }).compile();

    service = module.get<RuleEngineService>(RuleEngineService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Rule Engine', () => {
    it('should run', async () => {
      const formData = {
        age: 21,
        country: 'USA',
      };

      const output = await service.run({} as RuleStoreServiceFindAllOptions, formData);

      expect(output).toMatchObject([
        {
          conditionResults: {
            age: {
              conditionResults: {
                country: {
                  key: 'country',
                  passed: true,
                  value: 'USA',
                },
              },
              key: 'age',
              passed: true,
              value: 21,
            },
          },
          id: 'rule1',
          passed: true,
        },
        {
          conditionResults: {
            age: {
              key: 'age',
              passed: false,
              value: 21,
            },
            country: {
              key: 'country',
              passed: true,
              value: 'USA',
            },
          },
          id: 'rule2',
          passed: false,
        },
        {
          conditionResults: {
            age: {
              key: 'age',
              passed: false,
              value: 21,
            },
            country: {
              key: 'country',
              passed: true,
              value: 'USA',
            },
          },
          id: 'rule3',
          passed: true,
        },
      ]);
    });
  });
});
