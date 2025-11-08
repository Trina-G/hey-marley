import React from 'react';
import { SessionProvider } from './context/SessionContext';
import IntakeForm from './components/IntakeForm';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  return (
    <SessionProvider>
      <div className="h-screen w-screen overflow-hidden">
        <div className="h-full grid grid-cols-3 gap-0">
          {/* Left Column - Form (33%) */}
          <div className="col-span-1 overflow-hidden">
            <IntakeForm />
          </div>
          
          {/* Right Column - Welcome Screen (67%) */}
          <div className="col-span-2 overflow-hidden">
            <WelcomeScreen />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

export default App;

