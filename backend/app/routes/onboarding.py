from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List, Optional, Dict
import json
from services.langflow_service import LangFlowService
from app.models.session import create_session, get_session, update_session
from app.utils.exercise_parser import parse_scenario_and_exercises

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])


class IntakeFormData(BaseModel):
    """Form data matching Langflow IntakeForm (Learner Profile) component"""
    full_name: str
    age_group: str = Field(..., description="Age group: 10-13, 14-16, or 17-18")
    interests: str = Field(default="", description="Topics you enjoy (comma-separated)")
    cultural_refs: str = Field(default="", description="Cultural/community refs (comma-separated)")
    hardest: str = Field(default="", description="Which is hardest: Analyzing or Producing")
    audience: str = Field(default="", description="Who is your audience: peers or younger students")
    
    # Optional fields for backward compatibility (if frontend still sends them)
    age: Optional[str] = None
    grade: Optional[str] = None
    primary_language: Optional[str] = None
    q1_response: Optional[str] = None
    q2_response: Optional[str] = None
    q3_response: Optional[str] = None
    q4_response: Optional[str] = None
    struggles: Optional[str] = None
    time_available_per_session: Optional[str] = None
    consent_contact: Optional[str] = None
    
    @field_validator('age_group')
    @classmethod
    def validate_age_group(cls, v):
        """Validate age_group is one of the expected values"""
        valid_groups = ["10-13", "14-16", "17-18"]
        if v not in valid_groups:
            raise ValueError(f"age_group must be one of {valid_groups}, got '{v}'")
        return v
    
    @field_validator('hardest')
    @classmethod
    def validate_hardest(cls, v):
        """Validate hardest is one of the expected values (if provided)"""
        if v and v not in ["Analyzing", "Producing", "Analyzing Text", "Producing Text"]:
            # Allow variations like "Producing Text" and normalize them
            if "Analyzing" in v:
                return "Analyzing"
            elif "Producing" in v:
                return "Producing"
            else:
                raise ValueError(f"hardest must be 'Analyzing' or 'Producing', got '{v}'")
        return v
    
    @field_validator('audience')
    @classmethod
    def validate_audience(cls, v):
        """Validate audience is one of the expected values (if provided)"""
        if v and v not in ["peers", "younger students"]:
            raise ValueError(f"audience must be 'peers' or 'younger students', got '{v}'")
        return v
    
    model_config = ConfigDict(
        # Allow extra fields for flexibility (in case Langflow sends additional data)
        extra="allow"
    )


class ExerciseCard(BaseModel):
    """Structured exercise data for card component"""
    id: int
    title: str
    focus: str
    description: str
    prompt: str
    guidelines: List[str]


class ScenarioResponse(BaseModel):
    """Response model for scenario generation"""
    session_id: str
    scenario: Optional[str] = None
    exercises: Optional[List[ExerciseCard]] = None
    message: Optional[str] = None


