import json
from pathlib import Path
from typing import Dict, Optional
import os


class LangflowConfigLoader:
    """Load and manage Langflow configuration from JSON file"""
    
    def __init__(self, config_path: Optional[str] = None):
        if config_path is None:
            # Default to config/langflow_config.json relative to backend directory
            backend_dir = Path(__file__).parent.parent.parent
            config_path = backend_dir / "config" / "langflow_config.json"
        
        self.config_path = Path(config_path)
        self.config: Dict = {}
        self.load_config()
    
    def load_config(self):
        """Load configuration from JSON file at startup"""
        if not self.config_path.exists():
            raise FileNotFoundError(
                f"Langflow config file not found: {self.config_path}\n"
                f"Please create it from the template: {self.config_path.parent / 'langflow_config.json.template'}"
            )
        
        try:
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in config file: {e}")
        except Exception as e:
            raise RuntimeError(f"Error loading config file: {e}")
    
    def get_flow_config(self, flow_name: str) -> Dict:
        """Get configuration for a specific flow (flow_1 or flow_2)"""
        flow_key = f"flow_{flow_name}" if not flow_name.startswith("flow_") else flow_name
        return self.config.get(flow_key, {})
    
    def get_openai_api_key(self, flow_name: str) -> Optional[str]:
        """Get OpenAI API key for a specific flow"""
        flow_config = self.get_flow_config(flow_name)
        return flow_config.get("openai_api_key")
    
    def get_flow_endpoint(self, flow_name: str) -> Optional[str]:
        """Get endpoint URL for a specific flow"""
        flow_config = self.get_flow_config(flow_name)
        endpoint = flow_config.get("endpoint", "")
        flow_id = flow_config.get("flow_id", "")
        
        # Replace {flow_id} placeholder if present
        if "{flow_id}" in endpoint and flow_id:
            endpoint = endpoint.replace("{flow_id}", flow_id)
        
        return endpoint
    
    def get_langflow_base_url(self) -> Optional[str]:
        """Get base URL for Langflow instance"""
        return self.config.get("langflow_base_url")


# Singleton instance
_config_loader: Optional[LangflowConfigLoader] = None


def get_config_loader() -> LangflowConfigLoader:
    """Get singleton config loader instance"""
    global _config_loader
    if _config_loader is None:
        config_path = os.getenv("CONFIG_PATH")
        _config_loader = LangflowConfigLoader(config_path)
    return _config_loader

