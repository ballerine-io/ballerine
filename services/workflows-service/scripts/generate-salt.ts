import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Base64 } from 'js-base64';

const path = process.env.CI ? '.env.example' : '.env';

config({ path });

console.log(Base64.encode(bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT) || 10)));
