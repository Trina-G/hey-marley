import React, { useState, useRef, useEffect } from 'react';

// Helper function to detect exercise content
const isExerciseContent = (line) => {
  const exercisePatterns = [
    /^Your turn/i,
    /^\d+\.\s*\*\*Sentence \d+:/i,
    /^\*\*Sentence \d+:/i,
    /^\*\*Transition type:/i,
    /^\*\*Connected:/i,
    /^Connect these pairs/i,
    /^Write \d+ connected sentences/i,
  ];
  return exercisePatterns.some(pattern => pattern.test(line.trim()));
};

// Component to render exercise content with styling
const ExerciseContentBlock = ({ content }) => {
  return (
    <div className="my-4 p-4 border-2 border-blue-400 rounded-lg bg-blue-50 relative">
      {/* Pencil Icon */}
      <div className="absolute -top-3 -left-3 bg-blue-500 rounded-full p-2 shadow-md">
        <svg 
          className="w-5 h-5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
          />
        </svg>
      </div>
      <div className="text-base whitespace-pre-wrap text-gray-800">
        {content.split('**').map((part, idx) => 
          idx % 2 === 1 ? <strong key={idx} className="text-gray-900">{part}</strong> : part
        )}
      </div>
    </div>
  );
};

// All exercises now use data from Langflow pipeline - no mock data

const ChatInterface = ({ exercise }) => {
  const getInitialMessage = () => {
    const title = exercise.title || 'This Exercise';
    const description = exercise.description || '';
    const prompt = exercise.prompt || '';
    
    let message = `Great choice! Let's work on "${title}".\n\n`;
    
    if (description) {
      message += `${description}\n\n`;
    }
    
    if (prompt && prompt !== description) {
      message += `**Your Prompt:**\n${prompt}\n\n`;
    }
    
    if (exercise.guidelines && exercise.guidelines.length > 0) {
      message += `**What to include:**\n`;
      exercise.guidelines.forEach((guideline, idx) => {
        message += `• ${guideline}\n`;
      });
      message += `\n`;
    }
    
    message += `Take your time and write your response. I'm here to help if you have any questions!`;
    
    return message;
  };

  // Get initial messages using exercise data from Langflow
  const getInitialMessages = () => {
    // Always use exercise data from Langflow pipeline
    return [
      {
        role: 'assistant',
        content: getInitialMessage()
      }
    ];
  };

  const [messages, setMessages] = useState(() => {
    // Start with initial message from Langflow exercise data
    return getInitialMessages();
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset messages when exercise changes - use Langflow exercise data
  useEffect(() => {
    const initial = getInitialMessages();
    setMessages(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id, exercise?.title]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: "That's a great start! Keep going with your writing. Remember to include the elements we discussed. Feel free to ask me questions if you need help!"
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-lg mb-4">
        {/* Display messages from Langflow exercise data */}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.role === 'user' ? (
                // Teen avatar for user
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                // Bot avatar for assistant
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} flex-1`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-base whitespace-pre-wrap">
                  {(() => {
                    const lines = message.content.split('\n');
                    const result = [];
                    let exerciseBlock = [];
                    let inExerciseBlock = false;

                    lines.forEach((line, lineIdx) => {
                      const isExerciseLine = isExerciseContent(line);
                      
                      // Start or continue exercise block
                      if (isExerciseLine) {
                        if (!inExerciseBlock) {
                          // Close previous content if any
                          if (result.length > 0 && typeof result[result.length - 1] === 'string') {
                            // Do nothing, continue
                          }
                          inExerciseBlock = true;
                          exerciseBlock = [];
                        }
                        exerciseBlock.push(line);
                      } else {
                        // End exercise block if we were in one
                        if (inExerciseBlock && exerciseBlock.length > 0) {
                          result.push(
                            <ExerciseContentBlock 
                              key={`exercise-${lineIdx}`} 
                              content={exerciseBlock.join('\n')} 
                            />
                          );
                          exerciseBlock = [];
                          inExerciseBlock = false;
                        }
                        
                        // Regular content
                        result.push(
                          <React.Fragment key={lineIdx}>
                            {line.split('**').map((part, idx) => 
                              idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                            )}
                            {lineIdx < lines.length - 1 && '\n'}
                          </React.Fragment>
                        );
                      }
                    });

                    // Close any remaining exercise block
                    if (inExerciseBlock && exerciseBlock.length > 0) {
                      result.push(
                        <ExerciseContentBlock 
                          key={`exercise-end`} 
                          content={exerciseBlock.join('\n')} 
                        />
                      );
                    }

                    return result;
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            {/* Bot Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Typing Indicator */}
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="flex gap-2 flex-shrink-0">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder="Type your message or writing here... (Press Enter to send, Shift+Enter for new line)"
          rows={3}
          className="flex-1 px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors self-end"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

