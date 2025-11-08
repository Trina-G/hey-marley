from typing import Dict, Optional
from datetime import datetime
import uuid


class Session:
    """Session data model for storing user onboarding data"""
    
    def __init__(self, session_id: Optional[str] = None):
        self.session_id = session_id or str(uuid.uuid4())
        self.created_at = datetime.now()
        self.form_data: Optional[Dict] = None
        self.scenario: Optional[str] = None
        self.exercises: Optional[list] = None
        self.assessment: Optional[Dict] = None
        self.focus_areas: Optional[list] = None
    
    def to_dict(self) -> Dict:
        """Convert session to dictionary"""
        return {
            "session_id": self.session_id,
            "created_at": self.created_at.isoformat(),
            "form_data": self.form_data,
            "scenario": self.scenario,
            "exercises": self.exercises,
            "assessment": self.assessment,
            "focus_areas": self.focus_areas,
        }


# In-memory session storage (for prototype)
_sessions: Dict[str, Session] = {}


def get_session(session_id: str) -> Optional[Session]:
    """Get session by ID"""
    return _sessions.get(session_id)


def create_session() -> Session:
    """Create a new session"""
    session = Session()
    _sessions[session.session_id] = session
    return session


def update_session(session_id: str, **kwargs) -> Optional[Session]:
    """Update session data"""
    session = _sessions.get(session_id)
    if session:
        for key, value in kwargs.items():
            if hasattr(session, key):
                setattr(session, key, value)
    return session

