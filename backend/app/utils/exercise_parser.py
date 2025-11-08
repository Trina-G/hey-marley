"""
Exercise Parser - Extracts structured exercise data from LangFlow responses
"""
import re
from typing import List, Dict, Optional


def parse_exercises_from_text(text: str) -> List[Dict[str, str]]:
    """
    Parse exercises from LangFlow text response into structured card data

    Supports multiple formats:
    1. ### Exercise 1: **Title**
    2. **Exercise 1: Title**
    3. Exercise 1: Title

    Args:
        text: Raw text from LangFlow containing exercises

    Returns:
        List of exercise dictionaries with structure:
        {
            "id": 1,
            "title": "Exercise title",
            "focus": "Writing focus area",
            "description": "Exercise description",
            "prompt": "Writing prompt",
            "guidelines": ["guideline 1", "guideline 2", ...]
        }
    """
    exercises = []

    # Try multiple exercise marker patterns
    # Pattern 1: ### Exercise 1: **Title**
    pattern1 = r'###\s*Exercise\s+(\d+):\s*\*\*([^*]+)\*\*'
    # Pattern 2: **Exercise 1: Title**
    pattern2 = r'\*\*Exercise\s+(\d+):\s*([^*]+)\*\*'
    # Pattern 3: Exercise 1: Title (without markdown)
    pattern3 = r'(?:^|\n)\s*Exercise\s+(\d+):\s*([^\n*]+)'
    
    exercise_pattern = pattern1
    exercise_splits = re.split(exercise_pattern, text)
    
    # If pattern 1 didn't match, try pattern 2
    if len(exercise_splits) == 1:
        exercise_pattern = pattern2
        exercise_splits = re.split(exercise_pattern, text)
    
    # If pattern 2 didn't match, try pattern 3
    if len(exercise_splits) == 1:
        exercise_pattern = pattern3
        exercise_splits = re.split(exercise_pattern, text, flags=re.MULTILINE)

    # Process matches: [before_match, id1, title1, content1, id2, title2, content2, ...]
    for i in range(1, len(exercise_splits), 3):
        if i + 2 > len(exercise_splits):
            break

        exercise_id = int(exercise_splits[i])
        title = exercise_splits[i + 1].strip()
        content = exercise_splits[i + 2].strip() if i + 2 < len(exercise_splits) else ""

        # Extract focus/type area (multiple formats)
        focus_match = re.search(r'\*\*Focus:\*\*\s*([^\n]+)', content)
        if not focus_match:
            focus_match = re.search(r'\*\*Type:\*\*\s*([^\n]+)', content)
        if not focus_match:
            focus_match = re.search(r'Type:\s*([^\n]+)', content)
        focus = focus_match.group(1).strip() if focus_match else ""

        # Try to extract prompt (multiple possible formats)
        prompt = ""
        # Format 1: **Prompts:** followed by bullet points
        prompts_section_match = re.search(r'\*\*Prompts?:\*\*\s*\n((?:[-•*]\s*[^\n]+\n?)+)', content, re.MULTILINE | re.IGNORECASE)
        if prompts_section_match:
            prompts_text = prompts_section_match.group(1)
            # Extract all bullet points
            prompt_items = re.findall(r'[-•*]\s*([^\n]+)', prompts_text)
            if prompt_items:
                # Combine all prompt items
                prompt = '\n'.join([f"• {item.strip()}" for item in prompt_items])
        
        # Format 2: **Your Prompt:** or **Prompt:** (single prompt)
        if not prompt:
            prompt_match = re.search(r'\*\*(?:Your )?Prompt:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)', content, re.MULTILINE)
            if prompt_match:
                prompt = prompt_match.group(1).strip()
        
        # Format 3: Look for bullet points in content (if no Prompts: header)
        if not prompt:
            # Find bullet points that come after Type/Focus
            if focus_match:
                content_after_focus = content[focus_match.end():]
                prompt_items = re.findall(r'[-•*]\s*([^\n]+)', content_after_focus)
                if prompt_items:
                    prompt = '\n'.join([f"• {item.strip()}" for item in prompt_items[:5]])  # Limit to first 5
        
        # Format 4: Look for last paragraph after description
        if not prompt:
            paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
            if len(paragraphs) >= 2:
                # Last paragraph is likely the prompt
                prompt = paragraphs[-1]

        # Extract description (text between title and prompts/guidelines)
        description = ""
        # Find where description starts (after title, focus/type)
        desc_start = 0
        if focus_match:
            desc_start = focus_match.end()
        
        # Find where description ends (before prompts or guidelines)
        desc_end = len(content)
        
        # Check for prompts section first
        prompts_section = re.search(r'\*\*Prompts?:\*\*', content, re.IGNORECASE)
        if prompts_section and prompts_section.start() < desc_end:
            desc_end = prompts_section.start()
        
        # Check for guidelines section
        guidelines_match = re.search(r'\*\*What to include:\*\*', content)
        if guidelines_match and guidelines_match.start() < desc_end:
            desc_end = guidelines_match.start()
        
        if prompt_match and prompt_match.start() < desc_end:
            desc_end = prompt_match.start()

        if desc_start < desc_end:
            description = content[desc_start:desc_end].strip()
            # Clean up extra newlines and separators
            description = re.sub(r'\n\s*\n+', ' ', description)
            description = re.sub(r'^---+\s*', '', description)
            description = re.sub(r'^\*\s+', '', description, flags=re.MULTILINE)  # Remove bullet points
            description = description.strip()
        
        # If no description found, use the content up to prompts
        if not description and content:
            # Try to get text before first bullet point or prompt marker
            first_bullet = re.search(r'[-•]\s*\*\*', content)
            if first_bullet:
                description = content[:first_bullet.start()].strip()
            elif prompts_section:
                description = content[:prompts_section.start()].strip()

        # Extract guidelines (What to include)
        guidelines = []
        guidelines_match = re.search(
            r'\*\*What to include:\*\*\s*\n((?:[-•]\s*[^\n]+\n?)+)',
            content,
            re.MULTILINE
        )
        if guidelines_match:
            guidelines_text = guidelines_match.group(1)
            # Extract bullet points
            guideline_items = re.findall(r'[-•]\s*([^\n]+)', guidelines_text)
            guidelines = [g.strip() for g in guideline_items if g.strip()]

        # Build exercise object
        exercise = {
            "id": exercise_id,
            "title": title,
            "focus": focus,
            "description": description,
            "prompt": prompt,
            "guidelines": guidelines
        }

        exercises.append(exercise)

    return exercises


