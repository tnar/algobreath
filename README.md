# AlgoBreath

AlgoBreath is a modern, markdown-based note-taking web application built with [Remix](https://remix.run/) and deployed on [Cloudflare Pages](https://pages.cloudflare.com/). It offers seamless creation, management, and organization of notes with robust tagging functionality.

## Features

- **Markdown Support**: Write and preview notes in markdown with syntax highlighting and LaTeX support.
- **Tagging System**: Organize notes using tags for easy categorization and retrieval.
- **Admin Dashboard**: Manage notes and tags through an intuitive administrative interface.
- **Responsive Design**: Optimized for all devices using Tailwind CSS and DaisyUI.
- **SEO Optimized**: Automatically generated sitemap and meta tags for improved search engine visibility.
- **Cloudflare Integration**: Leveraging Cloudflare Workers and D1 for a performant and scalable backend.

## Tech Stack

- **Framework**: [Remix](https://remix.run/)
- **Frontend**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Syntax Highlighting**: [Highlight.js](https://highlightjs.org/)
- **Mathematical Notation**: [KaTeX](https://katex.org/)
- **Backend**: [Cloudflare Workers](https://workers.cloudflare.com/) with [D1 Database](https://developers.cloudflare.com/d1/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Linting**: [ESLint](https://eslint.org/) with [TypeScript ESLint](https://typescript-eslint.io/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up) with Workers and Pages enabled

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/algobreath.git
   cd algobreath
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   WORKER_HOST=your_worker_host_url
   DB=your_d1_database_url
   ```

### Development

AlgoBreath uses Wrangler to emulate the Cloudflare runtime locally.

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Access the application:**

   Open [http://127.0.0.1:8788](http://127.0.0.1:8788) in your browser.

### Scripts

- **Build the application:**

  ```bash
  npm run build
  ```

- **Start the development server:**

  ```bash
  npm run dev
  ```

- **Lint the codebase:**

  ```bash
  npm run lint
  ```

- **Type check:**

  ```bash
  npm run typecheck
  ```

- **Deploy to Cloudflare Pages:**

  ```bash
  npm run pages:deploy
  ```

### Deployment

AlgoBreath is deployed on Cloudflare Pages. To deploy your changes:

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Deploy using Wrangler:**

   ```bash
   npm run pages:deploy
   ```

Ensure your Cloudflare account is properly configured with the necessary environment variables.

## Project Structure

- **`app/`**: Contains all frontend and server-side code.
  - **`routes/`**: Defines all application routes.
  - **`models/`**: Handles data fetching and manipulation.
  - **`utils/`**: Utility functions like markdown parsing.
  - **`styles/`**: Tailwind CSS configurations and styles.
- **`public/`**: Static assets like images and manifest files.
- **`server.ts`**: Entry point for the Cloudflare Workers server.
- **`.gitignore`**: Specifies intentionally untracked files to ignore.
- **`package.json`**: Project metadata and dependencies.
- **`tailwind.config.ts`**: Tailwind CSS configuration.
- **`tsconfig.json`**: TypeScript configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

1. **Fork the repository**
2. **Create a new branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit your changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Built with love using Remix, React, and Cloudflare.
- Inspired by modern web development best practices.