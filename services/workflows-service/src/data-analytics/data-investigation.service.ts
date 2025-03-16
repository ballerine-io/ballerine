import { ALERT_DEFINITIONS } from './../../scripts/alerts/generate-alerts';
import { SubjectRecord, TExecutionDetails } from '@/alert/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Injectable } from '@nestjs/common';
import { Alert, PaymentMethod, Prisma, TransactionRecordType } from '@prisma/client';
import { TIME_UNITS } from './consts';
import {
  DailySingleTransactionAmountType,
  HighTransactionTypePercentage,
  HighVelocityHistoricAverageOptions,
  InlineRule,
  TCustomersTransactionTypeOptions,
  TDormantAccountOptions,
  TMerchantGroupAverage,
  TMultipleMerchantsOneCounterparty,
  TPeerGroupTransactionAverageOptions,
  TransactionsAgainstDynamicRulesType,
} from './types';
import type { AlertService } from '@/alert/alert.service';
import { isEmpty } from 'lodash';

@Injectable()
export class DataInvestigationService {
  constructor(protected readonly logger: AppLoggerService) {}

  getInvestigationFilter(projectId: string, inlineRule: InlineRule, subject?: SubjectRecord) {
    let investigationFilter;

    switch (inlineRule.fnInvestigationName) {
      case 'investigateTransactionsAgainstDynamicRules':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateHighTransactionTypePercentage':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateDormantAccount':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateCustomersTransactionType':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateTransactionAvg':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateMultipleMerchantsOneCounterparty':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateMerchantGroupAverage':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateDailySingleTransactionAmount':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      case 'investigateHighVelocityHistoricAverage':
        investigationFilter = this[inlineRule.fnInvestigationName]({
          ...inlineRule.options,
          projectId,
        });
        break;
      default:
        this.logger.error(`No investigation filter obtained`, {
          inlineRule,
        });

        throw new Error(
          `Investigation filter could not be obtained for rule id: ${
            (inlineRule as InlineRule).id
          }`,
        );
    }

    return {
      // TODO: Backward compatibility, Remove this when all rules are updated, this is a temporary fix
      ...investigationFilter,
      ...this.buildSubjectFilterCompetability(inlineRule, subject),
      ...this._buildTransactionsFiltersByAlert(inlineRule),
      projectId,
    } satisfies Prisma.TransactionRecordWhereInput;
  }

  // TODO: can be removed after all rules are updated, support for subjects in the alert
  buildSubjectFilterCompetabilityByAlert(
    alert: NonNullable<Awaited<ReturnType<AlertService['getAlertWithDefinition']>>>,
  ) {
    const inlineRule =
      ALERT_DEFINITIONS[alert.alertDefinition.ruleId as keyof typeof ALERT_DEFINITIONS]?.inlineRule;

    if (!inlineRule) {
      this.logger.error(`Couldnt find related alert definition by ruleId`, {
        alert,
      });

      return {};
    }

    const subject = (alert.executionDetails as TExecutionDetails).subject;

    return this.buildSubjectFilterCompetability(inlineRule, subject);
  }

  // TODO: can be removed after all rules are updated
  buildSubjectFilterCompetability(inlineRule: InlineRule, subject?: SubjectRecord) {
    return {
      ...(subject?.counterpartyId &&
        (inlineRule.subjects[0] === 'counterpartyOriginatorId' ||
          inlineRule.subjects[0] === 'counterpartyBeneficiaryId') && {
          [inlineRule.subjects[0]]: subject.counterpartyId,
        }),
      ...(subject?.counterpartyOriginatorId && {
        counterpartyOriginatorId: subject.counterpartyOriginatorId,
      }),
      ...(subject?.counterpartyBeneficiaryId && {
        counterpartyBeneficiaryId: subject?.counterpartyBeneficiaryId,
      }),
    };
  }

