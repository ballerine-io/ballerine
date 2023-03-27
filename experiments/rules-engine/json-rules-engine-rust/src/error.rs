use serde_json::error::Error as SerializeJsonError;
use thiserror::Error as ThisError;

#[cfg(feature = "email")]
use sendgrid::error::SendgridError;

#[cfg(feature = "callback")]
use reqwest::{header::InvalidHeaderValue, Error as ReqwestError};

#[derive(ThisError, Debug)]
pub enum Error {
    #[cfg(feature = "callback")]
    #[error("Reqwest Error: `{0:?}`")]
    ReqwestError(#[from] ReqwestError),
    #[cfg(feature = "callback")]
    #[error("Reqwest Invalid Header Error: `{0:?}`")]
    ReqwestInvalidHeaderError(#[from] InvalidHeaderValue),
    #[error("Serialize Json Error: `{0:?}`")]
    SerializeJsonError(#[from] SerializeJsonError),
    #[cfg(feature = "email")]
    #[error("Send grid error: `{0:?}`")]
    SendgridError(#[from] SendgridError),
    // TODO make this error nicer!
    #[error("Event error: `{0}`")]
    EventError(String),
}

pub type Result<T> = std::result::Result<T, Error>;
