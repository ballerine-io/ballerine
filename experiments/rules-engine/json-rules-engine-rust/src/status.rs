use serde::{Deserialize, Serialize};
use std::ops::{BitAnd, BitOr, Not};

/// The status of a rule check
#[derive(Debug, Eq, PartialEq, Copy, Clone, Serialize, Deserialize)]
pub enum Status {
    /// Rule was satisfied
    Met,
    /// Rule was not satisfied
    NotMet,
    /// There was not enough information to evaluate
    Unknown,
}

impl BitAnd for Status {
    type Output = Status;
    fn bitand(self, rhs: Status) -> Status {
        match (self, rhs) {
            (Status::Met, Status::Met) => Status::Met,
            (Status::NotMet, _) | (_, Status::NotMet) => Status::NotMet,
            (_, _) => Status::Unknown,
        }
    }
}

impl BitOr for Status {
    type Output = Status;
    fn bitor(self, rhs: Status) -> Status {
        match (self, rhs) {
            (Status::NotMet, Status::NotMet) => Status::NotMet,
            (Status::Met, _) | (_, Status::Met) => Status::Met,
            (_, _) => Status::Unknown,
        }
    }
}

impl Not for Status {
    type Output = Status;

    fn not(self) -> Self::Output {
        match self {
            Status::Met => Status::NotMet,
            Status::NotMet => Status::Met,
            Status::Unknown => Status::Unknown,
        }
    }
}
