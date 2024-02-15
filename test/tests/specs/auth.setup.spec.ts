// import { expect, test as setup } from '@playwright/test';

// setup('authenticate default', async ({ context, request }) => {
//     const response = await request.post(`${process.env.API_URL}`, {
//         data: {
//             email: process.env.LOGIN_EMAIL,
//             password: process.env.LOGIN_PASSWORD,
//             callbackUrl: '/en/case-management/entities?filterId=clpvdz765000523is0b7hpakb'
//         }
//     });
//     const token = response.headers()['set-cookie'].split(';')[0].split('session=')[1];
//     expect(token, 'Expected: token present').not.toBeUndefined();
//     await context.addCookies([{ name: 'session', value: token, url: 'https://api-dev.eu.ballerine.io' }]);
//     await context.storageState({ path: './tests/auth/defaultStorageState.json' });
// });
