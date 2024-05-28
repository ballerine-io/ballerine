#!/bin/bash

# Set the root folder path
root_folder=$(dirname "$0")/..
env_file="$root_folder/services/workflows-service/.env"
env_example_file="$root_folder/services/workflows-service/.env.example"

# Check if the .env file exists
if [[ ! -f "$env_example_file" ]]; then
    echo ".env file not found at $env_example_file"
    exit 1
fi

# Read the HASHING_KEY_SECRET line from the .env file
while IFS= read -r line; do
    if [[ $line == HASHING_KEY_SECRET=* ]]; then
        secret_value=${line#*=}
        break
    fi
done < "$env_example_file"

# Check if secret_value is empty
if [[ -z "$secret_value" ]]; then
    echo "HASHING_KEY_SECRET not found on: $env_example_file "
    exit 1
fi

# Determine the operating system
current_os=$(uname)
echo "Current OS: $current_os"
sanitized_value=${secret_value//\\/}

# Adjust the value based on the operating system
if [[ $current_os == "Linux" || $current_os == "Darwin" ]]; then
    if [[ $secret_value == "\\$"* ]]; then
        secret_value=${sanitized_value/\\$/\$}
    fi
elif [[ $current_os == "MINGW"* || $current_os == "CYGWIN"* || $current_os == "MSYS"* ]]; then
    if [[ $secret_value == '"\\$'* ]]; then
        secret_value=${sanitized_value/\\$/\$}
        secret_value=${secret_value%\"}
        secret_value=${secret_value#\"}
    fi
fi

echo $secret_value

# Remove the previous HASHING_KEY_SECRET entry
grep -v '^HASHING_KEY_SECRET=' "$env_example_file" > "$env_example_file.tmp" && mv "$env_example_file.tmp" "$env_example_file"
grep -v '^HASHING_KEY_SECRET=' "$env_file" > "$env_file.tmp" && mv "$env_file.tmp" "$env_file"

# Append the adjusted value to the .env file
echo "HASHING_KEY_SECRET=$secret_value" >> "$env_file"
echo "HASHING_KEY_SECRET=$secret_value" >> "$env_example_file"

# Print a confirmation message
echo "HASHING_KEY_SECRET has been appended to the .env file with value: $secret_value"