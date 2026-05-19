// Test Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Load environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDxLxhsq4V1A_--uEvx2noR6n9Pi_7gAR0",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "my-interior-designer-app.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "my-interior-designer-app",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "my-interior-designer-app.firebasestorage.app",
  messagingSenderId: "441096720909",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:441096720909:web:c04112e0672a45ce7efb44",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FSW05V90Q0"
};

console.log('Testing Firebase configuration...');
console.log('Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'Missing'
});

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  console.log('✅ Firebase initialized successfully');
  console.log('✅ Auth initialized successfully');
  console.log('✅ Google provider initialized successfully');
  console.log('Auth domain:', firebaseConfig.authDomain);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}
