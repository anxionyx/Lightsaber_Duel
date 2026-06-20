# Contributing to Lightsaber_Duel

Thank you for your interest in contributing! We welcome contributions from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODEOFCONDUCT.md).

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [Code Style](#code-style)

---

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please help us by submitting an issue to our [Issue Tracker](https://github.com). 

Before submitting, please:
* Check the existing issues to ensure it hasn't already been reported.
* Make sure you are using the latest version of the project.

A good bug report should include:
* **A clear summary** of the issue.
* **Steps to reproduce** the behavior.
* **Expected vs. actual results**.
* **Environment details** (OS, version of language/runtime, browser if applicable).

### Suggesting Enhancements

We welcome new feature requests! Please open an issue and include:
* A detailed explanation of the proposed feature.
* The specific use case or problem it solves.
* Any mockups, code snippets, or visual examples if relevant.

### Your First Code Contribution

Unsure where to begin? Look for issues with the **"good first issue"** or **"help wanted"** labels. 

To set up the development environment:
1. **Fork** this repository.
2. **Clone** your fork locally: `git clone https://github.com/yourname/Lightsaber_Duel`
3. **Install** dependencies: `npm install`
4. **Test** your code: `npm run build`,then `npm run preview` 
5. **Create a branch** for your work: `git checkout -b feature/your-feature-name`.

---

## Pull Request Process

1. Ensure any installation or build dependencies are removed before the end of the layer when doing a build.
2. Update the `README.md` with details of changes to the interface, if applicable.
3. Make sure all automated tests pass before submitting the PR.
4. Open the Pull Request against our `main` branch.
5. Code reviews are required. At least one maintainer must approve the PR before it is merged.

---

## Style Guides

### Git Commit Messages

We follow conventional commit guidelines to keep history clean:
* Use the present tense ("Add feature" not "Added feature").
* Use the imperative mood ("Fix bug" not "Fixes bug").
* Prefix your commits (e.g., `feat:`, `fix:`, `docs:`, `style:`, `refactor:`).

### Code Style

* **Linting:** Run `npm run lint` before committing to ensure format compliance.
* **Testing:** Write unit tests for all new functionality and run `npm test` to verify.

