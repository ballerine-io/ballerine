// eslint-disable-next-line
const checkRepositoryArgsRule = require('./check-repository-args.rule');

const plugin = { rules: { 'check-repository-args': checkRepositoryArgsRule } };

module.exports = plugin;