def parse_scenario_and_exercises(langflow_response: Dict) -> tuple[Optional[str], List[Dict[str, str]]]:
    """
    Parse LangFlow response to extract scenario greeting and structured exercises

    Args:
        langflow_response: Raw response from LangFlow API

    Returns:
        Tuple of (scenario_text, exercises_list)
    """
    scenario = None
    exercises = []

    # Debug: Log the response structure
    print(f"DEBUG PARSER: Response type: {type(langflow_response)}")
    if isinstance(langflow_response, dict):
        print(f"DEBUG PARSER: Top-level keys: {list(langflow_response.keys())}")

    # Navigate LangFlow response structure - try multiple possible formats
    if isinstance(langflow_response, dict):
        # Try format 1: outputs array structure
        outputs = langflow_response.get("outputs", [])
        if outputs:
            first_output = outputs[0] if outputs else {}
            output_data = first_output.get("outputs", [{}])[0] if isinstance(first_output.get("outputs"), list) else {}
            message = output_data.get("results", {}).get("message", {})
            text = message.get("text") or message.get("content") or str(message)
        else:
            # Try format 2: Direct text/content field
            text = langflow_response.get("text") or langflow_response.get("content") or langflow_response.get("message", "")
            if isinstance(text, dict):
                text = text.get("text") or text.get("content") or str(text)
        
        # If still no text, try to stringify the whole response
        if not text or text == "{}":
            text = str(langflow_response)

        if text and text != "{}":
            print(f"DEBUG PARSER: Extracted text length: {len(text)}")
            print(f"DEBUG PARSER: Text preview: {text[:200]}...")
            
            # Split scenario greeting from exercises
            # Try multiple exercise marker patterns
            exercise_start = None
            patterns_to_try = [
                r'###\s*Exercise\s+\d+',  # ### Exercise 1
                r'\*\*Exercise\s+\d+:',   # **Exercise 1:**
                r'(?:^|\n)\s*Exercise\s+\d+:',  # Exercise 1: (start of line)
            ]
            
            for pattern in patterns_to_try:
                exercise_start = re.search(pattern, text, re.MULTILINE)
                if exercise_start:
                    break
            
            if exercise_start:
                scenario = text[:exercise_start.start()].strip()
                exercises_text = text[exercise_start.start():].strip()
                print(f"DEBUG PARSER: Found exercise marker at position {exercise_start.start()}, parsing exercises...")
                exercises = parse_exercises_from_text(exercises_text)
                print(f"DEBUG PARSER: Parsed {len(exercises)} exercises")
                if exercises:
                    print(f"DEBUG PARSER: Exercise titles: {[ex.get('title', 'N/A') for ex in exercises]}")
            else:
                # No exercises found, entire text is scenario
                print(f"DEBUG PARSER: No exercise markers found, treating entire text as scenario")
                # Try to extract exercises from within the scenario text anyway
                # Sometimes exercises are embedded in the scenario
                exercises = parse_exercises_from_text(text)
                if exercises:
                    print(f"DEBUG PARSER: Found {len(exercises)} exercises embedded in scenario")
                    # Keep scenario as is, exercises are already extracted
                scenario = text
        else:
            print(f"DEBUG PARSER: No text found in response")
            scenario = str(langflow_response)

    return scenario, exercises
