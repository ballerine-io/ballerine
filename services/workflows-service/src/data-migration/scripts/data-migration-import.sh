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
mv /tmp/*wf-data-migration*/* ./prisma/data-migrations/
