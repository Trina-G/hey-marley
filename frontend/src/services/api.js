import axios from 'axios';

// TEST: This should appear in console immediately when module loads
console.log('🔵 API MODULE LOADED - Transformation code is active!');

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for LLM calls
});

/**
 * Prepare form data for backend/Langflow API
 * Form now matches backend structure, so minimal transformation needed
 * @param {Object} formData - Frontend form data (already matches backend structure)
 * @returns {Object} Data ready for backend API
 */
const transformFormData = (formData) => {
  console.log('🔄 Preparing form data for backend - Input:', formData);
  
  // Form now directly provides the fields backend expects
  const transformed = {
    full_name: formData.full_name || '',
    age_group: formData.age_group || '',
    interests: formData.interests || '',
    cultural_refs: formData.cultural_refs || '',
    hardest: formData.hardest || '',
    audience: formData.audience || '',
  };

  console.log('✅ Data prepared for backend - Output:', transformed);
  return transformed;
};

/**
 * Get user-friendly error message from axios error
 */
const getErrorMessage = (error) => {
  if (!error.response) {
    // Network error or timeout
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. The server may be processing your request. Please try again.';
    }
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return 'Network error: Unable to connect to the server. Please check if the backend is running on ' + API_BASE_URL;
    }
    return `Network error: ${error.message}`;
  }

  // Server responded with error status
  const status = error.response.status;
  const data = error.response.data;

  if (status === 404) {
    return 'Endpoint not found. Please check if the backend API is running.';
  }
  if (status === 500) {
    return 'Server error: ' + (data?.message || 'An internal server error occurred');
  }
  if (status === 503) {
    return 'Service unavailable: The Langflow service may be down or overloaded.';
  }

  return data?.message || data?.error || `Error ${status}: ${error.message}`;
};

/**
 * Submit intake form data to backend
 * @param {Object} formData - Form data matching Langflow IntakeFormMessageOnly component structure
 * @returns {Promise} API response
 */
export const submitIntakeForm = async (formData) => {
  try {
    // Transform form data to match backend structure
    const transformedData = transformFormData(formData);
    const response = await api.post('/api/onboarding/scenario', transformedData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      details: error.response?.data,
    };
  }
};

/**
 * Trigger Langflow pipeline execution for scenario generation
 * @param {Object} formData - Form data matching Langflow IntakeFormMessageOnly component structure
 * @param {number} retries - Number of retry attempts (default: 0)
 * @returns {Promise} API response with scenario and exercises
 */
export const generateScenario = async (formData, retries = 0) => {
  console.log('🚀 GENERATE SCENARIO CALLED with:', formData);
  try {
    // Transform form data to match backend structure
    const transformedData = transformFormData(formData);
    console.log('📤 Sending to backend:', transformedData);
    const response = await api.post('/api/onboarding/scenario', transformedData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error generating scenario:', error);
    
    // Retry logic for network errors
    if (retries < 2 && (!error.response || error.response.status >= 500)) {
      console.log(`Retrying request (attempt ${retries + 1}/2)...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
      return generateScenario(formData, retries + 1);
    }

    return {
      success: false,
      error: getErrorMessage(error),
      details: error.response?.data,
      isNetworkError: !error.response,
    };
  }
};

/**
 * Start an exercise session
 * @param {string} sessionId - Session ID from scenario generation
 * @param {string} exerciseTitle - Title of the selected exercise
 * @param {string} exerciseDescription - Optional description of the exercise
 * @returns {Promise} API response
 */
export const startExercise = async (sessionId, exerciseTitle, exerciseDescription = null) => {
  console.log('🎯 START EXERCISE CALLED with:', { sessionId, exerciseTitle });
  try {
    const response = await api.post('/api/onboarding/exercise/start', {
      session_id: sessionId,
      exercise_title: exerciseTitle,
      exercise_description: exerciseDescription
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error starting exercise:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      details: error.response?.data,
    };
  }
};

/**
 * Send a chat message during an exercise
 * @param {string} sessionId - Session ID from exercise start
 * @param {string} message - User's message
 * @returns {Promise} API response with AI coach's reply
 */
export const sendExerciseMessage = async (sessionId, message) => {
  console.log('💬 SEND MESSAGE CALLED with:', { sessionId, message });
  try {
    const response = await api.post('/api/onboarding/exercise/chat', {
      session_id: sessionId,
      message: message
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      details: error.response?.data,
    };
  }
};

export default api;

