const core = require('@actions/core');

async function main() {
  const lastTag = core.getInput('tag');

  console.log('Last tag: ', lastTag);

  let [component, version] = lastTag.split('@v');

  version = version.split('.').map(i => Number.parseInt(i));
  version[2]++;

  const verionName = `${component}@v${version.join('.')}`;
  const tag = `${version.join('.')}`;

  core.setOutput('version', verionName);
  core.setOutput('tag', `${version.join('.')}`);

  core.exportVariable('VERSION', verionName);
  core.exportVariable('TAG', tag);
}

main();
