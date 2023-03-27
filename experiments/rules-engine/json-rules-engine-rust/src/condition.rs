use crate::{status::Status, Constraint};
#[cfg(feature = "eval")]
use rhai::{serde::to_dynamic, Engine, Scope};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Condition {
    And {
        and: Vec<Condition>,
    },
    Or {
        or: Vec<Condition>,
    },
    Not {
        not: Box<Condition>,
    },
    AtLeast {
        should_minimum_meet: usize,
        conditions: Vec<Condition>,
    },
    Condition {
        field: String,
        #[serde(flatten)]
        constraint: Constraint,
        path: Option<String>,
    },
    #[cfg(feature = "eval")]
    Eval {
        expr: String,
    },
}

impl Condition {
    /// Starting at this node, recursively check (depth-first) any child nodes and
    /// aggregate the results
    pub fn check_value(
        &self,
        info: &Value,
        #[cfg(feature = "eval")] rhai_engine: &Engine,
    ) -> ConditionResult {
        match *self {
            Condition::And { ref and } => {
                let mut status = Status::Met;
                let children = and
                    .iter()
                    .map(|c| {
                        c.check_value(
                            info,
                            #[cfg(feature = "eval")]
                            rhai_engine,
                        )
                    })
                    .inspect(|r| status = status & r.status)
                    .collect::<Vec<_>>();

                ConditionResult {
                    name: "And".into(),
                    status,
                    children,
                }
            }
            Condition::Not { not: ref c } => {
                let res = c.check_value(
                    info,
                    #[cfg(feature = "eval")]
                    rhai_engine,
                );

                ConditionResult {
                    name: "Not".into(),
                    status: !res.status,
                    children: res.children,
                }
            }
            Condition::Or { ref or } => {
                let mut status = Status::NotMet;
                let children = or
                    .iter()
                    .map(|c| {
                        c.check_value(
                            info,
                            #[cfg(feature = "eval")]
                            rhai_engine,
                        )
                    })
                    .inspect(|r| status = status | r.status)
                    .collect::<Vec<_>>();

                ConditionResult {
                    name: "Or".into(),
                    status,
                    children,
                }
            }
            Condition::AtLeast {
                should_minimum_meet,
                ref conditions,
            } => {
                let mut met_count = 0;
                let children = conditions
                    .iter()
                    .map(|c| {
                        c.check_value(
                            info,
                            #[cfg(feature = "eval")]
                            rhai_engine,
                        )
                    })
                    .inspect(|r| {
                        if r.status == Status::Met {
                            met_count += 1;
                        }
                    })
                    .collect::<Vec<_>>();

                let status = if met_count >= should_minimum_meet {
                    Status::Met
                } else {
                    Status::NotMet
                };

                ConditionResult {
                    name: format!(
                        "At least meet {} of {}",
                        should_minimum_meet,
                        conditions.len()
                    ),
                    status,
                    children,
                }
            }
            #[allow(unused_variables)]
            Condition::Condition {
                ref field,
                ref constraint,
                ref path,
            } => {
                let node_path = if field.starts_with('/') {
                    field.to_owned()
                } else {
                    format!("/{}", field)
                };

                let mut status = Status::Unknown;

                #[allow(unused_mut)]
                if let Some(mut node) = info.pointer(&node_path).cloned() {
                    #[cfg(feature = "path")]
                    {
                        if let Some(p) = path {
                            let x = jsonpath_lib::select(&node, p)
                                .unwrap()
                                .into_iter()
                                .cloned()
                                .collect();
                            node = Value::Array(x);
                        }
                    }

                    status = constraint.check_value(&node);
                }

                ConditionResult {
                    name: field.to_owned(),
                    status,
                    children: Vec::new(),
                }
            }
            #[cfg(feature = "eval")]
            Condition::Eval { ref expr } => {
                let mut scope = Scope::new();
                if let Ok(val) = to_dynamic(info) {
                    scope.push_dynamic("facts", val);
                }
                let status = if rhai_engine
                    .eval_with_scope::<bool>(&mut scope, expr)
                    .unwrap_or(false)
                {
                    Status::Met
                } else {
                    Status::NotMet
                };

                ConditionResult {
                    name: "Eval".to_owned(),
                    status,
                    children: Vec::new(),
                }
            }
        }
    }
}

/// Result of checking a rules tree.
#[derive(Debug, Serialize, Deserialize)]
pub struct ConditionResult {
    /// Human-friendly description of the rule
    pub name: String,
    /// top-level status of this result
    pub status: Status,
    /// Results of any sub-rules
    pub children: Vec<ConditionResult>,
}

/// Creates a `Rule` where all child `Rule`s must be `Met`
///
/// * If any are `NotMet`, the result will be `NotMet`
/// * If the results contain only `Met` and `Unknown`, the result will be `Unknown`
/// * Only results in `Met` if all children are `Met`
pub fn and(and: Vec<Condition>) -> Condition {
    Condition::And { and }
}

