import { EndUserAmlHitsSchema } from '@/schemas';
import { TWorkflowHelpers } from '@/types';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import { z } from 'zod';
import { ValidationFailedError } from '../errors';
import { Rule } from '../types';
import { OperationHelpers } from './constants';
import { BaseOperator } from './helpers';
import { AmlCheckV2Params } from './types';

class AmlCheckV2 extends BaseOperator<any, AmlCheckV2Params> {
  constructor() {
    super({
      operator: 'AML_CHECK_V2',
    });
  }

  async extractValue(data: unknown, rule: Rule, { helpers }: { helpers: TWorkflowHelpers }) {
    const result = z.record(z.string(), z.any()).safeParse(data);

    if (!result.success) {
      throw new ValidationFailedError('extract', 'parsing failed', result.error);
    }

    const context = result.data;

    const ubosIds =
      context?.entity?.data?.additionalInfo?.ubos?.map(
        (ubo: { ballerineEntityId: string }) => ubo.ballerineEntityId,
      ) ?? [];

    const directorsIds =
      context?.entity?.data?.additionalInfo?.directors?.map(
        (director: { ballerineEntityId: string }) => director.ballerineEntityId,
      ) ?? [];

    const mainRepresentativeEndUserId =
      context?.entity?.data?.additionalInfo?.mainRepresentative?.ballerineEntityId;

    const endUserIds = [...ubosIds, ...directorsIds, mainRepresentativeEndUserId];

    if (isEmpty(endUserIds)) {
      return false;
    }

    const endUsers = await Promise.all(
      endUserIds.filter(Boolean).map(endUserId => helpers.getEndUserById(endUserId)),
    );

    if (isEmpty(endUsers)) {
      throw new ValidationFailedError('extract', `End Users not found: ${endUserIds.join(', ')}`);
    }

    // TODO: In the future, AML data will not be in the endUser object
    const hits: Array<z.infer<typeof EndUserAmlHitsSchema>> = endUsers
      .map(endUser => endUser.amlHits)
      .flat(1)
      .filter(Boolean);

    if (!Array.isArray(hits) || hits.length === 0) {
      return false;
    }

    const variable = hits.map(hit => get(hit, rule.key as string)).filter(Boolean);

    return variable;
  }

  evaluate = async (dataValue: any, conditionValue: AmlCheckV2Params) => {
    const amlOperator = OperationHelpers[conditionValue.operator];

    const evaluateOperatorCheck = async (data: any) => {
      const result = amlOperator.dataValueSchema?.safeParse(data);

      if (result && !result.success) {
        return false;
      }

      const conditionResult = amlOperator.conditionValueSchema?.safeParse(conditionValue.value);

      if ((conditionResult && !conditionResult.success) || !conditionResult?.data) {
        return false;
      }

      return await amlOperator.execute(data, conditionResult.data);
    };

    if (dataValue && Array.isArray(dataValue)) {
      return dataValue.some(evaluateOperatorCheck);
    } else {
      return evaluateOperatorCheck(dataValue);
    }
  };
}

export const AML_CHECK_V2 = new AmlCheckV2();
