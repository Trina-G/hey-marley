# WriteBot Backend

FastAPI backend server for the WriteBot onboarding workflow.

## Setup

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Create Langflow config file:**
```bash
# Copy the template
cp config/langflow_config.json.template config/langflow_config.json

# Edit config/langflow_config.json and add your:
# - Langflow endpoint URLs
# - Flow IDs
# - OpenAI API key
```

3. **Set environment variables (optional):**
```bash
export PORT=8000
export CONFIG_PATH=config/langflow_config.json
```

4. **Run the server:**
```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000

# Or use Python directly
python -m app.main
```

## API Endpoints

### POST `/api/onboarding/scenario`
Generate personalized writing scenario using Langflow Flow 1.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "age": "14",
  "grade": "9",
  "primary_language": "English",
  "interests": "football, stories, art",
  "cultural_refs": "IPL, Diwali",
  "q1_response": "3",
  "q2_response": "3",
  "q3_response": "3",
  "q4_response": "3",
  "struggles": "Organizing ideas",
  "time_available_per_session": "15",
  "consent_contact": "no"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "scenario": "Personalized scenario text...",
  "exercises": ["Exercise 1", "Exercise 2", "Exercise 3"],
  "message": "Scenario generated successfully"
}
```

### GET `/api/onboarding/session/{session_id}`
Retrieve session data by session ID.

## Configuration

The backend loads Langflow configuration from `config/langflow_config.json`. See `config/langflow_config.json.template` for the structure.

**Important:** Never commit `config/langflow_config.json` to version control (it's in `.gitignore`).

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── routes/
│   │   └── onboarding.py   # Onboarding endpoints
│   ├── services/
│   │   └── config_loader.py  # Langflow config loader
│   └── models/
│       └── session.py      # Session data models
├── config/
│   └── langflow_config.json.template
├── requirements.txt
└── README.md
```

