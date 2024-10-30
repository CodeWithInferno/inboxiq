# 📧 InboxIQ
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![Auth0](https://img.shields.io/badge/Auth0-Enabled-orange.svg)](https://auth0.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Integrated-blueviolet.svg)](https://openai.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/CodeWithInferno/inboxiq/pulls)
[![Contributors](https://img.shields.io/github/contributors/CodeWithInferno/inboxiq.svg)](https://github.com/CodeWithInferno/inboxiq/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/CodeWithInferno/inboxiq.svg)](https://github.com/CodeWithInferno/inboxiq/stargazers)


![InboxIQ Logo](public/Logo.webp) 

# InboxIQ

Your intelligent email assistant that makes email management smarter and more efficient. With advanced AI-driven features and a sleek, responsive design, InboxIQ is the ultimate SaaS solution for individuals and businesses to manage, prioritize, and organize emails seamlessly.

## 🌟 Key Features

- **Smart Email Categorization**: Classify emails into Promotions, Social, Spam, and more.
- **Priority Detection**: Identify high-priority emails to focus on what matters most.
- **AI-Powered Summarization**: Quickly read summaries of lengthy emails.
- **Template Generator**: Generate AI-driven email templates tailored to your needs.
- **Gmail Integration**: Fetch and manage emails from your Gmail account.
- **Dark Mode & Theme Customization**: Elegant and accessible design with dark mode.

## 🚀 Demo

Try InboxIQ live on our [Demo Link](https://inboxiq.demo.link).

## 📸 Screenshots

<!-- Add screenshots of your application here -->
![InboxIQ Interface](https://yourscreenshot.link/demo.png)

## 📚 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🔧 Installation

### Prerequisites

- **Node.js** and **npm** installed.
- **Gmail API Credentials**: Required for email fetching.
- **Auth0 Credentials**: Required for authentication.

### Steps

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

    1. Create a .env.local file in the root directory.
    2. Add the following environment variables:

    ```bash
    AUTH0_DOMAIN=your_auth0_domain
    AUTH0_CLIENT_ID=your_auth0_client_id
    AUTH0_CLIENT_SECRET=your_auth0_client_secret
    GOOGLE_API_KEY=your_google_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```

4. **Run the Application**:

    ```bash
    npm run dev
    ```

    Open http://localhost:3000 to view it in the browser.

## 🎉 Usage

InboxIQ provides a smart and efficient way to manage emails:

- Login: Authenticate using your Google account.
- Inbox Management: View and categorize emails in sections like Inbox, Promotions, and Social.
- Compose with AI Templates: Use the AI to generate a custom email template.
- Classify and Prioritize: Easily identify priority emails and filter through categories.
- Dark Mode: Switch to dark mode for a comfortable viewing experience.

## 📁 Project Structure

```
/inboxiq 
├── /public
|   └── Assets
├── /src 
|   ├── app
|   |   ├── api
|   |   ├── components
|   |   ├── dashboard
|   |   ├── fonts
|   |   ├── settings
|   |   ├── utils
|   |   ├── layout.js
|   |   └── page.js
|   ├── lib
|   └── sanity # Not Really Used
├── /env.local 
├── /styles 
├── /utils 
├── /api  
├── .env.local 
└── README.md 
```

## 🛠️ Contributing

We welcome contributions to improve InboxIQ! Please follow these steps:

1. Fork the Repository: Click on the fork button in GitHub.
2. Clone Your Fork:

    ```bash
    git clone https://github.com/CodeWithInferno/inboxiq.git
    ```

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. Make Your Changes: Add or modify files.
4. Commit Changes:

    ```bash
    git commit -m "Add new feature"
    ```

5. Push to GitHub

    ```bash
    git push origin feature/your-feature-name
    ```

6. Create a Pull Request: Go to GitHub, navigate to Pull Requests, and submit a new PR.

## Code of Conduct

Please follow our Code of Conduct to maintain a respectful and inclusive environment.

[Code Of Conduct](/inboxiq/CODE_OF_CONDUCT)

## 🙏 Acknowledgments

- OpenAI: Powering the AI email summarization and template generation.
- Auth0: Authentication and user management.
- Gmail API: For seamless integration with Google accounts.

