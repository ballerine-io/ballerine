use async_trait::async_trait;
use colored::*;
use serde_json::json;
use yaml_rust::Yaml;

use crate::actions::extract;
use crate::actions::Runnable;
use crate::benchmark::{Context, Pool, Reports};
use crate::config::Config;

#[derive(Clone)]
pub struct Assign {
  name: String,
  key: String,
  value: String,
}

impl Assign {
  pub fn is_that_you(item: &Yaml) -> bool {
    item["assign"].as_hash().is_some()
  }

  pub fn new(item: &Yaml, _with_item: Option<Yaml>) -> Assign {
    let name = extract(item, "name");
    let key = extract(&item["assign"], "key");
    let value = extract(&item["assign"], "value");

    Assign {
      name,
      key,
      value,
    }
  }
}

#[async_trait]
impl Runnable for Assign {
  async fn execute(&self, context: &mut Context, _reports: &mut Reports, _pool: &Pool, config: &Config) {
    if !config.quiet {
      println!("{:width$} {}={}", self.name.green(), self.key.cyan().bold(), self.value.magenta(), width = 25);
    }

    context.insert(self.key.to_owned(), json!(self.value.to_owned()));
  }
}
