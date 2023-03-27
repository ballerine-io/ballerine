use std::fs::File;
use std::io::{prelude::*, BufReader};
use std::path::Path;

pub fn read_file(filepath: &str) -> String {
  // Create a path to the desired file
  let path = Path::new(filepath);
  let display = path.display();

  // Open the path in read-only mode, returns `io::Result<File>`
  let mut file = match File::open(path) {
    Err(why) => panic!("couldn't open {}: {}", display, why),
    Ok(file) => file,
  };

  // Read the file contents into a string, returns `io::Result<usize>`
  let mut content = String::new();
  if let Err(why) = file.read_to_string(&mut content) {
    panic!("couldn't read {}: {}", display, why);
  }

  content
}

pub fn read_file_as_yml(filepath: &str) -> Vec<yaml_rust::Yaml> {
  let content = read_file(filepath);
  yaml_rust::YamlLoader::load_from_str(content.as_str()).unwrap()
}

pub fn read_yaml_doc_accessor<'a>(doc: &'a yaml_rust::Yaml, accessor: Option<&str>) -> &'a Vec<yaml_rust::Yaml> {
  if let Some(accessor_id) = accessor {
    match doc[accessor_id].as_vec() {
      Some(items) => items,
      None => {
        println!("Node missing on config: {accessor_id}");
        println!("Exiting.");
        std::process::exit(1)
      }
    }
  } else {
    doc.as_vec().unwrap()
  }
}

pub fn read_file_as_yml_array(filepath: &str) -> yaml_rust::yaml::Array {
  let path = Path::new(filepath);
  let display = path.display();

  let file = match File::open(path) {
    Err(why) => panic!("couldn't open {}: {}", display, why),
    Ok(file) => file,
  };

  let reader = BufReader::new(file);
  let mut items = yaml_rust::yaml::Array::new();
  for line in reader.lines() {
    match line {
      Ok(text) => {
        items.push(yaml_rust::Yaml::String(text));
      }
      Err(e) => println!("error parsing line: {e:?}"),
    }
  }

  items
}

// TODO: Try to split this fn into two
pub fn read_csv_file_as_yml(filepath: &str, quote: u8) -> yaml_rust::yaml::Array {
  // Create a path to the desired file
  let path = Path::new(filepath);
  let display = path.display();

  // Open the path in read-only mode, returns `io::Result<File>`
  let file = match File::open(path) {
    Err(why) => panic!("couldn't open {}: {}", display, why),
    Ok(file) => file,
  };

  let mut rdr = csv::ReaderBuilder::new().has_headers(true).quote(quote).from_reader(file);

  let mut items = yaml_rust::yaml::Array::new();

  let headers = match rdr.headers() {
    Err(why) => panic!("error parsing header: {:?}", why),
    Ok(h) => h.clone(),
  };

  for result in rdr.records() {
    match result {
      Ok(record) => {
        let mut linked_hash_map = linked_hash_map::LinkedHashMap::new();

        for (i, header) in headers.iter().enumerate() {
          let item_key = yaml_rust::Yaml::String(header.to_string());
          let item_value = yaml_rust::Yaml::String(record.get(i).unwrap().to_string());

          linked_hash_map.insert(item_key, item_value);
        }

        items.push(yaml_rust::Yaml::Hash(linked_hash_map));
      }
      Err(e) => println!("error parsing header: {e:?}"),
    }
  }

  items
}
