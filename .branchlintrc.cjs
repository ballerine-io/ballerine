/** @type {import("@branchlint/cli").TBranchlintConfig} */
module.exports = {
  ...require('@branchlint/default-config'),
  postCommand: require('@branchlint/default-config').postCommand,
};
