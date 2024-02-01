apt update &&
apt install curl -y &&
apt install zip -y &&
curl -L \
-H "Accept: application/vnd.github+json" \
-H "Authorization: Bearer ${GITHUB_TOKEN}" \
-H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/repos/ballerine-io/wf-data-migration/zipball -o /tmp/wf-data-migration.zip &&
rm -rf ./prisma/data-migrations &&
mkdir -p ./prisma/data-migrations &&
unzip -q /tmp/wf-data-migration.zip '*wf-data-migration*.ts' -d /tmp/ &&
if [[ "$ENVIRONMENT_NAME" == "staging" || "$ENVIRONMENT_NAME" == "sandbox" || "$ENVIRONMENT_NAME" == "sb" ]]; then
    rm -rf /tmp/*wf-data-migration*/prod && rm -rf /tmp/*wf-data-migration*/dev && rm -rf /tmp/*wf-data-migration*/local
elif [[ "$ENVIRONMENT_NAME" == "prod" || "$ENVIRONMENT_NAME" == "production" ]]; then
    rm -rf /tmp/*wf-data-migration*/local && rm -rf /tmp/*wf-data-migration*/dev && rm -rf /tmp/*wf-data-migration*/sb
elif [[ "$ENVIRONMENT_NAME" == "dev" || "$ENVIRONMENT_NAME" == "development" ]]; then
    rm -rf /tmp/*wf-data-migration*/local && rm -rf /tmp/*wf-data-migration*/sb && rm -rf /tmp/*wf-data-migration*/prod
else
    echo "Unknown environment: $ENVIRONMENT_NAME. No data migrations moved."
fi &&
mv /tmp/*wf-data-migration*/* ./prisma/data-migrations/
