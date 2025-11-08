# Environment Configuration Setup

## Frontend Environment Variables

### Create `.env` file

Create a `.env` file in the `frontend/` directory with the following structure:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Note: OpenAI API keys should be stored in the backend configuration file
# (backend/config/langflow_config.json), not in the frontend .env file
# This ensures API keys are never exposed to the client-side code
```

### Usage

- Variables prefixed with `VITE_` are exposed to the frontend code
- Access them using: `import.meta.env.VITE_API_URL`
- The `.env` file is automatically loaded by Vite
- Never commit `.env` files to version control

## Backend Environment Variables (When Implemented)

### Backend `.env` file structure:

```env
# Backend Server Configuration
PORT=8000

# Langflow Configuration File Path
CONFIG_PATH=config/langflow_config.json
```

### Backend Langflow Config File

The OpenAI API key should be stored in `backend/config/langflow_config.json`:

```json
{
  "flow_1": {
    "name": "scenario_generation",
    "endpoint": "https://langflow-instance.com/api/v1/run/{flow_id}",
    "flow_id": "scenario-generation-flow-id",
    "api_key": "your_langflow_api_key_here",
    "openai_api_key": "sk-proj-your-openai-api-key-here",
    "input_type": "json",
    "output_type": "json"
  },
  "flow_2": {
    "name": "assessment_plan",
    "endpoint": "https://langflow-instance.com/api/v1/run/{flow_id}",
    "flow_id": "assessment-plan-flow-id",
    "api_key": "your_langflow_api_key_here",
    "openai_api_key": "sk-proj-your-openai-api-key-here",
    "input_type": "json",
    "output_type": "json"
  },
  "langflow_base_url": "https://langflow-instance.com"
}
```

## Security Best Practices

1. ✅ **DO**: Store API keys in backend configuration files
2. ✅ **DO**: Add `.env` and `config/langflow_config.json` to `.gitignore`
3. ✅ **DO**: Use `.env.example` files with placeholder values
4. ❌ **DON'T**: Store API keys in frontend `.env` files
5. ❌ **DON'T**: Commit `.env` files or config files with real keys to git
6. ❌ **DON'T**: Expose API keys in client-side code

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your configuration values

3. For backend (when implemented):
   - Create `backend/config/langflow_config.json`
   - Add your OpenAI API key to the config file
   - Ensure the file is in `.gitignore`

