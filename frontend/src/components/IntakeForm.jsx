import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../context/SessionContext';

const STORAGE_KEY = 'writebot_form_data';

const IntakeForm = () => {
  const { updateFormData } = useSession();
  
  const defaultFormData = {
    full_name: '',
    age_group: '', // 10-13, 14-16, 17-18
    interests: '',
    cultural_refs: '',
    hardest: '', // Analyzing, Producing
    audience: '', // peers, younger students
  };

  // Load form data from localStorage on mount
  const loadFormData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultFormData, ...parsed };
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
    return defaultFormData;
  };

  const [formData, setFormData] = useState(loadFormData);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const saveTimeoutRef = useRef(null);
  const contextUpdateTimeoutRef = useRef(null);

  // Save to localStorage whenever formData changes (debounced)
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save after 500ms of no changes
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }, 500);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  // Update session context whenever form data changes (debounced to avoid too many updates)
  useEffect(() => {
    // Clear existing timeout
    if (contextUpdateTimeoutRef.current) {
      clearTimeout(contextUpdateTimeoutRef.current);
    }

    // Update context after a short delay to batch updates
    contextUpdateTimeoutRef.current = setTimeout(() => {
      // Always update context with latest form data (even if incomplete)
      // This ensures scenario generation always uses the latest data
      updateFormData(formData);
    }, 300); // Shorter delay for context updates than localStorage saves

    // Cleanup timeout on unmount
    return () => {
      if (contextUpdateTimeoutRef.current) {
        clearTimeout(contextUpdateTimeoutRef.current);
      }
    };
  }, [formData, updateFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      return updated;
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Clear form data (useful for testing)
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      setFormData(defaultFormData);
      localStorage.removeItem(STORAGE_KEY);
      setErrors({});
      setSubmitStatus(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields matching Langflow form
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.age_group) {
      newErrors.age_group = 'Age group is required';
    } else if (!['10-13', '14-16', '17-18'].includes(formData.age_group)) {
      newErrors.age_group = 'Please select a valid age group';
    }
    if (!formData.hardest) {
      newErrors.hardest = 'Please select which is hardest for you';
    } else if (!['Analyzing', 'Producing'].includes(formData.hardest)) {
      newErrors.hardest = 'Please select Analyzing or Producing';
    }
    if (!formData.audience) {
      newErrors.audience = 'Please select your audience';
    } else if (!['peers', 'younger students'].includes(formData.audience)) {
      newErrors.audience = 'Please select peers or younger students';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Update session context with form data
    updateFormData(formData);
    setSubmitStatus({ type: 'success', message: 'Form data saved! Click "Generate Personalized Scenario" to continue.' });
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-800">
      <h2 className="text-2xl text-white mb-6">
        <span className="font-bold">Student Onboarding</span>
        <span className="font-normal"> - Shorter for Demo Purpose</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 overflow-y-auto">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white border-b border-gray-600 pb-2">Basic Information</h3>
          
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-400 mb-1">
              Full name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border-none rounded-md bg-gray-700 text-purple-400 placeholder-gray-400 text-2xl font-bold"
              placeholder="Enter your full name"
            />
            {errors.full_name && <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label htmlFor="age_group" className="block text-sm font-medium text-gray-400 mb-1">
              Age group <span className="text-red-400">*</span>
            </label>
            <select
              id="age_group"
              name="age_group"
              value={formData.age_group}
              onChange={handleChange}
              className="w-full px-3 py-2 border-none rounded-md bg-gray-700 text-purple-400 text-2xl font-bold"
            >
              <option value="" className="text-purple-400">Select age group</option>
              <option value="10-13" className="text-purple-400">10-13</option>
              <option value="14-16" className="text-purple-400">14-16</option>
              <option value="17-18" className="text-purple-400">17-18</option>
            </select>
            {errors.age_group && <p className="text-red-400 text-sm mt-1">{errors.age_group}</p>}
          </div>
        </div>

        {/* Section 2: Interests & Cultural Context */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white border-b border-gray-600 pb-2">Interests & Cultural Context</h3>
          
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-400 mb-1">
              What topics or activities do you love? (comma-separated)
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-3 py-2 border-none rounded-md bg-gray-700 text-purple-400 placeholder-gray-400 text-2xl font-bold"
              placeholder="football, stories, art"
            />
          </div>

          <div>
            <label htmlFor="cultural_refs" className="block text-sm font-medium text-gray-400 mb-1">
              What cultural things matter to you? (festivals, shows, games, etc.)
            </label>
            <input
              type="text"
              id="cultural_refs"
              name="cultural_refs"
              value={formData.cultural_refs}
              onChange={handleChange}
              className="w-full px-3 py-2 border-none rounded-md bg-gray-700 text-purple-400 placeholder-gray-400 text-2xl font-bold"
              placeholder="IPL, Diwali"
            />
          </div>
        </div>

        {/* Section 3: Writing Assessment */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white border-b border-gray-600 pb-2">Writing Assessment</h3>
          
          <div>
            <label htmlFor="hardest" className="block text-sm font-medium text-gray-400 mb-1">
              Which is hardest for you? <span className="text-red-400">*</span>
            </label>
            <select
              id="hardest"
              name="hardest"
              value={formData.hardest}
              onChange={handleChange}
              className="w-full px-3 py-2 border-none rounded-md bg-gray-700 text-purple-400 text-2xl font-bold"
            >
              <option value="" className="text-purple-400">Select one</option>
              <option value="Analyzing" className="text-purple-400">A: Analyzing - Understanding and analyzing what you read</option>
              <option value="Producing" className="text-purple-400">C: Producing - Creating and writing your own text</option>
            </select>
            {errors.hardest && <p className="text-red-400 text-sm mt-1">{errors.hardest}</p>}
          </div>

          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-400 mb-1">
              Who is your audience? <span className="text-red-400">*</span>
            </label>
            <select
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              className="w-full px-3 py-2 border-none rounded-md bg-gray-700 text-purple-400 text-2xl font-bold"
            >
              <option value="" className="text-purple-400">Select one</option>
              <option value="peers" className="text-purple-400">Peers - Students your age</option>
              <option value="younger students" className="text-purple-400">Younger students - Students younger than you</option>
            </select>
            {errors.audience && <p className="text-red-400 text-sm mt-1">{errors.audience}</p>}
          </div>
        </div>

        {/* Submit Status */}
        {submitStatus && (
          <div className={`p-4 rounded-md ${
            submitStatus.type === 'success' 
              ? 'bg-green-900 text-green-100 border border-green-700' 
              : 'bg-red-900 text-red-100 border border-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1"></div>

        {/* Submit Button */}
        <div className="space-y-2 mt-auto">
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
      
      {/* Clear Form Button - Fixed at bottom */}
      <div className="mt-2">
        <button
          type="button"
          onClick={handleClearForm}
          className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;

