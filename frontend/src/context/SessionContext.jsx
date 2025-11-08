import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'writebot_form_data';
const SCENARIO_STORAGE_KEY = 'writebot_scenario_data';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  // Load form data from localStorage on mount
  const loadFormDataFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only return if it has required fields (matching new Langflow form structure)
        if (parsed.full_name && parsed.age_group && parsed.hardest && parsed.audience) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
    return null;
  };

  // Don't auto-load scenario data - user must generate it fresh each time
  // This ensures scenario always matches current form data
  const loadScenarioDataFromStorage = () => {
    // Clear any old scenario data on page load to force fresh generation
    try {
      localStorage.removeItem(SCENARIO_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing old scenario data:', error);
    }
    return null;
  };

  const [formData, setFormData] = useState(loadFormDataFromStorage);
  const [scenarioData, setScenarioData] = useState(loadScenarioDataFromStorage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    if (formData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }
  }, [formData]);

  // Save scenarioData to localStorage whenever it changes
  // But clear it when form data changes significantly to ensure fresh generation
  useEffect(() => {
    if (scenarioData) {
      try {
        localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(scenarioData));
      } catch (error) {
        console.error('Error saving scenario data to localStorage:', error);
      }
    }
  }, [scenarioData]);

  // Clear scenario data when form data changes significantly (to ensure scenario matches form)
  useEffect(() => {
    if (formData && scenarioData) {
      // Check if form data has changed significantly
      const formKey = `${formData.full_name}-${formData.age_group}-${formData.interests}-${formData.cultural_refs}-${formData.hardest}-${formData.audience}`;
      const scenarioKey = scenarioData.formKey;
      
      if (scenarioKey && scenarioKey !== formKey) {
        // Form data changed, clear old scenario
        console.log('Form data changed, clearing old scenario');
        setScenarioData(null);
        try {
          localStorage.removeItem(SCENARIO_STORAGE_KEY);
        } catch (error) {
          console.error('Error clearing scenario data:', error);
        }
      } else if (!scenarioKey && scenarioData) {
        // Store form key in scenario for comparison
        setScenarioData({ ...scenarioData, formKey });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const updateFormData = (data) => {
    setFormData(data);
    setError(null);
    // Immediately save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  };

  const updateScenarioData = (data) => {
    setScenarioData(data);
    setError(null);
    // Immediately save to localStorage
    try {
      localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving scenario data to localStorage:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <SessionContext.Provider
      value={{
        formData,
        scenarioData,
        isGenerating,
        error,
        selectedExercise,
        updateFormData,
        updateScenarioData,
        setIsGenerating,
        setError,
        clearError,
        setSelectedExercise,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

