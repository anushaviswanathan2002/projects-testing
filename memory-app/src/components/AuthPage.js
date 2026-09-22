import React, { useState } from 'react';
import './AuthPage.css';
import Login from './Login';
import SignUp from './SignUp';

function AuthPage({ onLogin, onSignUp }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Memory App</h1>
        {isLoginMode ? (
          <>
            <Login onLogin={onLogin} />
            <p className="switch-text">
              Don't have an account?{' '}
              <button
                className="switch-btn"
                onClick={() => setIsLoginMode(false)}
              >
                Sign Up
              </button>
            </p>
          </>
        ) : (
          <>
            <SignUp onSignUp={onSignUp} />
            <p className="switch-text">
              Already have an account?{' '}
              <button
                className="switch-btn"
                onClick={() => setIsLoginMode(true)}
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
