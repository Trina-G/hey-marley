# Langflow Form Field Mapping

**Status:** ✅ Backend has been updated to match Langflow form structure

## Current Langflow Form Fields (from image)
1. **Start signal (optional)** - System field
2. **Full name** - "Uttarika Shetty" ✓
3. **Age group (10-13 / 14-16 / 17-18)** - "14-16" ❌
4. **Topics you enjoy (comma-separated)** - "k-pop, tech" ✓
5. **Cultural/community refs (comma-separated)** - "New York City, Diwali, Indian" ✓
6. **Which is hardest? (A: Analyzing / C: Producing)** - "Producing Text" ❌
7. **Who is your audience? (peers / younger students)** - "peers" ❌

## Backend Expected Fields (from IntakeFormData)

The backend sends these fields to Langflow Flow 1:

```python
{
    "full_name": str,                    # ✓ Matches
    "age": str,                          # ❌ Langflow has "age_group" instead
    "grade": str,                        # ❌ Missing in Langflow
    "primary_language": str,             # ❌ Missing in Langflow
    "interests": str,                    # ✓ Matches (as "Topics you enjoy")
    "cultural_refs": str,                # ✓ Matches
    "q1_response": str,                 # ❌ Langflow has single "hardest" field
    "q2_response": str,                 # ❌ Missing in Langflow
    "q3_response": str,                 # ❌ Missing in Langflow
    "q4_response": str,                 # ❌ Missing in Langflow
    "struggles": str,                   # ❌ Missing in Langflow
    "time_available_per_session": str,  # ❌ Missing in Langflow
    "consent_contact": str              # ❌ Missing in Langflow
}
```

## Required Updates to Langflow Form

### Fields to ADD:
1. **grade** (string) - Grade level (6-12)
2. **primary_language** (string) - Default: "English"
3. **q1_response** (string) - Self-assessment question 1 (1-5)
4. **q2_response** (string) - Self-assessment question 2 (1-5)
5. **q3_response** (string) - Self-assessment question 3 (1-5)
6. **q4_response** (string) - Self-assessment question 4 (1-5)
7. **struggles** (string) - What part of writing is challenging
8. **time_available_per_session** (string) - Minutes per session (10/15/20/30)
9. **consent_contact** (string) - "yes" or "no"

### Fields to UPDATE:
1. **age_group** → **age** (string) - Change from dropdown (10-13/14-16/17-18) to numeric string (10-18)

### Fields to REMOVE or REPLACE:
1. **Which is hardest?** - Replace with q1-q4_response fields
2. **Who is your audience?** - Remove (not used by backend)

### Fields that MATCH (keep as-is):
1. **full_name** ✓
2. **Topics you enjoy** → maps to **interests** ✓
3. **Cultural/community refs** → maps to **cultural_refs** ✓

## Field Descriptions for Langflow Form

### q1_response
**Question:** "When you read or watch something, how do you think about what the creator meant?"
- Options: "1", "2", "3", "4", "5"
- 1) I mostly notice what happens in the story/article.
- 2) I can explain what the author is trying to say.
- 3) I compare different viewpoints or choices.
- 4) I look for how techniques influence meaning.
- 5) I critique or connect the work to other contexts.

### q2_response
**Question:** "When you plan your writing, how do you organize your ideas?"
- Options: "1", "2", "3", "4", "5"
- 1) I just start writing whatever comes to mind.
- 2) I try to have a beginning, middle, and end.
- 3) I plan my paragraphs so each has a purpose.
- 4) I use transitions and balance arguments.
- 5) I experiment with structure to create impact.

### q3_response
**Question:** "How do you feel about creating your own pieces?"
- Options: "1", "2", "3", "4", "5"
- 1) I like writing but it's hard to get my ideas out.
- 2) I can share simple ideas clearly.
- 3) People recognize my style or point of view.
- 4) I revise for effect or emotion.
- 5) I can adapt tone and genre professionally.

### q4_response
**Question:** "When you write, how careful are you about word choice and grammar?"
- Options: "1", "2", "3", "4", "5"
- 1) I just write the way I talk.
- 2) I check spelling and grammar sometimes.
- 3) I experiment with words to sound clear or creative.
- 4) I edit carefully so language matches my purpose.
- 5) I play with tone and precision like an expert.

## Updated Langflow Form Structure

The form should have these fields in order:

1. **Start signal (optional)** - System field
2. **full_name** (text) - Required
3. **age** (text/number) - Required, 10-18
4. **grade** (text/number) - Required, 6-12
5. **primary_language** (text) - Optional, default "English"
6. **interests** (text) - Comma-separated topics
7. **cultural_refs** (text) - Comma-separated cultural references
8. **q1_response** (dropdown/text) - Required, 1-5
9. **q2_response** (dropdown/text) - Required, 1-5
10. **q3_response** (dropdown/text) - Required, 1-5
11. **q4_response** (dropdown/text) - Required, 1-5
12. **struggles** (text) - Optional, what's challenging
13. **time_available_per_session** (dropdown/text) - Required, 10/15/20/30
14. **consent_contact** (dropdown/text) - Optional, "yes"/"no", default "no"

## Notes

- The backend sends all fields as strings (even numbers)
- All q1-q4_response fields are required by the backend validation
- The form should accept the exact field names listed above
- Optional fields can be empty strings if not provided

