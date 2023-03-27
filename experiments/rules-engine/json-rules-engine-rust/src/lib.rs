#![allow(dead_code)]
//! Simple rules engine that represents requirements as a tree, with each node having one or more requirements in order to be "Met".
//!
//! A tree of rules is constructed, and then the `.check_json()` method is called.
//! `json` is a nested `field: value` that will be given to each node in the tree for testing.
//!
//! Status output can be either `Met`, `NotMet`, or `Unknown` if the tested field is not present in the json.
//!
//! To construct a tree, see the following methods.
//!
//! ## Example
//!
//! ```rust
//! extern crate json_rules_engine;
//! use serde_json::json;
//!
//! let tree = json_rules_engine::and(vec![
//!     json_rules_engine::string_equals("name", "John Doe"),
//!     json_rules_engine::or(vec![
//!         json_rules_engine::int_equals("fav_number", 5),
//!         json_rules_engine::int_in_range("thinking_of", 5, 10)
//!     ])
//! ]);
//! let mut facts = json!({
//!     "name": "John Doe",
//!     "fav_number": 5
//! });
//! #[cfg(not(feature = "eval"))]
//! {
//!     let result = tree.check_value(&facts);
//!     println!("{:?}", result);
//!     assert!(result.status == json_rules_engine::Status::Met);
//! }
//! // result = ConditionResult { name: "And", status: Met, children: [ConditionResult { name: "Name is John Doe", status: Met, children: [] }, ConditionResult { name: "Or", status: Met, children: [ConditionResult { name: "Favorite number is 5", status: Met, children: [] }, ConditionResult { name: "Thinking of a number between 5 and 10", status: Unknown, children: [] }] }] }
//! ```
//!
//! This creates a tree like the following:
//!
//! ```text
//!                              +---------+
//!                              |   AND   |
//!                              +---------+
//!           _____________________/\_______________
//!          |                                      |
//!          V                                      V
//! +-------------------+                       +--------+
//! | Name is John Doe  |                       |   OR   |
//! +-------------------+                       +--------+
//! | field: "name"     |             ______________/\___________
//! | value: "John Doe" |            |                           |
//! +-------------------+            V                           V
//!                       +----------------------+  +-------------------------+
//!                       | Favorite number is 5 |  | Number between 5 and 10 |
//!                       +----------------------+  +-------------------------+
//!                       | field: "fav_number"  |  | field: "thinking_of"    |
//!                       | value: 5             |  | start: 5                |
//!                       +----------------------+  | end: 10                 |
//!                                                 +-------------------------+
//! ```
//!
//! [1]: enum.Rule.html#method.check

mod condition;
mod constraint;
mod error;
mod event;
mod rule;
mod status;

pub use crate::{condition::*, constraint::*, event::*, rule::*, status::*};

#[cfg(feature = "eval")]
pub use rhai::{serde::from_dynamic, Map};

#[cfg(feature = "eval")]
use rhai::{
    def_package,
    packages::{
        ArithmeticPackage, BasicArrayPackage, BasicMapPackage, LogicPackage,
        Package,
    },
    Engine as RhaiEngine,
};
use serde_json::value::to_value;
use std::{collections::HashMap, time::Instant};

#[cfg(feature = "email")]
use crate::event::email_notification::EmailNotification;
#[cfg(feature = "callback")]
use crate::event::post_callback::PostCallback;

pub use crate::error::*;
use serde::Serialize;
use std::{rc::Rc, sync::RwLock};

#[cfg(feature = "eval")]
def_package!(rhai:JsonRulesEnginePackage:"Package for json-rules-engine", lib, {
    ArithmeticPackage::init(lib);
    LogicPackage::init(lib);
    BasicArrayPackage::init(lib);
    BasicMapPackage::init(lib);
});

#[derive(Default)]
pub struct Engine {
    rules: Vec<Rule>,
    events: HashMap<String, Rc<RwLock<dyn EventTrait>>>,
    #[cfg(feature = "eval")]
    rhai_engine: RhaiEngine,
    coalescences: HashMap<String, (Instant, u64)>,
}

impl Engine {
    pub fn new() -> Self {
        #[allow(unused_mut)]
        let mut events: HashMap<_, Rc<RwLock<dyn EventTrait>>> = HashMap::new();

        #[cfg(feature = "callback")]
        {
            let event = Rc::new(RwLock::new(PostCallback::new()));
            let key = event.read().unwrap().get_type().to_string();
            events.insert(key, event);
        }

        #[cfg(feature = "email")]
        {
            let event = Rc::new(RwLock::new(EmailNotification::new()));
            let key = event.read().unwrap().get_type().to_string();
            events.insert(key, event);
        }

        Self {
            rules: Vec::new(),
            #[cfg(feature = "eval")]
            rhai_engine: {
                let mut engine = RhaiEngine::new_raw();
                engine.register_global_module(
                    JsonRulesEnginePackage::new().as_shared_module(),
                );
                engine
            },
            coalescences: HashMap::new(),
            events,
        }
    }

    pub fn add_rule(&mut self, rule: Rule) {
        self.rules.push(rule)
    }

    pub fn add_rules(&mut self, rules: Vec<Rule>) {
        self.rules.extend(rules)
    }

    pub fn load_rules(&mut self, rules: Vec<Rule>) {
        self.rules = rules;
    }

    pub fn clear(&mut self) {
        self.rules.clear();
    }

    #[cfg(feature = "eval")]
    pub fn add_function(&mut self, fname: &str, f: fn(Map) -> bool) {
        self.rhai_engine.register_fn(fname, f);
    }

    pub fn add_event(&mut self, f: Rc<RwLock<dyn EventTrait>>) {
        let key = f.read().unwrap().get_type().to_string();
        self.events.insert(key, f);
    }

    pub async fn run<T: Serialize>(
        &mut self,
        facts: &T,
    ) -> Result<Vec<RuleResult>> {
        let facts = to_value(facts)?;
        let mut met_rule_results: Vec<RuleResult> = self
            .rules
            .iter()
            .map(|rule| {
                rule.check_value(
                    &facts,
                    #[cfg(feature = "eval")]
                    &self.rhai_engine,
                )
            })
            .filter(|rule_result| {
                rule_result.condition_result.status == Status::Met
            })
            .collect();

        self.coalescences.retain(|_k, (start, expiration)| {
            start.elapsed().as_secs() < *expiration
        });

        for rule_result in met_rule_results.iter_mut() {
            // filter the events
            let mut cole = self.coalescences.clone();
            rule_result.events.retain(|event| {
                if let (Some(coalescence_group), Some(coalescence)) =
                    (&event.coalescence_group, event.coalescence)
                {
                    if cole.contains_key(coalescence_group) {
                        return false;
                    } else {
                        cole.insert(
                            coalescence_group.clone(),
                            (Instant::now(), coalescence),
                        );
                    }
                }

                true
            });

            self.coalescences = cole;

            // TODO run all the async events in parallel
            // run the events
            for event in &rule_result.events {
                let e =
                    self.events.get_mut(&event.event.ty).ok_or_else(|| {
                        Error::EventError(
                            "Event type doesn't exist".to_string(),
                        )
                    })?;

                e.read()
                    .unwrap()
                    .validate(&event.event.params)
                    .map_err(Error::EventError)?;
                e.write()
                    .unwrap()
                    .trigger(&event.event.params, &facts)
                    .await?;
            }
        }

        Ok(met_rule_results)
    }
}
