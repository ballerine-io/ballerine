#!/usr/bin/env bash

# Set the root folder path
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Move one directory up
PARENT_DIR=$(dirname "$SCRIPT_DIR")

WF_FOLDER="$PARENT_DIR/services/workflows-service"
env_file="$WF_FOLDER/.env"
env_example_file="$WF_FOLDER/.env.example"

# Check if the .env file exists
if [[ ! -f "$env_file" ]]; then
    echo ".env file not found at $env_file"
    exit 1
fi

# Generate a new bcrypt salt using Node.js and TypeScript
cd $WF_FOLDER
secret_value=$(npx tsx "$WF_FOLDER/scripts/generate-salt.ts")
cd $PARENT_DIR

# Check if secret_value is empty
if [[ -z "$secret_value" ]]; then
    echo "Error: Unable to generate salt. Exiting..."
    exit 1
fi


# Function to set the environment variable for Unix-based OS 
set_bcrypt_salt_unix() {
  echo "Setting HASHING_KEY_SECRET for Unix-based OS (Linux)..."
  sanitized_value=$(printf '%s\n' "$secret_value" | sed 's/\$/\\\$/g')
}

set_bcrypt_salt_mac() {
  echo "Setting HASHING_KEY_SECRET for Unix-based OS (macOS)..."
  sanitized_value=$(printf '%s\n' "$secret_value")
}

# Function to provide instructions for setting the environment variable in Windows 
set_bcrypt_salt_windows() {
  echo "Adding HASHING_KEY_SECRET for Windows..."
  sanitized_value=$(printf '%s\n' "$secret_value" | sed 's/\$/^$/g')
}

update_env_file() {
  adjusted_value="\"$sanitized_value\""

  for file in "$env_file" "$env_example_file"; do
    grep -v '^HASHING_KEY_SECRET=' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    echo -e "HASHING_KEY_SECRET=\"$sanitized_value\"" >> "$file"
  done
  
  echo "HASHING_KEY_SECRET has been set in the .env file with value: $adjusted_value"
}

# Detect the operating system
OS="$(uname -s)"
case "$OS" in
  Linux*)
    set_bcrypt_salt_unix
    ;;
  Darwin*)
    set_bcrypt_salt_mac
    ;;
  CYGWIN*|MINGW*|MSYS*)
    set_bcrypt_salt_windows
    ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

update_env_file
