import { Type } from '@sinclair/typebox';

export const RiskEvaluationPluginSchema = Type.Optional(
  Type.Object({
    success: Type.Optional(Type.Boolean()),
    riskScore: Type.Optional(Type.Number()),
    rulesResults: Type.Optional(
      Type.Array(
        Type.Object({
          id: Type.Optional(Type.String()),
          domain: Type.Optional(Type.String()),
          result: Type.Optional(
            Type.Array(
              Type.Object({
                rule: Type.Optional(
                  Type.Object({
                    key: Type.Optional(Type.String()),
                    value: Type.Optional(Type.Any()),
                    operator: Type.Optional(Type.String()),
                  }),
                ),
                status: Type.Optional(Type.String()),
              }),
            ),
          ),
          ruleSet: Type.Optional(
            Type.Object({
              rules: Type.Optional(
                Type.Array(
                  Type.Object({
                    key: Type.Optional(Type.String()),
                    value: Type.Optional(Type.Any()),
                    operator: Type.Optional(Type.String()),
                  }),
                ),
              ),
              operator: Type.Optional(Type.String()),
            }),
          ),
          indicator: Type.Optional(Type.String()),
          maxRiskScore: Type.Optional(Type.Number()),
          minRiskScore: Type.Optional(Type.Number()),
          baseRiskScore: Type.Optional(Type.Number()),
          additionalRiskScore: Type.Optional(Type.Number()),
        }),
      ),
    ),
    riskIndicatorsByDomain: Type.Optional(
      Type.Object({
        'Store Info': Type.Optional(
          Type.Array(
            Type.Object({
              name: Type.Optional(Type.String()),
              domain: Type.Optional(Type.String()),
            }),
          ),
        ),
      }),
    ),
  }),
);
