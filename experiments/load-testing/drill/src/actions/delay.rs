use async_trait::async_trait;
use colored::*;
use tokio::time::sleep;
use yaml_rust::Yaml;

use crate::actions::extract;
use crate::actions::Runnable;
use crate::benchmark::{Context, Pool, Reports};
use crate::config::Config;

use std::convert::TryFrom;
use std::time::Duration;

#[derive(Clone)]
pub struct Delay {
  name: String,
  seconds: u64,
}

impl Delay {
  pub fn is_that_you(item: &Yaml) -> bool {
    item["delay"].as_hash().is_some()
  }

  pub fn new(item: &Yaml, _with_item: Option<Yaml>) -> Delay {
    let name = extract(item, "name");
    let seconds = u64::try_from(item["delay"]["seconds"].as_i64().unwrap()).expect("Invalid number of seconds");

    Delay {
      name,
      seconds,
    }
  }
}

#[async_trait]
impl Runnable for Delay {
  async fn execute(&self, _context: &mut Context, _reports: &mut Reports, _pool: &Pool, config: &Config) {
    sleep(Duration::from_secs(self.seconds)).await;

    if !config.quiet {
      println!("{:width$} {}{}", self.name.green(), self.seconds.to_string().cyan().bold(), "s".magenta(), width = 25);
    }
  }
}
