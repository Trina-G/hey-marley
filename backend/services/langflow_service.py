"""
LangFlow Service - Handles all interactions with LangFlow API
"""
import requests
import os
import uuid
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LangFlowService:
    """Service class for interacting with LangFlow flows"""

    def __init__(self):
        self.base_url = os.getenv('LANGFLOW_BASE_URL', 'http://localhost:7860')
        self.api_key = os.getenv('LANGFLOW_API_KEY')

        # Flow IDs from environment
        self.flows = {
            'scenario_generation': os.getenv('FLOW_1_ID'),
            'assessment_plan': os.getenv('FLOW_2_ID'),
            'exercise_generation': os.getenv('FLOW_3_ID'),
            'session_feedback': os.getenv('FLOW_4_ID')
        }

        # Validate required flows
        if not self.flows['scenario_generation']:
            raise ValueError("FLOW_1_ID is required in .env file")

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        headers = {
            "Content-Type": "application/json"
        }

        # Add API key if available (for LangFlow Cloud or authenticated instances)
        if self.api_key:
            headers["x-api-key"] = self.api_key

        return headers

    def call_flow(
        self,
        flow_name: str,
        input_value: Any,
        session_id: Optional[str] = None,
        output_type: str = "chat",
        input_type: str = "chat",
        tweaks: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Call a LangFlow flow by name

        Args:
            flow_name: Name of the flow (e.g., 'scenario_generation')
            input_value: Input data for the flow (will be converted to JSON string if dict)
            session_id: Optional session ID for conversation tracking
            output_type: Type of output (default: "chat")
            input_type: Type of input (default: "chat")
            tweaks: Optional tweaks to modify component parameters

        Returns:
            Dict containing the flow response

        Raises:
            ValueError: If flow name is not found
            requests.exceptions.RequestException: If API request fails
        """
        import json as json_lib

        # Get flow ID
        flow_id = self.flows.get(flow_name)
        if not flow_id:
            raise ValueError(f"Flow '{flow_name}' not found. Available flows: {list(self.flows.keys())}")

        # Build URL - add ?no_cache=true to prevent response caching
        url = f"{self.base_url}/api/v1/run/{flow_id}"

        # Convert input_value to string if it's a dict
        if isinstance(input_value, dict):
            input_value = json_lib.dumps(input_value)

        # Build payload
        payload = {
            "output_type": output_type,
            "input_type": input_type,
            "input_value": input_value,
            "session_id": session_id or str(uuid.uuid4())
        }

        # Add tweaks if provided (can be used to modify component parameters)
        if tweaks:
            payload["tweaks"] = tweaks

        # Get headers
        headers = self._get_headers()

        try:
            # Send API request with cache control params
            params = {
                "stream": False  # Disable streaming for consistent responses
            }

            response = requests.post(
                url,
                json=payload,
                headers=headers,
                params=params,
                timeout=30  # 30 second timeout
            )
            response.raise_for_status()

            # Parse and return response
            return response.json()

        except requests.exceptions.Timeout:
            raise Exception(f"LangFlow request timed out for flow '{flow_name}'")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error calling LangFlow flow '{flow_name}': {str(e)}")
        except ValueError as e:
            raise Exception(f"Error parsing LangFlow response for flow '{flow_name}': {str(e)}")

    def generate_scenario(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate writing scenario for student (Flow 1)

        Args:
            student_data: Dictionary containing student information

        Returns:
            Generated scenario and exercise prompts
        """
        import time

        # Extract form fields for LangFlow Intake Form component
        # Pass individual fields as tweaks with correct component ID structure
        # Component ID: IntakeFormLearnerProfile-lSOHp (from flow 341a8f52-0532-4767-9185-90a6bf69d91d)
        intake_form_tweaks = {
            "IntakeFormLearnerProfile-lSOHp": {
                "full_name": student_data.get("full_name", ""),
                "age_group": student_data.get("age_group", ""),
                "interests": student_data.get("interests", ""),
                "cultural_refs": student_data.get("cultural_refs", ""),
                "writing_challenge": student_data.get("hardest", ""),  # Map 'hardest' to 'writing_challenge'
                "audience": student_data.get("audience", "")
            }
        }

        # Debug logging
        print(f"DEBUG LANGFLOW: Sending intake form data via tweaks:")
        print(f"  full_name: {student_data.get('full_name', '')}")
        print(f"  age_group: {student_data.get('age_group', '')}")
        print(f"  interests: {student_data.get('interests', '')}")
        print(f"  cultural_refs: {student_data.get('cultural_refs', '')}")
        print(f"  writing_challenge: {student_data.get('hardest', '')}")
        print(f"  audience: {student_data.get('audience', '')}")

        # Use a simple trigger message as input_value
        # The actual form data is passed via tweaks to override the Intake Form component fields
        trigger_message = "lets start"

        result = self.call_flow(
            flow_name='scenario_generation',
            input_value=trigger_message,
            tweaks=intake_form_tweaks
        )

        print(f"DEBUG LANGFLOW: Received response keys: {result.keys() if isinstance(result, dict) else type(result)}")

        return result

    def start_exercise(
        self,
        student_data: Dict[str, Any],
        exercise_topic: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Start an exercise session (Flow: 319348b5-d0e0-463e-af41-3d0989b9a4f6)

        Args:
            student_data: Dictionary containing student information (for Intake Form)
            exercise_topic: The exercise topic/title (for Text Input)
            session_id: Optional session ID for conversation tracking

        Returns:
            Exercise session response
        """
        # Pass form data to IntakeFormLearnerProfile component via tweaks
        # Pass exercise topic to TextInput component via tweaks
        # Component IDs from flow 319348b5-d0e0-463e-af41-3d0989b9a4f6
        exercise_tweaks = {
            "IntakeFormLearnerProfile-OnNnU": {
                "full_name": student_data.get("full_name", ""),
                "age_group": student_data.get("age_group", ""),
                "interests": student_data.get("interests", ""),
                "cultural_refs": student_data.get("cultural_refs", ""),
                "writing_challenge": student_data.get("hardest", ""),
                "audience": student_data.get("audience", "")
            },
            "TextInput-1AsYl": {
                "input_value": exercise_topic
            }
        }

        # Debug logging
        print(f"DEBUG LANGFLOW EXERCISE: Starting exercise session")
        print(f"  Exercise topic: {exercise_topic}")
        print(f"  Student: {student_data.get('full_name', '')}")

        # Use exercise topic as input_value trigger
        result = self.call_flow(
            flow_name='exercise_generation',
            input_value=exercise_topic,
            session_id=session_id,
            tweaks=exercise_tweaks
        )

        print(f"DEBUG LANGFLOW EXERCISE: Received response keys: {result.keys() if isinstance(result, dict) else type(result)}")

        return result

    def continue_exercise(
        self,
        student_data: Dict[str, Any],
        user_message: str,
        session_id: str
    ) -> Dict[str, Any]:
        """
        Continue an exercise conversation (Flow: 319348b5-d0e0-463e-af41-3d0989b9a4f6)

        Args:
            student_data: Dictionary containing student information (for Intake Form)
            user_message: The user's message in the conversation
            session_id: Session ID to maintain conversation context

        Returns:
            AI coach response
        """
        # Pass form data to IntakeFormLearnerProfile component via tweaks
        # The user message is passed as input_value
        # Component IDs from flow 319348b5-d0e0-463e-af41-3d0989b9a4f6
        exercise_tweaks = {
            "IntakeFormLearnerProfile-OnNnU": {
                "full_name": student_data.get("full_name", ""),
                "age_group": student_data.get("age_group", ""),
                "interests": student_data.get("interests", ""),
                "cultural_refs": student_data.get("cultural_refs", ""),
                "writing_challenge": student_data.get("hardest", ""),
                "audience": student_data.get("audience", "")
            }
        }

        # Debug logging
        print(f"DEBUG LANGFLOW CHAT: Continuing exercise conversation")
        print(f"  User message: {user_message}")
        print(f"  Session ID: {session_id}")
        print(f"  Student: {student_data.get('full_name', '')}")

        # Use the same session_id to maintain conversation history
        result = self.call_flow(
            flow_name='exercise_generation',
            input_value=user_message,
            session_id=session_id,
            tweaks=exercise_tweaks
        )

        print(f"DEBUG LANGFLOW CHAT: Received response keys: {result.keys() if isinstance(result, dict) else type(result)}")

        return result

    def assess_and_plan(self, assessment_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess student writing and generate learning plan (Flow 2)

        Args:
            assessment_data: Dictionary containing student responses

        Returns:
            Assessment results and learning plan
        """
        return self.call_flow(
            flow_name='assessment_plan',
            input_value=assessment_data
        )

    def generate_exercise(
        self,
        student_id: str,
        message: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate conversational exercise (Flow 3 - Iteration 2)

        Args:
            student_id: Student identifier
            message: Student's message in the conversation
            session_id: Session ID for conversation continuity

        Returns:
            Exercise response
        """
        if not self.flows['exercise_generation']:
            raise ValueError("FLOW_3_ID not configured. Required for Iteration 2.")

        return self.call_flow(
            flow_name='exercise_generation',
            input_value=message,
            session_id=session_id or student_id
        )

    def session_feedback(
        self,
        conversation_history: list,
        student_id: str
    ) -> Dict[str, Any]:
        """
        Generate session feedback and update progress (Flow 4 - Iteration 2)

        Args:
            conversation_history: List of conversation turns
            student_id: Student identifier

        Returns:
            Session feedback and progress update
        """
        if not self.flows['session_feedback']:
            raise ValueError("FLOW_4_ID not configured. Required for Iteration 2.")

        return self.call_flow(
            flow_name='session_feedback',
            input_value={
                'conversation': conversation_history,
                'student_id': student_id
            }
        )


# Example usage
if __name__ == "__main__":
    # Initialize service
    service = LangFlowService()

    # Test Flow 1
    try:
        result = service.call_flow(
            flow_name='scenario_generation',
            input_value="hello world!"
        )
        print("Flow 1 Result:", result)
    except Exception as e:
        print(f"Error: {e}")
