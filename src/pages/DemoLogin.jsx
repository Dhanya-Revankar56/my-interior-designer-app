import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DemoLogin() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleDemoSignIn() {
    setLoading(true);
    
    // Simulate sign-in process
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        // Redirect to home page for demo
        navigate('/', { replace: true });
      }, 1000);
    }, 2000);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 text-center animate-fadeup">
        {/* Header */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mobile Demo</h1>
          <p className="text-gray-600">Test the beautiful mobile interface</p>
        </div>

        {/* Demo Google Sign-in Button */}
        <button 
          onClick={handleDemoSignIn} 
          disabled={loading || success}
          className={`group relative w-full rounded-xl p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            success 
              ? 'bg-green-100 border border-green-300 cursor-default'
              : loading 
                ? 'bg-gray-100 border border-gray-200 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            {success ? (
              /* Success State */
              <div className="flex items-center space-x-3">
                <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-green-700 font-medium">Demo sign-in successful!</span>
              </div>
            ) : loading ? (
              /* Loading Spinner */
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                <span className="text-gray-600 font-medium">Signing in...</span>
              </div>
            ) : (
              /* Google Logo and Text */
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Demo Sign-in (No Auth Required)</span>
              </>
            )}
          </div>
        </button>

        {/* Demo Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800">Mobile Demo Mode</p>
                <p className="text-sm text-blue-700">This bypasses authentication for mobile testing. Real Google sign-in works on desktop!</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Test the beautiful mobile interface without authentication
          </p>
        </div>
      </div>
    </div>
  );
}

export default DemoLogin;
