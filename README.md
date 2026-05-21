# IFoxBlog

A modern, responsive blog application built with React, TypeScript, and Tailwind CSS. It features a public-facing Front Office for viewing and submitting posts, and a secure Admin Dashboard for moderating content.

## Features

- **Front Office:** View published posts in list or grid format.
- **Post Submission:** Users can submit posts with titles, descriptions, and image uploads.
- **Admin Dashboard:** Secure login (`admin` / `admin123`) to review, approve, or reject pending posts.
- **Responsive Design:** Fully responsive layout that works on mobile, tablet, and desktop.
- **Local Storage Database:** Uses browser local storage to simulate a database for easy setup and testing.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Setup & Running Locally (VS Code)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ifoxblog
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Install dependencies:**
   Open the integrated terminal in VS Code (`Ctrl+~` or `Cmd+~`) and run:
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Deployment

### Docker

You can build and run the application using Docker:

```bash
docker build -t ifoxblog .
docker run -p 3000:3000 ifoxblog
```
The app will be available at `http://localhost:3000`.

### Railway

This project includes a `railway.json` and a `Dockerfile` pre-configured for deployment on [Railway](https://railway.app/). Simply connect your GitHub repository to Railway, and it will automatically build and deploy using the Dockerfile.

### Vercel / Netlify

Since this is a standard Vite React application, you can easily deploy it to Vercel or Netlify.
1. Push your code to GitHub.
2. Import the repository in Vercel/Netlify.
3. The build command (`npm run build`) and output directory (`dist`) will be automatically detected.

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Lucide React](https://lucide.dev/) (Icons)
