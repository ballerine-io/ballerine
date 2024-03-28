const core = require('@actions/core');

async function main() {
  const lastTag = core.getInput('tag');

  console.log('Last tag: ', lastTag);

  let [component, version] = lastTag.split('@v');

  version = version.split('.').map(i => Number.parseInt(i));
  version[2]++;

  core.setOutput('version', `${component}@v${version.join('.')}`);
  core.setOutput('tag', `${version.join('.')}`);
}

main();
