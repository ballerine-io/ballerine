use crate::{
    condition::{Condition, ConditionResult},
    event::CoalescenceEvent,
};
#[cfg(feature = "eval")]
use rhai::Engine;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Rule {
    pub conditions: Condition,
    pub events: Vec<CoalescenceEvent>,
}

impl Rule {
    pub fn check_value(
        &self,
        info: &Value,
        #[cfg(feature = "eval")] rhai_engine: &Engine,
    ) -> RuleResult {
        let condition_result = self.conditions.check_value(
            info,
            #[cfg(feature = "eval")]
            rhai_engine,
        );

        let mut events = self.events.clone();

        for CoalescenceEvent {
            coalescence_group, ..
        } in &mut events
        {
            if let Some(coalescence_group) = coalescence_group {
                if let Ok(new_coalescence_group) =
                    &mut mustache::compile_str(coalescence_group)
                        .and_then(|template| template.render_to_string(info))
                {
                    *coalescence_group = new_coalescence_group.clone();
                }
            }
        }

        RuleResult {
            condition_result,
            events,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RuleResult {
    pub condition_result: ConditionResult,
    pub events: Vec<CoalescenceEvent>,
}
