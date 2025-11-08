# HeyMarley - Problem First AI Capstone

An AI-powered adaptive learning system that provides personalized English reading and writing instruction for students aged 13-16. HeyMarley uses LangFlow to orchestrate AI workflows that generate personalized writing scenarios, exercises, and provide interactive coaching.

## Project Structure

```
Problem First AI Capstone/
├── backend/          # FastAPI backend server
├── frontend/         # React + Vite frontend application
├── docs/            # Documentation and guides
└── PRD/             # Product requirements and specifications
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **LangFlow** (`pip install langflow`)
- **OpenAI API Key** (for LangFlow AI workflows)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Problem First AI Capstone"
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

The `.env` file is already included in the repository for this prototype. It contains pre-configured values that should work out of the box.

If you need to customize the configuration, edit `backend/.env`:

- **LANGFLOW_BASE_URL**: Your LangFlow instance URL (default: `http://localhost:7860` for local)
- **LANGFLOW_API_KEY**: Your LangFlow API key (required for LangFlow v1.5+)
- **FLOW_1_ID**: Scenario generation flow ID - `341a8f52-0532-4767-9185-90a6bf69d91d` (required)
- **FLOW_2_ID**: Assessment plan flow ID (optional, not yet implemented)
- **FLOW_3_ID**: Exercise generation and chat flow ID - `319348b5-d0e0-463e-af41-3d0989b9a4f6` (required)
- **FLOW_4_ID**: Session feedback flow ID (optional, not yet implemented)

**Important Notes:**
- LangFlow v1.5+ requires an API key for authentication
- Get your API key from LangFlow UI: Settings → API Keys
- For local development, you can skip auth by starting LangFlow with: `LANGFLOW_SKIP_AUTH_AUTO_LOGIN=true langflow run`
- This is a prototype setup - the `.env` file is committed to the repository for easy setup
- For production use, these files should be excluded from version control

### 3. Frontend Setup

#### Install Node Dependencies

```bash
cd frontend
npm install
```

#### Configure Frontend Environment

The `.env` file is already included in the repository. It's configured to connect to the backend at `http://localhost:8000`.

If your backend runs on a different port, update `VITE_API_URL` in `frontend/.env`.

## Running the Application

You need to start **three services** in separate terminals:

### 1. Start LangFlow

Open a terminal and run:

```bash
langflow run
```

LangFlow will be available at `http://localhost:7860`

**Important:**
- If you configured a LangFlow API key in `.env`, LangFlow will require authentication
- Alternatively, skip auth by running: `LANGFLOW_SKIP_AUTH_AUTO_LOGIN=true langflow run`
- Load the required flows (Flow 1 and Flow 3) into your LangFlow instance
- Flow IDs are configured in `backend/.env`

### 2. Start the Backend Server

Open a **new terminal** and run:

```bash
cd backend
python3 -m uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

You can verify it's running by visiting:
- `http://localhost:8000/` - API information
- `http://localhost:8000/health` - Health check
- `http://localhost:8000/docs` - Interactive API documentation

### 3. Start the Frontend Development Server

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

Open this URL in your browser to use the application.

## Features

### Current Implementation (Iteration 1)

HeyMarley currently includes:

**1. Personalized Onboarding**
- Student intake form capturing interests, cultural references, and learning preferences
- Form data stored in browser localStorage for persistence

**2. AI-Generated Writing Scenarios**
- LangFlow Flow 1 generates personalized scenarios based on student profile
- Creates 3 customized writing exercises tailored to student interests
- Exercises include focus areas, descriptions, prompts, and guidelines

**3. Interactive Writing Coach**
- LangFlow Flow 3 provides conversational AI coaching
- Students can select any exercise and enter an interactive chat interface
- AI coach provides real-time guidance and feedback
- Session-based conversation memory maintains context
- Personalized responses based on student profile and exercise topic

**4. Visual UI/UX**
- Clean, student-friendly interface with purple/gray theme
- Exercise cards with dynamic icons based on focus areas
- Chat interface with user/assistant avatars
- Exercise content highlighting with visual indicators
- Responsive design for different screen sizes

### Architecture

**Frontend (React + Vite)**
- Component-based architecture
- Session context management for global state
- API service layer for backend communication
- localStorage for form data persistence

**Backend (FastAPI)**
- RESTful API endpoints
- Session management for tracking user journeys
- LangFlow service integration layer
- Exercise parser for structured data extraction

**LangFlow Workflows**
- Flow 1 (Scenario Generation): Intake form → Personalized scenarios + exercises
- Flow 3 (Exercise Generation & Chat): Exercise context + User messages → AI coaching responses
- Uses tweaks parameter for dynamic component configuration
- Session-based conversation memory

## Security Notes

⚠️ **Prototype Configuration:**

- **This is a prototype setup** - `.env` files are committed to the repository for easy setup
- The repository includes pre-configured API keys and flow IDs for quick testing
- **For production use**, these `.env` files should be excluded from version control
- API keys are stored in `backend/.env` only, never in frontend
- The frontend `.env` file only contains the backend URL

## Troubleshooting

**LangFlow 403 Forbidden Error:**
- LangFlow v1.5+ requires authentication by default
- Solution 1: Add `LANGFLOW_API_KEY` to `backend/.env` (get from LangFlow UI → Settings → API Keys)
- Solution 2: Start LangFlow without auth: `LANGFLOW_SKIP_AUTH_AUTO_LOGIN=true langflow run`

**Backend Connection Errors:**
- Verify LangFlow is running at `http://localhost:7860`
- Check that backend is running at `http://localhost:8000`
- Confirm Flow IDs in `.env` match your LangFlow instance

**Frontend Not Loading Scenarios:**
- Open browser console (F12) to check for errors
- Verify all required form fields are filled (name, age group, hardest, audience)
- Check Network tab to see API request/response details



