# Contributing to InboxIQ

First of all, thank you for your interest in contributing to InboxIQ! Your involvement is invaluable, whether you're reporting bugs, suggesting enhancements, or directly improving the code. Here are some guidelines to help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Improving Documentation](#improving-documentation)
  - [Pull Requests](#pull-requests)
- [Development Guide](#development-guide)
  - [Setup and Installation](#setup-and-installation)
  - [Running Tests](#running-tests)
- [Commit Messages](#commit-messages)

---

## Code of Conduct
Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs
If you've found a bug, please check if it has already been reported under [Issues](https://github.com/CodeWithInferno/inboxiq/issues). If not, open a new issue with:
- A descriptive title.
- Steps to reproduce the bug.
- Expected and actual results.
- Additional context (browser, operating system, etc.).

### Suggesting Features
We’re always open to new ideas! If you have a feature request, please:
1. Check the existing Issues and Discussions to avoid duplicates.
2. Open a [feature request issue](https://github.com/CodeWithInferno/inboxiq/issues/new?template=feature_request.md) if it doesn’t exist.
3. Clearly describe your feature idea, the problem it solves, and why it would benefit users.

### Improving Documentation
Documentation improvements are always welcome. Feel free to update any part of the README, usage guides, or code comments to make them more helpful.

### Pull Requests
To submit a pull request:
1. **Fork** this repository.
2. **Create a new branch** (`feature/your-feature-name`).
3. **Make your changes** following our development guidelines.
4. **Commit your changes** (see [Commit Messages](#commit-messages)).
5. **Push** your branch to GitHub.
6. Open a **Pull Request** and fill out the provided template.

## Development Guide

### Setup and Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/inboxiq.git
    cd inboxiq
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Environment Configuration**:
    Set up the `.env.local` file with the required keys (see [README.md](README.md) for details).

4. **Run the app**:
    ```bash
    npm run dev
    ```

### Running Tests
If tests are available, run them with:
```bash
npm test