@router.post("/scenario", response_model=ScenarioResponse)
async def generate_scenario(form_data: IntakeFormData):
    """
    Generate personalized writing scenario using Langflow Flow 1

    This endpoint:
    1. Creates a session
    2. Calls Langflow Flow 1 (Scenario Generation)
    3. Returns scenario and exercises
    """
    try:
        # Create session
        session = create_session()
        session.form_data = form_data.model_dump()

        # Initialize LangFlow service
        langflow_service = LangFlowService()

        # Call Flow 1: Scenario Generation
        result = langflow_service.generate_scenario(student_data=form_data.model_dump())
        
        # Debug: Log the raw Langflow response
        print(f"DEBUG: Raw Langflow response: {result}")
        print(f"DEBUG: Response type: {type(result)}")
        if isinstance(result, dict):
            print(f"DEBUG: Response keys: {result.keys()}")

        # Parse scenario and exercises using dedicated parser
        scenario, exercises = parse_scenario_and_exercises(result)
        
        # Debug: Log parsing results
        print(f"DEBUG: Parsed scenario: {scenario[:100] if scenario else None}...")
        print(f"DEBUG: Parsed exercises count: {len(exercises) if exercises else 0}")
        if exercises:
            print(f"DEBUG: First exercise: {exercises[0]}")

        # Convert exercise dicts to ExerciseCard objects with validation
        exercise_cards = []
        if exercises:
            for ex in exercises:
                try:
                    # Ensure all required fields are present
                    exercise_card = ExerciseCard(
                        id=ex.get("id", 0),
                        title=ex.get("title", "Untitled Exercise"),
                        focus=ex.get("focus", ""),
                        description=ex.get("description", ""),
                        prompt=ex.get("prompt", ""),
                        guidelines=ex.get("guidelines", [])
                    )
                    exercise_cards.append(exercise_card)
                except Exception as e:
                    # Log parsing error but continue with other exercises
                    print(f"Error parsing exercise: {e}, exercise data: {ex}")
                    continue

        # Update session
        session.scenario = scenario
        session.exercises = exercises  # Store raw exercises in session
        update_session(session.session_id, scenario=scenario, exercises=exercises)

        return ScenarioResponse(
            session_id=session.session_id,
            scenario=scenario,
            exercises=exercise_cards if exercise_cards else None,
            message="Scenario generated successfully"
        )

    except ValueError as e:
        # Flow not configured
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    except Exception as e:
        # LangFlow API errors or other exceptions
        error_msg = str(e)

        # Provide helpful error messages
        if "Connection refused" in error_msg:
            raise HTTPException(
                status_code=503,
                detail="Cannot connect to Langflow. Make sure Langflow is running at http://localhost:7860"
            )
        elif "timed out" in error_msg:
            raise HTTPException(
                status_code=504,
                detail="Langflow request timed out"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {error_msg}"
            )


@router.get("/session/{session_id}")
async def get_session_data(session_id: str):
    """Get session data by session ID"""
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session.to_dict()


class ExerciseStartRequest(BaseModel):
    """Request to start an exercise session"""
    session_id: str
    exercise_title: str
    exercise_description: Optional[str] = None


@router.post("/exercise/start")
async def start_exercise(request: ExerciseStartRequest):
    """
    Start an exercise session using Langflow Flow 3

    This endpoint:
    1. Retrieves session data (form data)
    2. Calls Langflow Flow 3 (Exercise Generation) with form data + exercise topic
    3. Returns the exercise chat interface data
    """
    try:
        # Get session to retrieve form data
        session = get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        if not session.form_data:
            raise HTTPException(status_code=400, detail="No form data found in session")

        # Initialize LangFlow service
        langflow_service = LangFlowService()

        # Create exercise topic string (use title + description if available)
        exercise_topic = request.exercise_title
        if request.exercise_description:
            exercise_topic = f"{request.exercise_title}: {request.exercise_description}"

        # Debug logging
        print(f"DEBUG: Starting exercise for session {request.session_id}")
        print(f"DEBUG: Exercise topic: {exercise_topic}")
        print(f"DEBUG: Student: {session.form_data.get('full_name', 'unknown')}")

        # Call Flow 3: Exercise Generation
        # Pass form data (for Intake Form component) + exercise topic (for Text Input component)
        result = langflow_service.start_exercise(
            student_data=session.form_data,
            exercise_topic=exercise_topic,
            session_id=request.session_id
        )

        # Debug: Log the raw Langflow response
        print(f"DEBUG: Raw exercise flow response: {result}")

        # Return the response (could parse it further if needed)
        return {
            "success": True,
            "session_id": request.session_id,
            "exercise_topic": request.exercise_title,
            "response": result
        }

    except ValueError as e:
        # Flow not configured
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    except Exception as e:
        # LangFlow API errors or other exceptions
        error_msg = str(e)

        # Provide helpful error messages
        if "Connection refused" in error_msg:
            raise HTTPException(
                status_code=503,
                detail="Cannot connect to Langflow. Make sure Langflow is running at http://localhost:7860"
            )
        elif "timed out" in error_msg:
            raise HTTPException(
                status_code=504,
                detail="Langflow request timed out"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {error_msg}"
            )

