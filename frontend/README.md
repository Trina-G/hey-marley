# WriteBot Frontend

React frontend application for the WriteBot onboarding workflow.

## Features

- Two-column layout with intake form and welcome screen
- Form validation matching Langflow IntakeFormMessageOnly component
- Responsive design with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── IntakeForm.jsx      # Main intake form component
│   │   └── WelcomeScreen.jsx   # Welcome screen component
│   ├── services/
│   │   └── api.js              # API client
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind imports
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Form Fields

The form matches the Langflow `IntakeFormMessageOnly` component structure:

- **Basic Info:** full_name, age, grade, primary_language
- **Interests:** interests, cultural_refs
- **Self-Assessment:** q1_response, q2_response, q3_response, q4_response (1-5 scale)
- **Reflection:** struggles, time_available_per_session, consent_contact

