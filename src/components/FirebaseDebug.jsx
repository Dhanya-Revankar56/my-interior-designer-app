import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function FirebaseDebug() {
  const [debugInfo, setDebugInfo] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const info = {
      'Environment Variables': {
        'API Key': import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Present' : '❌ Missing',
        'Auth Domain': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '❌ Missing',
        'Project ID': import.meta.env.VITE_FIREBASE_PROJECT_ID || '❌ Missing',
        'App ID': import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Present' : '❌ Missing',
      },
      'Current URL': window.location.href,
      'Auth Object': auth ? '✅ Initialized' : '❌ Failed to initialize',
      'Google Provider': googleProvider ? '✅ Initialized' : '❌ Failed to initialize',
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
  }, []);

  const testGoogleAuth = async () => {
    try {
      setTestResult('Testing Google Auth...');
      console.log('Testing Google Auth with config:', {
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      setTestResult(`✅ Success! Signed in as: ${result.user.email}`);
    } catch (error) {
      console.error('Auth test failed:', error);
      setTestResult(`❌ Error: ${error.code} - ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
      <h2>🔧 Firebase Debug Info</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Configuration Status:</h3>
        <pre style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          {debugInfo}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Authentication Test:</h3>
        <button 
          onClick={testGoogleAuth}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4285f4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Google Sign In
        </button>
      </div>

      {testResult && (
        <div style={{ marginTop: '10px' }}>
          <h4>Test Result:</h4>
          <pre style={{ 
            backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {testResult}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h4>Common Solutions:</h4>
        <ul>
          <li>Ensure localhost:5175 is added to Firebase Console → Authentication → Settings → Authorized domains</li>
          <li>Enable Google sign-in method in Firebase Console → Authentication → Sign-in method</li>
          <li>Check that all environment variables are properly loaded</li>
          <li>Clear browser cache and cookies</li>
        </ul>
      </div>
    </div>
  );
}

export default FirebaseDebug;
