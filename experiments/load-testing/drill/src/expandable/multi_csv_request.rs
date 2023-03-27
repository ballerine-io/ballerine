use rand::seq::SliceRandom;
use rand::thread_rng;
use std::path::Path;
use yaml_rust::Yaml;

use super::pick;
use crate::actions::Request;
use crate::benchmark::Benchmark;
use crate::interpolator::INTERPOLATION_REGEX;
use crate::reader;

pub fn is_that_you(item: &Yaml) -> bool {
  item["request"].as_hash().is_some() && (item["with_items_from_csv"].as_str().is_some() || item["with_items_from_csv"].as_hash().is_some())
}

pub fn expand(parent_path: &str, item: &Yaml, benchmark: &mut Benchmark) {
  let (with_items_path, quote_char) = if let Some(with_items_path) = item["with_items_from_csv"].as_str() {
    (with_items_path, b'\"')
  } else if let Some(_with_items_hash) = item["with_items_from_csv"].as_hash() {
    let with_items_path = item["with_items_from_csv"]["file_name"].as_str().expect("Expected a file_name");
    let quote_char = item["with_items_from_csv"]["quote_char"].as_str().unwrap_or("\"").bytes().next().unwrap();

    (with_items_path, quote_char)
  } else {
    unreachable!();
  };

  if INTERPOLATION_REGEX.is_match(with_items_path) {
    panic!("Interpolations not supported in 'with_items_from_csv' property!");
  }

  let with_items_filepath = Path::new(parent_path).with_file_name(with_items_path);
  let final_path = with_items_filepath.to_str().unwrap();

  let mut with_items_file = reader::read_csv_file_as_yml(final_path, quote_char);

  if let Some(shuffle) = item["shuffle"].as_bool() {
    if shuffle {
      let mut rng = thread_rng();
      with_items_file.shuffle(&mut rng);
    }
  }

  let pick = pick(item, &with_items_file);
  for (index, with_item) in with_items_file.iter().take(pick).enumerate() {
    let index = index as u32;

    benchmark.push(Box::new(Request::new(item, Some(with_item.clone()), Some(index))));
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn expand_multi() {
    let text = "---\nname: foobar\nrequest:\n  url: /api/{{ item.id }}\nwith_items_from_csv: ./fixtures/users.csv";
    let docs = yaml_rust::YamlLoader::load_from_str(text).unwrap();
    let doc = &docs[0];
    let mut benchmark: Benchmark = Benchmark::new();

    expand("example/benchmark.yml", doc, &mut benchmark);

    assert!(is_that_you(doc));
    assert_eq!(benchmark.len(), 2);
  }

  #[test]
  fn expand_multi_should_limit_requests_using_the_pick_option() {
    let text = "---\nname: foobar\nrequest:\n  url: /api/{{ item }}\npick: 2\nwith_items_from_csv: ./fixtures/users.csv";
    let docs = yaml_rust::YamlLoader::load_from_str(text).unwrap();
    let doc = &docs[0];
    let mut benchmark: Benchmark = Benchmark::new();

    expand("example/benchmark.yml", doc, &mut benchmark);

    assert!(is_that_you(doc));
    assert_eq!(benchmark.len(), 2);
  }

  #[test]
  fn expand_multi_should_work_with_pick_and_shuffle() {
    let text = "---\nname: foobar\nrequest:\n  url: /api/{{ item }}\npick: 1\nshuffle: true\nwith_items_from_csv: ./fixtures/users.csv";
    let docs = yaml_rust::YamlLoader::load_from_str(text).unwrap();
    let doc = &docs[0];
    let mut benchmark: Benchmark = Benchmark::new();

    expand("example/benchmark.yml", doc, &mut benchmark);

    assert!(is_that_you(doc));
    assert_eq!(benchmark.len(), 1);
  }

  #[test]
  #[should_panic]
  fn runtime_expand() {
    let text = "---\nname: foobar\nrequest:\n  url: /api/{{ item.id }}\nwith_items_from_csv: ./fixtures/{{ memory }}.csv";
    let docs = yaml_rust::YamlLoader::load_from_str(text).unwrap();
    let doc = &docs[0];
    let mut benchmark: Benchmark = Benchmark::new();

    expand("example/benchmark.yml", doc, &mut benchmark);
  }
}