/// Creates a `Rule` where any child `Rule` must be `Met`
///
/// * If any are `Met`, the result will be `Met`
/// * If the results contain only `NotMet` and `Unknown`, the result will be `Unknown`
/// * Only results in `NotMet` if all children are `NotMet`
pub fn or(or: Vec<Condition>) -> Condition {
    Condition::Or { or }
}

/// Creates a `Rule` where `n` child `Rule`s must be `Met`
///
/// * If `>= n` are `Met`, the result will be `Met`, otherwise it'll be `NotMet`
pub fn at_least(
    should_minimum_meet: usize,
    conditions: Vec<Condition>,
) -> Condition {
    Condition::AtLeast {
        should_minimum_meet,
        conditions,
    }
}

/// Creates a rule for string comparison
pub fn string_equals(field: &str, val: &str) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringEquals(val.into()),
        path: None,
    }
}

pub fn string_not_equals(field: &str, val: &str) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringNotEquals(val.into()),
        path: None,
    }
}

pub fn string_contains(field: &str, val: &str) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringContains(val.into()),
        path: None,
    }
}

pub fn string_contains_all(field: &str, val: Vec<&str>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringContainsAll(
            val.into_iter().map(ToOwned::to_owned).collect(),
        ),
        path: None,
    }
}

pub fn string_contains_any(field: &str, val: Vec<&str>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringContainsAny(
            val.into_iter().map(ToOwned::to_owned).collect(),
        ),
        path: None,
    }
}

pub fn string_does_not_contain(field: &str, val: &str) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringDoesNotContain(val.into()),
        path: None,
    }
}

pub fn string_does_not_contain_any(field: &str, val: Vec<&str>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringDoesNotContainAny(
            val.into_iter().map(ToOwned::to_owned).collect(),
        ),
        path: None,
    }
}

pub fn string_in(field: &str, val: Vec<&str>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringIn(
            val.into_iter().map(ToOwned::to_owned).collect(),
        ),
        path: None,
    }
}

pub fn string_not_in(field: &str, val: Vec<&str>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::StringNotIn(
            val.into_iter().map(ToOwned::to_owned).collect(),
        ),
        path: None,
    }
}

/// Creates a rule for int comparison.
pub fn int_equals(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntEquals(val),
        path: None,
    }
}

pub fn int_not_equals(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntNotEquals(val),
        path: None,
    }
}

pub fn int_contains(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntContains(val),
        path: None,
    }
}

pub fn int_contains_all(field: &str, val: Vec<i64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntContainsAll(val),
        path: None,
    }
}

pub fn int_contains_any(field: &str, val: Vec<i64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntContainsAny(val),
        path: None,
    }
}

pub fn int_does_not_contain(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntDoesNotContain(val),
        path: None,
    }
}

pub fn int_does_not_contain_any(field: &str, val: Vec<i64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntDoesNotContainAny(val),
        path: None,
    }
}

pub fn int_in(field: &str, val: Vec<i64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntIn(val),
        path: None,
    }
}

pub fn int_not_in(field: &str, val: Vec<i64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntNotIn(val),
        path: None,
    }
}

pub fn int_in_range(field: &str, start: i64, end: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntInRange(start, end),
        path: None,
    }
}

pub fn int_not_in_range(field: &str, start: i64, end: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntNotInRange(start, end),
        path: None,
    }
}

pub fn int_less_than(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntLessThan(val),
        path: None,
    }
}

pub fn int_less_than_inclusive(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntLessThanInclusive(val),
        path: None,
    }
}

pub fn int_greater_than(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntGreaterThan(val),
        path: None,
    }
}

pub fn int_greater_than_inclusive(field: &str, val: i64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::IntGreaterThanInclusive(val),
        path: None,
    }
}

/// Creates a rule for float comparison.
pub fn float_equals(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatEquals(val),
        path: None,
    }
}

pub fn float_not_equals(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatNotEquals(val),
        path: None,
    }
}

pub fn float_contains(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatContains(val),
        path: None,
    }
}

pub fn float_does_not_contain(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatDoesNotContain(val),
        path: None,
    }
}

pub fn float_in(field: &str, val: Vec<f64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatIn(val),
        path: None,
    }
}

pub fn float_not_in(field: &str, val: Vec<f64>) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatNotIn(val),
        path: None,
    }
}

pub fn float_in_range(field: &str, start: f64, end: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatInRange(start, end),
        path: None,
    }
}

pub fn float_not_in_range(field: &str, start: f64, end: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatNotInRange(start, end),
        path: None,
    }
}

pub fn float_less_than(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatLessThan(val),
        path: None,
    }
}

pub fn float_less_than_inclusive(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatLessThanInclusive(val),
        path: None,
    }
}

pub fn float_greater_than(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatGreaterThan(val),
        path: None,
    }
}

pub fn float_greater_than_inclusive(field: &str, val: f64) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::FloatGreaterThanInclusive(val),
        path: None,
    }
}

