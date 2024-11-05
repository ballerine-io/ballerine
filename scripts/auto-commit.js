#!/usr/bin/env node
const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function generateCommitMessage(diff) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a commit message generator that follows the Conventional Commits spec. Analyze diffs and generate concise (up to 3 bullet points with one sentences) messages in a professional and serious tone.\n\n' +
            'Format: <type>[optional scope]: <description>\n\n' +
            'Types: feat (feature), fix (bug fix), docs (documentation), style (formatting), refactor, perf (performance), test, chore (build/deps)\n\n' +
            'Guidelines:\n' +
            '- Use imperative mood ("add" not "added")\n' +
            "- Don't capitalize first letter\n" +
            '- No period at the end\n' +
            '- Keep first line under 72 chars\n' +
            '- Body lines must not exceed 100 chars\n' +
            '- Must have blank line between title and body\n\n' +
            'After analyzing the diff:\n' +
            '1. Write a concise conventional commit message\n' +
            '2. Add a brief description if needed\n' +
            '3. Include a humorous roast that relates to the code changes (add TWO line breaks before the roast)\n\n' +
            'Example format:\n' +
            'feat(api): implement user authentication\n\n' +
            '- Add JWT token validation\n' +
            '- Set up refresh token rotation\n\n\n' +
            '(Your authentication is so weak, even a commented-out password would be more secure)\n\n' +
            'Example roasts based on code:\n' +
            '(Your error handling is like a try-catch block that only catches compliments)\n' +
            '(These variable names are so cryptic, they could qualify as a new encryption algorithm)\n' +
            '(Your function has more nested callbacks than a family tree in Alabama)\n' +
            '(This API integration is held together by console.logs and prayers)',
        },
        {
          role: 'user',
          content: `Please generate a conventional commit message for the following changes:\n\n${diff}`,
        },
      ],
    });

    if (!response.choices?.[0]?.message?.content) {
      console.error('Unexpected API response:', JSON.stringify(response, null, 2));
      throw new Error('Invalid response format from OpenAI API');
    }

    // Clean and format the commit message to avoid shell interpretation issues
    const commitMessage = response.choices[0].message.content
      .trim()
      .replace(/`/g, '')
      .replace(/"/g, '\\"')
      .replace(/\$/g, '\\$');

    return commitMessage;
  } catch (error) {
    console.error('Error generating commit message:', error);
    throw error;
  }
}

async function main() {
  try {
    // Get git diff
    const diff = execSync('git diff --cached').toString();

    if (!diff) {
      console.error('No staged changes found. Please stage your changes using git add');
      process.exit(1);
    }

    // Generate commit message
    const commitMessage = await generateCommitMessage(diff);

    // Write commit message to temporary file
    const tempFile = path.join(__dirname, '..', '.git', 'COMMIT_EDITMSG');
    fs.writeFileSync(tempFile, commitMessage);

    // Open commit message in editor
    const editor = process.env.EDITOR || 'vim';
    execSync(`${editor} "${tempFile}"`, { stdio: 'inherit' });

    // Read edited commit message
    const editedMessage = fs.readFileSync(tempFile, 'utf8');

    // Check if -n flag was passed
    const noVerify = process.argv.includes('-n') ? ' -n' : '';

    // Create commit with edited message
    execSync(`git commit -m "${editedMessage}"${noVerify}`, { stdio: 'inherit' });

    console.log('Successfully created commit with message:', editedMessage);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
