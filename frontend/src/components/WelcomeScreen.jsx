import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { generateScenario, startExercise } from '../services/api';
import ChatInterface from './ChatInterface';
import { FaPen, FaBook, FaLightbulb, FaEdit, FaFileAlt, FaMagic, FaStar, FaRocket, FaFeather, FaGraduationCap } from 'react-icons/fa';

const WelcomeScreen = () => {
  const {
    formData,
    scenarioData,
    isGenerating,
    error,
    selectedExercise,
    updateFormData,
    updateScenarioData,
    setIsGenerating,
    setError,
    setSelectedExercise,
  } = useSession();

  const [isStartingExercise, setIsStartingExercise] = useState(false);

  const handleExerciseClick = async (exercise) => {
    console.log('🎯 Exercise clicked:', exercise.title);

    // Check if we have a session_id
    if (!scenarioData?.session_id) {
      setError('No session found. Please generate a scenario first.');
      return;
    }

    setIsStartingExercise(true);
    setError(null);

    try {
      // Call the exercise start API
      const result = await startExercise(
        scenarioData.session_id,
        exercise.title,
        exercise.description
      );

      console.log('📥 Exercise start response:', result);

      if (result.success) {
        // Set the selected exercise with the API response
        setSelectedExercise({
          ...exercise,
          sessionResponse: result.data
        });
      } else {
        setError(result.error || 'Failed to start exercise');
      }
    } catch (err) {
      console.error('Error starting exercise:', err);
      setError('An unexpected error occurred while starting the exercise');
    } finally {
      setIsStartingExercise(false);
    }
  };

  const handleGenerateScenario = async () => {
    // Try to get latest form data from localStorage as fallback
    let latestFormData = formData;
    if (!latestFormData) {
      try {
        const saved = localStorage.getItem('writebot_form_data');
        if (saved) {
          latestFormData = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Error loading form data from localStorage:', error);
      }
    }

    if (!latestFormData) {
      setError('Please fill out the form first');
      return;
    }

    // Validate required fields matching Langflow form
    if (!latestFormData.full_name || !latestFormData.age_group || !latestFormData.hardest || !latestFormData.audience) {
      setError('Please fill out all required fields (name, age group, hardest, audience)');
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Clear old scenario data before generating new one
    updateScenarioData(null);
    // Also clear from localStorage to ensure fresh generation
    try {
      localStorage.removeItem('writebot_scenario_data');
    } catch (error) {
      console.error('Error clearing scenario from localStorage:', error);
    }

    // Update context with latest data before generating
    updateFormData(latestFormData);

    try {
      console.log('🔄 Calling generateScenario API with:', latestFormData);
      const result = await generateScenario(latestFormData);
      console.log('📥 API Response:', result);
      if (result.success) {
        console.log('✅ Scenario data received:', result.data);
        // Add form key to scenario data for comparison
        const formKey = `${latestFormData.full_name}-${latestFormData.age_group}-${latestFormData.interests}-${latestFormData.cultural_refs}-${latestFormData.hardest}-${latestFormData.audience}`;
        updateScenarioData({ ...result.data, formKey });
      } else {
        console.error('❌ API Error:', result.error);
        setError(result.error || 'Failed to generate scenario');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = formData && 
    formData.full_name && 
    formData.age_group && 
    formData.hardest && 
    formData.audience;

  return (
    <div className="h-full flex flex-col p-8 bg-gray-50 overflow-y-auto">
      {!scenarioData ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to HeyMarley</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your personalized writing companion. We'll help you improve your writing skills 
              through tailored exercises and feedback.
            </p>
          </div>

          {/* Generate Scenario Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGenerateScenario}
              disabled={!isFormValid || isGenerating}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                isFormValid && !isGenerating
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'Creating exercises...' : 'Create my personal exercises'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
              <div className="font-semibold mb-2">Error generating scenario:</div>
              <div className="text-sm">{error}</div>
              <div className="mt-3 text-xs text-red-600">
                <p>Tips:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Make sure the backend server is running on port 8000</li>
                  <li>Check that the Langflow configuration is set up correctly</li>
                  <li>Verify your network connection</li>
                  <li>Try refreshing the page and submitting again</li>
                </ul>
              </div>
            </div>
          )}

          {/* Three placeholder cards at the bottom */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-auto mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Started</h3>
              <p className="text-sm text-gray-600">
                Fill out the form to begin your personalized learning journey.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Learn & Grow</h3>
              <p className="text-sm text-gray-600">
                Practice with exercises designed specifically for your skill level.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                See your improvement over time with detailed feedback and analytics.
              </p>
            </div>
          </div>
        </>
      ) : selectedExercise ? (
        // Chat Interface View
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          <div className="mb-4 flex-shrink-0">
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-purple-600 hover:text-purple-700 mb-2 text-sm font-medium"
            >
              ← Back to exercises
            </button>
            <h2 className="text-5xl font-bold text-gray-800 text-center">{selectedExercise.title || 'Writing Exercise'}</h2>
            {selectedExercise.focus && (
              <p className="text-sm text-purple-600 font-semibold mt-1 text-center">{selectedExercise.focus}</p>
            )}
          </div>
          
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatInterface exercise={selectedExercise} />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Personalized Writing Scenario</h2>
          
          {/* Display Scenario */}
          {scenarioData.scenario && (
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <p className="text-gray-700 whitespace-pre-wrap">{scenarioData.scenario}</p>
            </div>
          )}

          {/* Display Exercises */}
          {scenarioData.exercises && scenarioData.exercises.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarioData.exercises.map((exercise, index) => {
                // Handle both structured exercise objects and simple string arrays
                const exerciseObj = typeof exercise === 'string' 
                  ? { 
                      id: index,
                      title: `Exercise ${index + 1}`,
                      focus: 'Writing Practice',
                      description: exercise,
                      prompt: exercise,
                      guidelines: []
                    }
                  : exercise;

                // Select different icon for each card based on index
                const getIcon = () => {
                  const focus = exerciseObj.focus?.toLowerCase() || '';
                  const iconOptions = [
                    <FaPen className="text-white" size={48} />,
                    <FaLightbulb className="text-white" size={48} />,
                    <FaBook className="text-white" size={48} />,
                    <FaMagic className="text-white" size={48} />,
                    <FaStar className="text-white" size={48} />,
                    <FaRocket className="text-white" size={48} />,
                    <FaFeather className="text-white" size={48} />,
                    <FaGraduationCap className="text-white" size={48} />
                  ];
                  
                  // Use focus-based selection if available, otherwise use index
                  if (focus.includes('creative')) return iconOptions[1]; // Lightbulb
                  if (focus.includes('reflective') || focus.includes('analyzing')) return iconOptions[2]; // Book
                  if (focus.includes('producing') || focus.includes('writing')) return iconOptions[0]; // Pen
                  
                  // Default: different icon for each card
                  return iconOptions[index % iconOptions.length];
                };

                return (
                  <div
                    key={exerciseObj.id || index}
                    onClick={() => !isStartingExercise && handleExerciseClick(exerciseObj)}
                    className={`bg-purple-200 rounded-lg p-6 shadow-sm transition-all ${
                      isStartingExercise ? 'cursor-wait opacity-50' : 'cursor-pointer hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-3 flex items-center justify-center">
                        {getIcon()}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">{exerciseObj.title || `Exercise ${index + 1}`}</h3>
                    </div>
                    {exerciseObj.focus && (
                      <p className="text-sm text-purple-600 font-semibold mb-4">{exerciseObj.focus}</p>
                    )}

                    <div className="mb-4">
                      <p className="text-gray-700 text-sm">{exerciseObj.description || exerciseObj.prompt || exercise}</p>
                    </div>

                    {exerciseObj.guidelines && exerciseObj.guidelines.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">What to include:</h4>
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                          {exerciseObj.guidelines.map((guideline, idx) => (
                            <li key={idx}>{guideline}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-purple-600 text-sm font-medium text-center">Click to start →</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Display raw data if scenario/exercises not in expected format */}
          {!scenarioData.scenario && !scenarioData.exercises && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated Content</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {JSON.stringify(scenarioData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;

