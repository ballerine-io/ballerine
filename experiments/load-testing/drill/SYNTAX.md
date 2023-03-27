# Benchmark syntax

We're going to go through all of the benchmark options to understand all
possibilities.

This is a basic benchmark with 2 requests, run 4 plans concurrently against
`http://example.com` servers, executed 5 times. 40 requests in total.

```yaml
---
concurrency: 4
base: 'http://example.com'
iterations: 5
rampup: 5

plan:
  - name: Fetch users
    request:
      url: /api/users.json

  - name: Fetch organizations
    request:
      url: /api/organizations
```

### Benchmark main properties

- `base`: Base url for all relative URL's in your plan. (Optional)
- `iterations`: Number of loops is going to do (Optional, default: 1)
- `concurrency`: Number of concurrent iterations. (Optional, default: max)
- `rampup`: Amount of time it will take to start all iterations. (Optional)
- `plan`: List of items to do in your benchmark. (Required)

#### Plan items

- `include`: Include all requests in the given file.
- `request`: Execute a HTTP request.
- `assign`: Assign a value in the context to be interpolated later.

All those three items can be combined with `name` property to be show in logs.

#### Request item properties

- `url`: Url to be request for this item
- `headers`: List of custom headers you want to add in the requests.
- `method`: HTTP method in the requests. Valid methods are GET, POST, PUT, PATCH, HEAD or DELETE. (default: GET)
- `body`: Request body for methods like POST, PUT or PATCH.
- `with_items`: List of items to be interpolated in the given request url.
- `with_items_range`: Generates items from an iterator from start, step, stop.
- `with_items_from_csv`: Read the given CSV values and go through all of them as items.
- `assign`: Save the response in the context to be interpolated later.
- `tags`: List of tags for that item.

#### with_items_from_csv item properties

This item can be specified one of two ways.  First, as a simple string specifying the csv file name.

Second, it can be a hash with the following properties:

 - `file_name`: csv file containing the records to be used as items
 - `quote_char`: character to use as quote in csv parsing.  Defaults to `"\""`, but can be set to `"\'"`.  If your csv file has quoted strings that contain commas and that causes parse errors, make sure this value is set correctly.

#### tags item properties

[Ansible](https://docs.ansible.com/ansible/latest/user_guide/playbooks_tags.html#special-tags-always-and-never)-like tags.

If you assign list of tags, e.g `[tag1, tag2]`, this item will be executed if `tag1` **OR** `tag2` is passed.

Special tags: `always` and `never`.

If you assign the `always` tag, `drill` will always run that item, unless you specifically skip it (`--skip-tags always`).

If you assign the `never` tag to item, `drill` will skip that item unless you specifically request it (`--tags never`).
