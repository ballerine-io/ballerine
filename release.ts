import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release';
import * as yargs from 'yargs';

(async () => {
  const options = await yargs
    .version(false) // don't use the default meaning of version in yargs
    .option('version', {
      description: 'Explicit version specifier to use, if overriding conventional commits',
      type: 'string',
    })
    .option('dryRun', {
      alias: 'd',
      description: 'Whether or not to perform a dry-run of the release process, defaults to true',
      type: 'boolean',
      default: true,
    })
    .option('verbose', {
      description: 'Whether or not to enable verbose logging, defaults to false',
      type: 'boolean',
      default: false,
    })
    .parseAsync();

  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    specifier: options.version,
    dryRun: options.dryRun,
    verbose: options.verbose,
  });

  await releaseChangelog({
    versionData: projectsVersionData,
    version: workspaceVersion,
    dryRun: options.dryRun,
    verbose: options.verbose,
  });

  // The returned number value from releasePublish will be zero if all projects are published successfully, non-zero if not
  const publishStatus = await releasePublish({
    dryRun: options.dryRun,
    verbose: options.verbose,
  });
  process.exit(publishStatus);
})();
