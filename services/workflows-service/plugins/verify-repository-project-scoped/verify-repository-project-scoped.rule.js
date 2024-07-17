module.exports = {
  meta: {
    type: 'problem',
    severiry: 'error',
    docs: {
      description: 'Check if repository methods recieve projectId: TProjectId',
      category: 'Best Practices',
      recommended: true,
    },
  },
  create: context => {
    const isRepository =
      /^(?!.*\/(customer|data-migration)\.repository\.(ts|js)$).*\.repository\.(ts|js)$/.test(
        // Using deprecated .getFilename here because relevant context.filename returns undefined
        context.getFilename(),
      );

    const UNSCOPED_METHOD_NAMES = ['unscoped', 'create', 'update'];

    return {
      MethodDefinition: node => {
        if (!isRepository || node.key.name === 'constructor') return;

        const isUnscoped = UNSCOPED_METHOD_NAMES.some(name =>
          node.key.name.toLowerCase().includes(name),
        );

        if (isUnscoped) return;

        const isProjectIdsIncluded = node.value.params.some(
          param => param.type === 'Identifier' && param.name.toLowerCase().includes('projectid'),
        );

        if (!isProjectIdsIncluded) {
          context.report({
            node,
            message: 'Scoped repository method should include projectId(s): TProjectId',
          });
        }
      },
    };
  },
};
