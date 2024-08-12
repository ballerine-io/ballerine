import { Prisma } from '@prisma/client';

export const RULESET_PARENT_DEPTH_3_WITH_POLICIES = {
  riskRuleRuleSets: {
    include: {
      riskRule: {
        include: {
          riskRulePolicy: true,
        },
      },
    },
  },
  parentRuleSets: {
    include: {
      parent: {
        include: {
          riskRuleRuleSets: {
            include: {
              riskRule: {
                include: {
                  riskRulePolicy: true,
                },
              },
            },
          },
          parentRuleSets: {
            include: {
              parent: {
                include: {
                  riskRuleRuleSets: {
                    include: {
                      riskRule: {
                        include: {
                          riskRulePolicy: true,
                        },
                      },
                    },
                  },
                  parentRuleSets: {
                    include: {
                      parent: {
                        include: {
                          riskRuleRuleSets: {
                            include: {
                              riskRule: {
                                include: {
                                  riskRulePolicy: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.RuleSetInclude;
