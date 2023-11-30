import { execSync } from 'child_process';
import path from 'path';

execSync(`bash ${path.join(__dirname, '/data-migration-import.sh')}`, { stdio: 'inherit' });
