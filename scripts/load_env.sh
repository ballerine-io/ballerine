#!/bin/bash

# Function to fetch secret from AWS Secrets Manager
fetch_secret() {
  secret_name=$1
  aws secretsmanager get-secret-value --secret-id $secret_name --query SecretString --output text --region eu-central-1
}

# Get the git remote URL
git_remote_url=$(git config --get remote.origin.url)

# Determine the secret name based on the presence of keywords in the git remote URL
if [[ $git_remote_url == *"ballerine.git" ]]; then
  secret_name="dev/app/workflow"

  # List of keys to skip
  skip_keys=("API_KEY" "NODE_ENV" "SESSION_SECRET" "ENVIRONMENT_NAME" "HASHING_KEY_SECRET" 
  "APP_API_URL" "COLLECTION_FLOW_URL" "WEB_UI_SDK_URL"
  "UNIFIED_API_TOKEN" "UNIFIED_API_URL" "UNIFIED_API_TOKEN" "UNIFIED_API_SHARED_SECRET"
  "EMAIL_API_URL" "EMAIL_API_TOKEN" "AWS_S3_BUCKET_NAME" "AWS_S3_BUCKET_KEY" 
  "AWS_S3_BUCKET_SECRET" "DB_URL" "DB_USER" "DB_PASSWORD")

elif [[ $git_remote_url == *"unified-api.git" ]]; then
  secret_name="dev/app/unified"

  # List of keys to skip
    skip_keys=("API_KEY" "API_SHARED_SECRET" "NODE_ENV" "ENVIRONMENT_NAME" "PUBLICWWW_API_KEY" 
  "TEMPORAL_API_BASE_URL" "SENTRY_DSN")

else
  echo "No matching secret name for the provided git remote URL."
  exit 1
fi

# Fetch the secret
secret_value=$(fetch_secret $secret_name)

if [ $? -ne 0 ]; then
  echo "Failed to fetch secret: $secret_name"
  exit 1
fi


# Export the secret values to the current shell environment
echo "Secret fetched successfully. Setting environment variables...$skip_keys"

# Use jq to parse the JSON and export the key-value pairs
echo $secret_value | jq -r 'to_entries | .[] | "export \(.key)=\(.value)"' | while read -r line; do
  key=$(echo $line | cut -d'=' -f1 | sed 's/export //')
  if [[ " ${skip_keys[@]} " =~ " $key " ]]; then
    continue
  fi
  eval $line
done

echo "Environment variables set."