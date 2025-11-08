# Environment Setup Guide

## Quick Setup Instructions

### 1. Frontend Environment Variables

Create `frontend/.env` file with the following content:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Note: OpenAI API keys should NOT be stored here
# API keys must be stored in backend configuration only
```

**To create the file:**
```bash
cd frontend
cat > .env << 'EOF'
# Backend API URL
VITE_API_URL=http://localhost:8000

# Note: OpenAI API keys should NOT be stored here
# API keys must be stored in backend configuration only
EOF
```

### 2. Backend Environment Variables (Optional)

Create `backend/.env` file:

```env
# Backend Server Configuration
PORT=8000

# Langflow Configuration File Path
CONFIG_PATH=config/langflow_config.json
```

### 3. Backend Langflow Configuration (REQUIRED)

Create `backend/config/langflow_config.json` file:

```json
{
  "flow_1": {
    "name": "scenario_generation",
    "endpoint": "https://langflow-instance.com/api/v1/run/{flow_id}",
    "flow_id": "scenario-generation-flow-id",
    "api_key": "your_langflow_api_key_here",
    "openai_api_key": "sk-proj-YOUR-OPENAI-API-KEY-HERE",
    "input_type": "json",
    "output_type": "json"
  },
  "flow_2": {
    "name": "assessment_plan",
    "endpoint": "https://langflow-instance.com/api/v1/run/{flow_id}",
    "flow_id": "assessment-plan-flow-id",
    "api_key": "your_langflow_api_key_here",
    "openai_api_key": "sk-proj-YOUR-OPENAI-API-KEY-HERE",
    "input_type": "json",
    "output_type": "json"
  },
  "langflow_base_url": "https://langflow-instance.com"
}
```

**Important:** Replace `sk-proj-YOUR-OPENAI-API-KEY-HERE` with your actual OpenAI API key.

### 4. Update .gitignore

Ensure these files are in `.gitignore`:

```
# Frontend
frontend/.env
frontend/.env.local
frontend/.env.production

# Backend
backend/.env
backend/config/langflow_config.json
```

## File Structure After Setup

```
app-prototype/
├── frontend/
│   ├── .env                    # ← Create this (not in git)
│   └── .env.example            # Template (safe to commit)
├── backend/
│   ├── .env                    # ← Create this (optional, not in git)
│   ├── config/
│   │   └── langflow_config.json # ← Create this (not in git)
│   └── .gitignore              # Should exclude .env and config/*.json
```

## Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] `config/langflow_config.json` is in `.gitignore`
- [ ] OpenAI API key is only in backend config file
- [ ] No API keys in frontend code or `.env` files
- [ ] Template files (`.template` or `.example`) don't contain real keys

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-` or `sk-`)
5. Paste it into `backend/config/langflow_config.json` replacing `sk-proj-YOUR-OPENAI-API-KEY-HERE`

## Verification

After setup, verify:
- Frontend can connect to backend (check browser console)
- Backend can load config file (check backend logs)
- API keys are not visible in frontend code (check browser DevTools Network tab)

