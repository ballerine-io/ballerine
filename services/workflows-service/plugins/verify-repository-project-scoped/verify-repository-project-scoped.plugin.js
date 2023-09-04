/* eslint-disable */
const verifyRepositoryProejctScoped = require('./verify-repository-project-scoped.rule');

const plugin = { rules: { 'verify-repository-project-scoped': verifyRepositoryProejctScoped } };

module.exports = plugin;
