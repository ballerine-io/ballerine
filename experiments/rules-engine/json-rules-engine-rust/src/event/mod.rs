use crate::error::Error;

use async_trait::async_trait;
use erased_serde::Serialize as ErasedSerialize;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use std::collections::HashMap;

#[cfg(feature = "email")]
pub mod email_notification;
#[cfg(feature = "callback")]
pub mod post_callback;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CoalescenceEvent {
    pub(crate) coalescence: Option<u64>,
    pub(crate) coalescence_group: Option<String>,
    #[serde(flatten)]
    pub(crate) event: Event,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Event {
    #[serde(rename = "type")]
    pub ty: String,
    pub params: HashMap<String, Value>,
}

#[async_trait]
pub trait EventTrait {
    fn new() -> Self
    where
        Self: Sized;

    fn get_type(&self) -> &str;

    fn validate(&self, params: &HashMap<String, Value>) -> Result<(), String>;

    async fn trigger(
        &mut self,
        params: &HashMap<String, Value>,
        facts: &(dyn ErasedSerialize + Sync),
    ) -> Result<(), Error>;
}