/// Creates a rule for boolean comparison.
pub fn bool_equals(field: &str, val: bool) -> Condition {
    Condition::Condition {
        field: field.into(),
        constraint: Constraint::BoolEquals(val),
        path: None,
    }
}

#[cfg(not(feature = "eval"))]
#[cfg(test)]
mod tests {
    use super::{
        and, at_least, bool_equals, int_equals, int_in_range, or, string_equals,
    };
    use crate::status::Status;
    use serde_json::{json, Value};

    fn get_test_data() -> Value {
        json!({
            "foo": 1,
            "bar": "bar",
            "baz": true
        })
    }

    #[test]
    fn and_rules() {
        let map = get_test_data();
        // Met & Met == Met
        let mut root =
            and(vec![int_equals("foo", 1), string_equals("bar", "bar")]);
        let mut res = root.check_value(&map);

        assert_eq!(res.status, Status::Met);

        // Met & NotMet == NotMet
        root = and(vec![int_equals("foo", 2), string_equals("bar", "bar")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::NotMet);

        // Met & Unknown == Unknown
        root = and(vec![int_equals("quux", 2), string_equals("bar", "bar")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::Unknown);

        // NotMet & Unknown == NotMet
        root = and(vec![int_equals("quux", 2), string_equals("bar", "baz")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::NotMet);

        // Unknown & Unknown == Unknown
        root = and(vec![int_equals("quux", 2), string_equals("fizz", "bar")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::Unknown);
    }

    #[test]
    fn or_rules() {
        let map = get_test_data();
        // Met | Met == Met
        let mut root =
            or(vec![int_equals("foo", 1), string_equals("bar", "bar")]);
        let mut res = root.check_value(&map);

        assert_eq!(res.status, Status::Met);

        // Met | NotMet == Met
        root = or(vec![int_equals("foo", 2), string_equals("bar", "bar")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::Met);

        // Met | Unknown == Met
        root = or(vec![int_equals("quux", 2), string_equals("bar", "bar")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::Met);

        // NotMet | Unknown == Unknown
        root = or(vec![int_equals("quux", 2), string_equals("bar", "baz")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::Unknown);

        // Unknown | Unknown == Unknown
        root = or(vec![int_equals("quux", 2), string_equals("fizz", "bar")]);
        res = root.check_value(&map);

        assert_eq!(res.status, Status::Unknown);
    }

    #[test]
    fn n_of_rules() {
        let map = get_test_data();
        // 2 Met, 1 NotMet == Met
        let mut root = at_least(
            2,
            vec![
                int_equals("foo", 1),
                string_equals("bar", "bar"),
                bool_equals("baz", false),
            ],
        );
        let mut res = root.check_value(&map);

        assert_eq!(res.status, Status::Met);

        // 1 Met, 1 NotMet, 1 Unknown == NotMet
        root = at_least(
            2,
            vec![
                int_equals("foo", 1),
                string_equals("quux", "bar"),
                bool_equals("baz", false),
            ],
        );
        res = root.check_value(&map);

        assert_eq!(res.status, Status::NotMet);

        // 2 NotMet, 1 Unknown == Unknown
        root = at_least(
            2,
            vec![
                int_equals("foo", 2),
                string_equals("quux", "baz"),
                bool_equals("baz", false),
            ],
        );
        res = root.check_value(&map);

        assert_eq!(res.status, Status::NotMet);
    }

    #[test]
    fn string_equals_rule() {
        let map = get_test_data();
        let mut rule = string_equals("bar", "bar");
        let mut res = rule.check_value(&map);
        assert_eq!(res.status, Status::Met);

        rule = string_equals("bar", "baz");
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);
    }

    #[test]
    fn int_equals_rule() {
        let map = get_test_data();
        let mut rule = int_equals("foo", 1);
        let mut res = rule.check_value(&map);
        assert_eq!(res.status, Status::Met);

        rule = int_equals("foo", 2);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);

        // Values not convertible to int should be NotMet
        rule = int_equals("bar", 2);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);
    }

    #[test]
    fn int_range_rule() {
        let map = get_test_data();
        let mut rule = int_in_range("foo", 1, 3);
        let mut res = rule.check_value(&map);
        assert_eq!(res.status, Status::Met);

        rule = int_in_range("foo", 2, 3);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);

        // Values not convertible to int should be NotMet
        rule = int_in_range("bar", 1, 3);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);
    }

    #[test]
    fn boolean_rule() {
        let mut map = get_test_data();
        let mut rule = bool_equals("baz", true);
        let mut res = rule.check_value(&map);
        assert_eq!(res.status, Status::Met);

        rule = bool_equals("baz", false);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);

        rule = bool_equals("bar", true);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);

        rule = bool_equals("bar", false);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);

        map["quux".to_owned()] = json!("tRuE");
        rule = bool_equals("quux", true);
        res = rule.check_value(&map);
        assert_eq!(res.status, Status::NotMet);
    }
}
