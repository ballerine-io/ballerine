# json-rules-engine

## Installation

Add this package to `Cargo.toml` of your project. (Check https://crates.io/crates/json-rules-engine for right version)

```toml
[dependencies]
json-rules-engine = { version = "0.9", features = ["email", "eval"] }
tokio = { version = "0.3.3", features = ["macros"] }
serde_json = { version = "*" }
anyhow = { version = "*" }
```

## Features

- Built in operators
- Full support for `ALL`, `OR`, `Not`, `AtLeast` boolean operators, including recursive nesting
- Type Safe
- Load rules from json
- Built in Moustache render
- Safe script
- Custom function
- Custom event
- Coalescence Group
- Existing events:
  - HTTP POST to callback url 
  - Email notifications based on `SendGrid`

## Get started

```rust
use json_rules_engine::{Engine, Rule, Map, from_dynamic};
use serde_json::json;
use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize)]
struct Facts {
    name: String,
    age: u8,
    action: String
}

fn age_greater_than20_less_than_inclusive25(p: Map) -> bool {
    let facts: Facts = from_dynamic(&p.into()).unwrap();
    facts.age > 20 && facts.age <= 25
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let sendgrid_api_key = "kjsldkjslkjlwkjkjew";

    let rule_json = json!({
        "conditions": {
            "and": [
                {
                    "field": "name",
                    "operator": "string_equals",
                    "value": "Cheng JIANG"
                },
                {
                    "field": "age",
                    "operator": "int_in_range",
                    "value": [20, 25]
                },
                {
                    "and": [
                        {
                            "expr": "facts.age > 20 && facts.age <= 25",
                        },
                        {
                            "expr": "my_function(facts)",
                        },
                    ]
                },
                {
                    "field": "action",
                    "operator": "string_equals",
                    "value": "coding in rust"
                }
            ]
        },
        "events": [
            {
                "type": "post_to_callback_url",
                "params": {
                    "callback_url": "http://example.com/peoples/conding_in_rust",
                    "type": "info",
                    "title": "Another person is coding in rust",
                    "message": "Name: {{ name }}, Age: {{ age }}, Action: {{ action }}"
                }
            },
            {
                "type": "email_notification",
                "params": {
                    "from": "alex_cj96@foxmail.com",
                    "to": ["abc.def@gmail.com"],
                    "type": "info",
                    "title": "Another person is coding in rust",
                    "message": "Name: {{ name }}, Age: {{ age }}, Action: {{ action }},"
                }
            }
        ]
    });

    let rule: Rule = serde_json::from_str::<Rule>(&serde_json::to_string(&rule_json).unwrap()).unwrap();

    let mut engine = Engine::new();
    engine.add_rule(rule);
    engine.add_function("my_function", age_greater_than20_less_than_inclusive25);

    let facts = json!({
        "name": "Cheng JIANG",
        "age": 24,
        "action": "coding in rust",
    });

    let rule_results = engine.run(&facts).await?;

    println!("{:#?}", rule_results);
}
```

## Special Thanks

-   [bsundsrud](https://github.com/bsundsrud) for its basic implementation [ruuls-rs](https://github.com/bsundsrud/ruuls-rs)
