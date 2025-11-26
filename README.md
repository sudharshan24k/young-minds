# Young Minds @ Edura - Frontend

A modular, scalable, and production-ready children's creative portal built with React, Vite, and TailwindCSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository (if applicable) or navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Building for Production

Build the project for deployment:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # Reusable UI components (Buttons, Cards, Modals)
├── pages/               # Main route pages
│   ├── Home.jsx
│   ├── ExpressYourself.jsx
│   ├── ChallengeYourself.jsx
│   ├── BrainyBites.jsx
│   └── Enroll.jsx
├── App.jsx              # Main application component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles and Tailwind setup
```

## 🛠 Technologies Used

- **React**: UI Library
- **Vite**: Build tool
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animations
- **React Router**: Client-side routing
- **Lucide React**: Icons

## 🔮 Future Roadmap (Backend Integration)

- **Authentication**: Add user login/signup (Firebase/Auth0).
- **Database**: Store user submissions and progress (PostgreSQL/MongoDB).
- **API**: Create endpoints for fetching workshops and challenges.
- **Payments**: Integrate Stripe/Razorpay for enrollment fees.
