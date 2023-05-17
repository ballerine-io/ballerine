import { useSignInMutation } from '../../../lib/react-query/mutations/useSignInMutation/useSignInMutation';
import { FormEventHandler, useCallback } from 'react';
import { useAuthContext } from '../../../context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useIsAuthenticated } from '../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { isErrorWithMessage } from '@ballerine/common';
import { join } from 'path';
import { readFileSync } from 'fs';

export const VersionPage = () => {
  console.log(__dirname)
  const packageJsonPath = join(__dirname, '..', '..', 'package.json');
  const ackageJsonContent = readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(ackageJsonContent);

  const name = packageJson.name as string;
  const version = packageJson.version as string;

  return (
    <div className={`card min-h-[60vh] w-full max-w-lg`}>
      name: {"name"}
      version: {"version"}

    </div>
  );
};
