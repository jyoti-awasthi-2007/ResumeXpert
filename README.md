# AI Resume System

AI Resume System is an AI-powered resume, certificate verification, and talent assessment platform built with React and Vite. The UI offers an interactive dashboard for candidates and recruiters to upload resumes, validate certificates, complete AI interview sessions, track skills, and review analytics.

## Key Features

- AI Resume Upload
  - Upload resume files and simulate AI-driven skill extraction.
  - Display scanned skills with a polished result experience.
- Certificate Analysis
  - Upload multiple certificates for authenticity checks.
  - Show trust scores, risk levels, and verification status.
- AI Interview Simulation
  - Conduct a conversational AI interview with technical questions.
  - Track progress and confidence scoring in a messaging interface.
- Skill Test
  - Access a skills assessment flow for technical screening.
- Integrity Monitor
  - Simulated integrity monitoring for assessment sessions.
- Results & Analytics
  - Visualize resume, certificate, and interview performance.
  - Use trend charts, progress bars, and activity summaries.
- Verified Profile
  - Share a verified profile with skills and certificate badges.
- Recruiter Dashboard
  - Compare candidate trust signals and assessment status.
- Modern UI
  - Built with Tailwind CSS, Framer Motion, and animated UI components.

## Pages & Routes

- `/` — Landing page with product overview and feature highlights.
- `/login` — Login page.
- `/signup` — Signup page.
- `/dashboard` — Main dashboard with trust score and activity feed.
- `/upload-resume` — Resume upload and skill extraction workflow.
- `/certificate-analysis` — Certificate verification and risk analysis.
- `/ai-interview` — AI interview experience with chat UI.
- `/skill-test` — Skill testing interface.
- `/integrity-monitor` — Integrity monitoring page.
- `/results` — Results and analytics summary.
- `/profile` — Verified profile page.
- `/recruiter` — Recruiter dashboard.

## Technology Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Recharts
- Lucide React icons
- Axios
- ESLint

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview the production build:

   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.jsx` — Main router setup and page definitions.
- `src/pages/` — Application page components for core product flows.
- `src/components/` — Reusable UI components such as upload box, cards, and badge.
- `src/layouts/DashboardLayout.jsx` — Shared dashboard layout wrapper.
- `src/index.css` — Global styles and Tailwind configuration entry.
- `vite.config.js` — Vite configuration.
- `package.json` — Project dependencies and scripts.

## Notes

- The current app is a front-end prototype.
- AI features and verification workflows are simulated for demo purposes.
- Most data is mocked inside the UI and does not connect to a live backend.

## Contribution

Contributions are welcome. Open an issue or submit a pull request for new features, bug fixes, or UI improvements.

## License

This repository does not specify a license. Add one if you plan to publish or share the project publicly.
