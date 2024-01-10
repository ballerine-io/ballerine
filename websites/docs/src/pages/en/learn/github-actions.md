import React from 'react';
import { Link } from 'react-router-dom';

const GitHubActionsPage = () => {
  return (
    <div>
      <h1>GitHub Actions Documentation</h1>
      <section>
        <h2>Overview</h2>
        <p>
          GitHub Actions is a powerful tool for automating workflows and CI/CD pipelines. It allows you to define custom actions and triggers based on events in your repository.
        </p>
        <p>
          Benefits of using GitHub Actions include:
          <ul>
            <li>Automated testing and deployment</li>
            <li>Integration with other tools and services</li>
            <li>Flexible and customizable workflows</li>
          </ul>
        </p>
      </section>
      <section>
        <h2>Configuring and Customizing Workflows</h2>
        <p>
          To configure and customize workflows in your project, follow these steps:
          <ol>
            <li>Create a `.github/workflows` directory in your repository.</li>
            <li>Add a YAML file for each workflow you want to define.</li>
            <li>Specify the triggers, actions, and steps for each workflow.</li>
            <li>Commit and push the changes to trigger the workflow.</li>
          </ol>
        </p>
        <p>
          Here's an example of a workflow YAML file:
          <pre>
            <code>
              name: Build and Test
              on:
                push:
                  branches:
                    - main
              jobs:
                build:
                  runs-on: ubuntu-latest
                  steps:
                    - name: Checkout code
                      uses: actions/checkout@v2
                    - name: Build and Test
                      run: |
                        npm install
                        npm run build
                        npm run test
            </code>
          </pre>
        </p>
      </section>
      <section>
        <h2>Examples and Best Practices</h2>
        <p>
          Here are some examples and best practices for using GitHub Actions in your project:
          <ul>
            <li>Use separate workflows for different stages of your CI/CD pipeline.</li>
            <li>Cache dependencies to speed up workflow execution.</li>
            <li>Use environment variables to store sensitive information.</li>
            <li>Monitor and analyze workflow runs using the GitHub Actions dashboard.</li>
          </ul>
        </p>
      </section>
      <Link to="/learn">Back to Learn</Link>
    </div>
  );
};

export default GitHubActionsPage;
