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
      },
      { key: 'country', type: ConditionType.EQUALS, value: 'USA' },
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
  {
    id: 'create-at-last-year',
    conditions: [{ key: 'createdAt', type: ConditionType.LAST_YEAR, value: { years: 2 } }],
  },
];

const ruleStoreService = {
  findAll: (): any | null => {
    return rules;
  },
};

describe('Engine', () => {
  let service: RuleEngineService;
  let dateNowSpy: jest.SpyInstance;

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

    // Lock Time
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1719092230209);
  });

  afterAll(() => {
    // Unlock Time
    dateNowSpy.mockRestore();
  });

  describe('Rule Engine', () => {
    it('should run rules', async () => {
      const lastThreeYears = new Date(Date.now());
      lastThreeYears.setFullYear(lastThreeYears.getFullYear() - 3);

      const formData = {
        age: 21,
        country: 'USA',
        createdAt: lastThreeYears,
      };

      const output = await service.run({} as RuleStoreServiceFindAllOptions, formData);

      expect(output).toMatchObject([
        {
          id: 'rule1',
          passed: true,
          ruleResults: {
            age: {
              key: 'age',
              passed: true,
              value: 21,
            },
            country: {
              key: 'country',
              passed: true,
              value: 'USA',
            },
          },
        },
        {
          id: 'rule2',
          passed: false,
          ruleResults: {
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
        },
        {
          id: 'rule3',
          passed: true,
          ruleResults: {
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
        },
        {
          id: 'create-at-last-year',
          passed: false,
          ruleResults: {
            createdAt: {
              key: 'createdAt',
              passed: false,
              value: new Date('2021-06-22T21:37:10.209Z'),
            },
          },
        },
      ]);
    });
    it('Should pass last two years rule ', async () => {
      const lastOneYear = new Date(Date.now());
      lastOneYear.setFullYear(lastOneYear.getFullYear() - 1);

      const formData = {
        age: 21,
        country: 'USA',
        createdAt: lastOneYear,
      };

      const output = await service.run({} as RuleStoreServiceFindAllOptions, formData);

      expect(output).toMatchObject([
        {
          id: 'rule1',
          passed: true,
          ruleResults: {
            age: {
              key: 'age',
              passed: true,
              value: 21,
            },
            country: {
              key: 'country',
              passed: true,
              value: 'USA',
            },
          },
        },
        {
          id: 'rule2',
          passed: false,
          ruleResults: {
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
        },
        {
          id: 'rule3',
          passed: true,
          ruleResults: {
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
        },
        {
          id: 'create-at-last-year',
          passed: true,
          ruleResults: {
            createdAt: {
              key: 'createdAt',
              passed: true,
              value: new Date('2023-06-22T21:37:10.209Z'),
            },
          },
        },
      ]);
    });
  });
});
