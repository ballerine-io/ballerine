## Running SDK example

1. Install dependencies:
   `pnpm install`

2. Run example:
   `pnpm dev`

### Modify configuration

1. Duplicate and rename `src/configs/default-config.ts`
2. On the duplicated file change default configuration

- Skip 3. and 4. if you're not using our backend

3. Generate a JWT

```bash
 curl --location --request POST 'https://api.ballerine.io/v2/create-enduser-token' \
 --header 'Content-Type: application/json' \
 --header 'Authorization: Api-Key [API_KEY]' \
 --data-raw '{
     "endUserId": "[ENDUSER_ID]",
     "clientId": "[CLIENT_ID]"
 }'
```

4. Add the JWT to the init config under `backendConfig.auth.auhtorizationHeader` as "Bearer [JWT]"
5. Import the new configuration and pass it to `init` and `mount` functions
