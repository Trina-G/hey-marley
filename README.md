# WriteBot - Problem First AI Capstone

A full-stack application for personalized writing practice and communication skills development. The application features an onboarding workflow that generates customized writing scenarios based on user input.

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
- **OpenAI API Key** (for Langflow integration)
- **Langflow Instance** (with configured flows)

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

#### Configure Langflow Environment Variables

The `.env` file is already included in the repository for this prototype. It contains pre-configured values that should work out of the box.

If you need to customize the configuration, edit `backend/.env`:

- **LANGFLOW_BASE_URL**: Your Langflow instance URL (default: `http://localhost:7860` for local)
- **LANGFLOW_API_KEY**: Your Langflow API key (leave empty if using local Langflow without auth)
- **FLOW_1_ID**: Your scenario generation flow ID (required)
- **FLOW_2_ID**: Your assessment plan flow ID (optional)
- **FLOW_3_ID**: Your exercise generation flow ID (optional)
- **FLOW_4_ID**: Your session feedback flow ID (optional)

**Note:** This is a prototype setup. The `.env` file is committed to the repository for easy setup. For production use, these files should be excluded from version control.

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

### Start the Backend Server

Open a terminal and run:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

You can verify it's running by visiting:
- `http://localhost:8000/` - API information
- `http://localhost:8000/health` - Health check

### Start the Frontend Development Server

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

The Vite dev server includes a proxy configuration, so API calls from the frontend will automatically be forwarded to the backend.

## Security Notes

⚠️ **Prototype Configuration:**

- **This is a prototype setup** - `.env` files are committed to the repository for easy setup
- The repository includes pre-configured API keys and flow IDs for quick testing
- **For production use**, these `.env` files should be excluded from version control
- API keys are stored in `backend/.env` only, never in frontend
- The frontend `.env` file only contains the backend URL



