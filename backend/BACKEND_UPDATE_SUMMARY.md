# Backend Update Summary

## Changes Made

Updated the backend to match the Langflow IntakeForm (Learner Profile) component structure.

### Updated Files
- `backend/app/routes/onboarding.py` - Updated `IntakeFormData` model

### Field Changes

#### New Required Fields (matching Langflow form):
1. **`age_group`** (str) - Required field with values: "10-13", "14-16", or "17-18"
2. **`hardest`** (str) - Optional field with values: "Analyzing" or "Producing"
3. **`audience`** (str) - Optional field with values: "peers" or "younger students"

#### Fields Kept (matching Langflow form):
1. **`full_name`** (str) - Required
2. **`interests`** (str) - Optional, comma-separated topics
3. **`cultural_refs`** (str) - Optional, comma-separated cultural references

#### Fields Made Optional (for backward compatibility):
- `age` - Optional (replaced by `age_group`)
- `grade` - Optional
- `primary_language` - Optional
- `q1_response`, `q2_response`, `q3_response`, `q4_response` - Optional (replaced by `hardest`)
- `struggles` - Optional
- `time_available_per_session` - Optional
- `consent_contact` - Optional

### Validation Added

1. **`age_group`** validator:
   - Must be one of: "10-13", "14-16", "17-18"
   - Raises ValueError if invalid

2. **`hardest`** validator:
   - Accepts: "Analyzing", "Producing", "Analyzing Text", "Producing Text"
   - Normalizes variations (e.g., "Producing Text" → "Producing")
   - Raises ValueError if invalid

3. **`audience`** validator:
   - Must be one of: "peers", "younger students"
   - Raises ValueError if invalid

### Technical Updates

1. **Pydantic v2 Migration**:
   - Updated `@validator` → `@field_validator` with `@classmethod`
   - Updated `class Config` → `model_config = ConfigDict()`
   - Updated `.dict()` → `.model_dump()`

2. **Flexibility**:
   - Added `extra="allow"` to accept additional fields from Langflow
   - All old fields kept as Optional for backward compatibility

### API Endpoint

The `/api/onboarding/scenario` endpoint now accepts:

```json
{
  "full_name": "Uttarika Shetty",
  "age_group": "14-16",
  "interests": "k-pop, tech",
  "cultural_refs": "New York City, Diwali, Indian",
  "hardest": "Producing",
  "audience": "peers"
}
```

### Testing

To test the updated endpoint:

```bash
curl -X POST http://localhost:8000/api/onboarding/scenario \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Student",
    "age_group": "14-16",
    "interests": "gaming, music",
    "cultural_refs": "New York",
    "hardest": "Producing",
    "audience": "peers"
  }'
```

### Notes

- The backend now matches the Langflow form structure exactly
- Old fields are still accepted for backward compatibility
- Validation ensures data integrity before sending to Langflow
- The form data is sent directly to Langflow Flow 1 without transformation

