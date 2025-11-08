# How to Find Your Langflow Flow IDs

## Method 1: From Langflow Dashboard URL

1. Open your Langflow dashboard (usually `http://localhost:7860`)
2. Open the flow you want to use (Flow 1 for scenario generation)
3. Look at the browser URL - it should look like:
   ```
   http://localhost:7860/flow/{flow-id}
   ```
4. Copy the `{flow-id}` part - that's your Flow ID

## Method 2: From Langflow API

1. Make sure Langflow is running
2. Call the API to list all flows:
   ```bash
   curl http://localhost:7860/api/v1/flows
   ```
3. Find your flow in the response and copy its `id` field

## Method 3: From Flow Settings

1. In Langflow dashboard, open your flow
2. Click on the flow settings/info icon
3. Look for "Flow ID" or "ID" field
4. Copy that value

## Update Config File

Once you have your Flow IDs:

1. Open `backend/config/langflow_config.json`
2. Replace `YOUR_FLOW_1_ID_HERE` with your scenario generation flow ID
3. Replace `YOUR_FLOW_2_ID_HERE` with your assessment plan flow ID
4. Save the file
5. The backend will automatically reload (if using `--reload`)

## Verify Langflow is Running

Check if Langflow is accessible:
```bash
curl http://localhost:7860/health
```

Or open in browser: `http://localhost:7860`

## Common Langflow Ports

- Default: `7860`
- Alternative: `7861`, `8080`, or check your Langflow startup logs

If your Langflow runs on a different port, update the `endpoint` and `langflow_base_url` in the config file.

