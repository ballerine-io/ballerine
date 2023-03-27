use crate::{event::EventTrait, Error};

use async_trait::async_trait;
use erased_serde::Serialize;
use reqwest::Client;
use serde_json::{json, Value};

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct PostCallback {
    ty: String,
    client: Client,
}

#[async_trait]
impl EventTrait for PostCallback {
    fn new() -> Self {
        Self {
            ty: "post_to_callback_url".to_string(),
            client: Client::new(),
        }
    }

    fn get_type(&self) -> &str {
        &self.ty
    }

    fn validate(&self, params: &HashMap<String, Value>) -> Result<(), String> {
        if !params.contains_key("callback_url") {
            return Err("'callback_url' is missing.".to_string());
        }

        Ok(())
    }

    async fn trigger(
        &mut self,
        params: &HashMap<String, Value>,
        facts: &(dyn Serialize + Sync),
    ) -> Result<(), Error> {
        let mut callback_url = params
            .get("callback_url")
            .unwrap()
            .as_str()
            .unwrap()
            .to_string();

        let value = serde_json::from_str::<Value>(
            &serde_json::to_string(facts).unwrap(),
        )
        .unwrap();
        if let Ok(tmpl) = mustache::compile_str(&callback_url)
            .and_then(|template| template.render_to_string(&value))
        {
            callback_url = tmpl;
        }

        self.client
            .post(callback_url)
            .json(&json!({
                "event": params,
                "facts": facts,
            }))
            .send()
            .await?;

        Ok(())
    }
}
