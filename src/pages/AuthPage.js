import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import '../styles/AuthPage.css';

function AuthPage({ onLogin }) {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isSigningUp ? (
          <>
            <SignupForm onSuccess={onLogin} />
            <p className="toggle-text">
              Already have an account?{' '}
              <button 
                className="toggle-btn" 
                onClick={() => setIsSigningUp(false)}
              >
                Login
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onSuccess={onLogin} />
            <p className="toggle-text">
              Don't have an account?{' '}
              <button 
                className="toggle-btn" 
                onClick={() => setIsSigningUp(true)}
              >
                Sign up
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