  investigateTransactionsAgainstDynamicRules(options: TransactionsAgainstDynamicRulesType) {
    const {
      amountBetween,
      direction,
      transactionType,
      paymentMethods,
      excludePaymentMethods = false,
      projectId,
      amountThreshold,
      havingAggregate,
    } = options;

    return {
      projectId,
      ...(amountBetween
        ? {
            transactionBaseAmount: {
              gte: amountBetween?.min,
              lte: amountBetween?.max,
            },
          }
        : {}),
      ...(amountThreshold && isEmpty(havingAggregate)
        ? {
            transactionBaseAmount: {
              gte: amountThreshold,
            },
          }
        : {}),
      ...(direction ? { transactionDirection: direction } : {}),
      ...(!isEmpty(transactionType)
        ? {
            transactionType: {
              in: transactionType as TransactionRecordType[],
            },
          }
        : {}),
      ...(!isEmpty(paymentMethods)
        ? {
            paymentMethod: {
              ...(excludePaymentMethods
                ? { notIn: paymentMethods as PaymentMethod[] }
                : { in: paymentMethods as PaymentMethod[] }),
            },
          }
        : {}),
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateHighTransactionTypePercentage(options: HighTransactionTypePercentage) {
    const { projectId, transactionType } = options;

    return {
      projectId,
      ...(transactionType
        ? {
            transactionType: transactionType,
          }
        : {}),
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateDormantAccount(options: TDormantAccountOptions) {
    const { projectId } = options;

    return {
      projectId,
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateCustomersTransactionType(options: TCustomersTransactionTypeOptions) {
    const { projectId, transactionType, paymentMethods } = options;

    return {
      projectId,
      ...(paymentMethods
        ? {
            paymentMethod: {
              in: paymentMethods as PaymentMethod[],
            },
          }
        : {}),
      ...(!isEmpty(transactionType)
        ? {
            transactionType: {
              in: transactionType as TransactionRecordType[],
            },
          }
        : {}),
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateTransactionAvg(options: TPeerGroupTransactionAverageOptions) {
    const { projectId, transactionDirection, paymentMethod, minimumTransactionAmount } = options;

    return {
      projectId,
      paymentMethod:
        paymentMethod.operator === '='
          ? { equals: paymentMethod.value }
          : { not: paymentMethod.value },
      transactionBaseAmount: {
        gte: minimumTransactionAmount,
      },
      ...(transactionDirection ? { transactionDirection: transactionDirection } : {}),
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateMultipleMerchantsOneCounterparty(options: TMultipleMerchantsOneCounterparty) {
    const { projectId } = options;

    return {
      projectId,
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateMerchantGroupAverage(options: TMerchantGroupAverage) {
    const { projectId, paymentMethod } = options;

    return {
      projectId,
      paymentMethod:
        paymentMethod.operator === '='
          ? { equals: paymentMethod.value }
          : { not: paymentMethod.value },
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateDailySingleTransactionAmount(options: DailySingleTransactionAmountType) {
    const {
      projectId,

      ruleType,
      amountThreshold,

      direction,

      paymentMethods,
      excludePaymentMethods,

      transactionType,
    } = options;

    return {
      projectId,
      ...(direction ? { transactionDirection: direction } : {}),
      ...(!isEmpty(transactionType)
        ? {
            transactionType: {
              in: transactionType as TransactionRecordType[],
            },
          }
        : {}),

      ...(!isEmpty(paymentMethods)
        ? {
            paymentMethod: {
              ...(excludePaymentMethods
                ? { notIn: paymentMethods as PaymentMethod[] }
                : { in: paymentMethods as PaymentMethod[] }),
            },
          }
        : {}),
      ...(ruleType === 'amount' && amountThreshold
        ? {
            transactionBaseAmount: {
              gte: amountThreshold,
            },
          }
        : {}),
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  investigateHighVelocityHistoricAverage(options: HighVelocityHistoricAverageOptions) {
    const {
      projectId,
      transactionDirection,
      paymentMethod,
      activeUserPeriod,
      lastDaysPeriod,
      timeUnit,
    } = options;

    return {
      projectId,
      ...(transactionDirection ? { transactionDirection: transactionDirection } : {}),
      paymentMethod:
        paymentMethod.operator === '='
          ? { equals: paymentMethod.value }
          : { not: paymentMethod.value },
    } as const satisfies Prisma.TransactionRecordWhereInput;
  }

  _buildTransactionsFiltersByAlert(inlineRule: InlineRule, alert?: Alert) {
    const whereClause: Prisma.TransactionRecordWhereInput = {};

    const filters: {
      endDate: Date | undefined;
      startDate: Date | undefined;
    } = {
      endDate: undefined,
      startDate: undefined,
    };

    if (alert) {
      const endDate = alert.dedupedAt || alert.createdAt;
      endDate.setHours(23, 59, 59, 999);
      filters.endDate = endDate;
    }

    // @ts-ignore - TODO: Replace logic with proper implementation for each rule
    // eslint-disable-next-line
    let { timeAmount, timeUnit } = inlineRule.options;

    if (!timeAmount || !timeUnit) {
      if (
        inlineRule.fnName === 'evaluateHighVelocityHistoricAverage' &&
        inlineRule.options.lastDaysPeriod &&
        timeUnit
      ) {
        timeAmount = inlineRule.options.lastDaysPeriod.timeAmount;
      } else {
        return filters;
      }
    }

    let startDate = new Date();

    let subtractValue = 0;

    const baseSubstractByMin = timeAmount * 60 * 1000;

    switch (timeUnit) {
      case TIME_UNITS.minutes:
        subtractValue = baseSubstractByMin;
        break;
      case TIME_UNITS.hours:
        subtractValue = 60 * baseSubstractByMin;
        break;
      case TIME_UNITS.days:
        subtractValue = 24 * 60 * baseSubstractByMin;
        break;
      case TIME_UNITS.months:
        startDate.setMonth(startDate.getMonth() - timeAmount);
        break;
      case TIME_UNITS.years:
        startDate.setFullYear(startDate.getFullYear() - timeAmount);
        break;
    }

    startDate.setHours(0, 0, 0, 0);

    if (subtractValue > 0) {
      startDate = new Date(startDate.getTime() - subtractValue);
    }

    if (filters.endDate) {
      startDate = new Date(Math.min(startDate.getTime(), filters.endDate.getTime()));
    }

    filters.startDate = startDate;

    if (filters.startDate) {
      whereClause.transactionDate = {
        gte: filters.startDate,
      };
    }

    if (filters.endDate) {
      whereClause.transactionDate = {
        ...(typeof whereClause.transactionDate === 'object' ? whereClause.transactionDate : {}),
        lte: filters.endDate,
      };
    }

    return whereClause;
  }
}
