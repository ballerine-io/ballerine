use crate::{event::EventTrait, Error};

use async_trait::async_trait;
use erased_serde::Serialize;
use futures_util::TryFutureExt;
use sendgrid::v3::{
    Content, Email as SendGridEmail, Message, Personalization, Sender,
};
use serde_json::Value;

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct EmailNotification {
    ty: String,
}

#[async_trait]
impl EventTrait for EmailNotification {
    fn new() -> Self {
        Self {
            ty: "email_notification".to_string(),
        }
    }

    fn get_type(&self) -> &str {
        &self.ty
    }

    fn validate(&self, params: &HashMap<String, Value>) -> Result<(), String> {
        if !(params.contains_key("to")
            && params.contains_key("from")
            && params.contains_key("title")
            && params.contains_key("message"))
        {
            return Err(
                "At least one of 'to', 'from', 'title', 'message' is missing."
                    .to_string(),
            );
        }

        Ok(())
    }

    async fn trigger(
        &mut self,
        params: &HashMap<String, Value>,
        facts: &(dyn Serialize + Sync),
    ) -> Result<(), Error> {
        let api_key = ::std::env::var("SENDGRID_API_KEY")
            .expect("You must set 'SENDGRID_API_KEY' environment variable");

        let sender = Sender::new(api_key);

        let tos = params.get("to").unwrap().as_array().unwrap();
        let from = params.get("from").unwrap().to_string();
        let mut title = params.get("title").unwrap().to_string();
        let mut message = params.get("message").unwrap().to_string();

        let value = serde_json::from_str::<Value>(
            &serde_json::to_string(facts).unwrap(),
        )
        .unwrap();
        if let Ok(tmpl) = mustache::compile_str(&message)
            .and_then(|template| template.render_to_string(&value))
        {
            message = tmpl;
        }

        if let Ok(tmpl) = mustache::compile_str(&title)
            .and_then(|template| template.render_to_string(&value))
        {
            title = tmpl;
        }

        let personalization = {
            let mut p =
                Personalization::new(SendGridEmail::new(&tos[0].to_string()));
            for to in tos.iter().skip(1) {
                p = p.add_to(SendGridEmail::new(to.to_string()));
            }
            p
        };

        let m = Message::new(SendGridEmail::new(from))
            .set_subject(&title)
            .add_content(
                Content::new()
                    .set_content_type("text/plain")
                    .set_value(message),
            )
            .add_personalization(personalization);

        sender.send(&m).map_err(Error::from).await?;

        Ok(())
    }
}
