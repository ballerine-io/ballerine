import { fetchServiceFromModule } from '@/test/helpers/nest-app-helper';
import { NotionService } from './../notion/notion.service';
import { RiskRuleService } from './risk-rule.service';

// We should inject notion api key in order to run it during CI pipeline
describe.skip('#RiskRuleService', () => {
  let service: RiskRuleService;

  beforeEach(async () => {
    service = (await fetchServiceFromModule(RiskRuleService, [
      NotionService,
    ])) as unknown as RiskRuleService;
  });

  it('should return validated records when source is notion', async () => {
    const result = await service.findAll(
      { databaseId: '<DATABASE_ID>', source: 'notion' },
      {
        shouldThrowOnValidation: true,
      },
    );

    expect(result).toBeInstanceOf(Array);
    result.forEach((record: any) => {
      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('ruleSet');
      expect(record).toHaveProperty('domain');
      expect(record).toHaveProperty('indicator');
      expect(record).toHaveProperty('baseRiskScore');
      expect(record).toHaveProperty('additionalRiskScore');
      expect(record).toHaveProperty('minRiskScore');
      expect(record).toHaveProperty('maxRiskScore');
    });
  });

  it('should throw an error if the source is unsupported', async () => {
    // @ts-ignore - testing purposes non supported source
    await expect(service.findAll({ databaseId: 'blabla', source: 'unsupported' })).rejects.toThrow(
      'Unsupported source',
    );
  });
});
