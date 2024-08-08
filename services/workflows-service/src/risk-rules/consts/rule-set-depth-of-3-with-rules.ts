import {Prisma} from "@prisma/client";

export const RULESET_DEPTH_OF_3_WITH_RULES = {
  rulesetRules: {
    include: {
      rule: true
    }
  },
  childRuleSets: {
    include: {
      child: {
        include: {
          rulesetRules: {
            include: {
              rule: true
            }
          },
          childRuleSets: {
            include: {
              child: {
                include: {
                  rulesetRules: {
                    include: {
                      rule: true
                    }
                  },
                  childRuleSets: {
                    include: {
                      child: {
                        include: {
                          rulesetRules: {
                            include: {
                              rule: true
                            }
                          },
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
} satisfies Prisma.RuleSetInclude
