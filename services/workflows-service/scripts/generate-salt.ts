import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

const path = process.env.CI ? '.env.example' : '.env';

config({ path });

console.log(bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT) || 10));
