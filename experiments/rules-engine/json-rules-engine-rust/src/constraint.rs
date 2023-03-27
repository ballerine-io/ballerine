use crate::status::Status;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use strum::VariantNames;
use strum_macros::EnumVariantNames;

#[derive(Clone, Debug, Serialize, Deserialize, EnumVariantNames)]
#[serde(rename_all = "snake_case")]
#[strum(serialize_all = "snake_case")]
#[serde(tag = "operator", content = "value")]
pub enum Constraint {
    StringEquals(String),
    StringNotEquals(String),
    StringContains(String),
    StringContainsAll(Vec<String>),
    StringContainsAny(Vec<String>),
    StringDoesNotContain(String),
    StringDoesNotContainAny(Vec<String>),
    StringIn(Vec<String>),
    StringNotIn(Vec<String>),
    IntEquals(i64),
    IntNotEquals(i64),
    IntContains(i64),
    IntContainsAll(Vec<i64>),
    IntContainsAny(Vec<i64>),
    IntDoesNotContain(i64),
    IntDoesNotContainAny(Vec<i64>),
    IntIn(Vec<i64>),
    IntNotIn(Vec<i64>),
    IntInRange(i64, i64),
    IntNotInRange(i64, i64),
    IntLessThan(i64),
    IntLessThanInclusive(i64),
    IntGreaterThan(i64),
    IntGreaterThanInclusive(i64),
    FloatEquals(f64),
    FloatNotEquals(f64),
    FloatContains(f64),
    FloatDoesNotContain(f64),
    FloatIn(Vec<f64>),
    FloatNotIn(Vec<f64>),
    FloatInRange(f64, f64),
    FloatNotInRange(f64, f64),
    FloatLessThan(f64),
    FloatLessThanInclusive(f64),
    FloatGreaterThan(f64),
    FloatGreaterThanInclusive(f64),
    BoolEquals(bool),
}

impl Constraint {
    fn value_as_str_array(v: &Value) -> Option<Vec<&str>> {
        v.as_array()
            .map(|x| x.iter().filter_map(|y| y.as_str()).collect::<Vec<_>>())
    }

    fn value_as_i64_array(v: &Value) -> Option<Vec<i64>> {
        v.as_array()
            .map(|x| x.iter().filter_map(|y| y.as_i64()).collect::<Vec<_>>())
    }

    fn value_as_f64_array(v: &Value) -> Option<Vec<f64>> {
        v.as_array()
            .map(|x| x.iter().filter_map(|y| y.as_f64()).collect::<Vec<_>>())
    }

    pub fn check_value(&self, v: &Value) -> Status {
        match *self {
            Constraint::StringEquals(ref s) => match v.as_str() {
                None => Status::NotMet,
                Some(v) => {
                    if v == s {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::StringNotEquals(ref s) => match v.as_str() {
                None => Status::NotMet,
                Some(v) => {
                    if v != s {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::StringContains(ref s) => {
                match Self::value_as_str_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if v.contains(&s.as_str()) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::StringContainsAll(ref s) => {
                match Self::value_as_str_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if s.iter().all(|y| v.contains(&y.as_str())) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::StringContainsAny(ref s) => {
                match Self::value_as_str_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if s.iter().any(|y| v.contains(&y.as_str())) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::StringDoesNotContain(ref s) => {
                match Self::value_as_str_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if !v.contains(&s.as_str()) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::StringDoesNotContainAny(ref s) => {
                match Self::value_as_str_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if s.iter().all(|y| !v.contains(&y.as_str())) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::StringIn(ref ss) => match v.as_str() {
                None => Status::NotMet,
                Some(v) => {
                    if ss.iter().any(|s| s == v) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::StringNotIn(ref ss) => match v.as_str() {
                None => Status::NotMet,
                Some(v) => {
                    if ss.iter().all(|s| s != v) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntEquals(num) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if v == num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntNotEquals(num) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if v != num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntContains(num) => match Self::value_as_i64_array(v) {
                None => Status::NotMet,
                Some(v) => {
                    if v.contains(&num) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntContainsAll(ref nums) => {
                match Self::value_as_i64_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if nums.iter().all(|num| v.contains(&num)) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::IntContainsAny(ref nums) => {
                match Self::value_as_i64_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if nums.iter().any(|num| v.contains(&num)) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::IntDoesNotContain(num) => {
                match Self::value_as_i64_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if !v.contains(&num) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::IntDoesNotContainAny(ref nums) => {
                match Self::value_as_i64_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if nums.iter().all(|num| !v.contains(&num)) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::IntIn(ref nums) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if nums.iter().any(|&num| num == v) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntNotIn(ref nums) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if nums.iter().all(|&num| num != v) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntInRange(start, end) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if start <= v && v <= end {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntNotInRange(start, end) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if start <= v && v <= end {
                        Status::NotMet
                    } else {
                        Status::Met
                    }
                }
            },
            Constraint::IntLessThan(num) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if v < num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntLessThanInclusive(num) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if v <= num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntGreaterThan(num) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if v > num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::IntGreaterThanInclusive(num) => match v.as_i64() {
                None => Status::NotMet,
                Some(v) => {
                    if v >= num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatEquals(num) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if (v - num).abs() < f64::EPSILON {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatNotEquals(num) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if (v - num).abs() > f64::EPSILON {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatContains(num) => {
                match Self::value_as_f64_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if v.contains(&num) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::FloatDoesNotContain(num) => {
                match Self::value_as_f64_array(v) {
                    None => Status::NotMet,
                    Some(v) => {
                        if !v.contains(&num) {
                            Status::Met
                        } else {
                            Status::NotMet
                        }
                    }
                }
            }
            Constraint::FloatIn(ref nums) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if nums.iter().any(|&num| (v - num).abs() < f64::EPSILON) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatNotIn(ref nums) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if nums.iter().all(|&num| (v - num).abs() > f64::EPSILON) {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatInRange(start, end) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if start <= v && v <= end {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatNotInRange(start, end) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if start <= v && v <= end {
                        Status::NotMet
                    } else {
                        Status::Met
                    }
                }
            },
            Constraint::FloatLessThan(num) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if v < num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatLessThanInclusive(num) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if v <= num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatGreaterThan(num) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if v > num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::FloatGreaterThanInclusive(num) => match v.as_f64() {
                None => Status::NotMet,
                Some(v) => {
                    if v >= num {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
            Constraint::BoolEquals(b) => match v.as_bool() {
                None => Status::NotMet,
                Some(v) => {
                    if v == b {
                        Status::Met
                    } else {
                        Status::NotMet
                    }
                }
            },
        }
    }

    pub fn operators() -> &'static [&'static str] {
        Constraint::VARIANTS
    }
}

#[cfg(test)]
mod tests {
    use super::Constraint;

    #[test]
    fn available_operators() {
        assert_eq!(Constraint::operators().len(), 37);
    }
}
