# Interior Designer App - Technical Report

**Project:** My Interior Designer App  
**Author:** Dhanya Revankar
**Date:** December 5, 2025  
**Version:** 1.0.0

---

## Executive Summary

This is an AI-powered interior design application that enables users to upload photos of empty rooms and generate redesigned interior images using artificial intelligence. The application features 3D visualization capabilities, furniture measurements, and support for 10+ room types with phone number authentication.

---

## Technology Stack

### Frontend Technologies

#### Core Framework & Build Tools

- **React** (v18.3.1) - Primary UI framework
- **React DOM** (v18.3.1) - React rendering for web
- **Vite** (v5.4.19) - Fast build tool and development server
- **@vitejs/plugin-react** (v5.0.2) - Official Vite plugin for React

#### Routing

- **React Router DOM** (v7.8.2) - Client-side routing and navigation

#### 3D Visualization

- **Three.js** (v0.159.0) - 3D graphics library
- **@react-three/fiber** (v8.18.0) - React renderer for Three.js
- **@react-three/drei** (v9.122.0) - Helper components for react-three-fiber

#### Styling

- **Tailwind CSS** (v4.1.12) - Utility-first CSS framework
- **PostCSS** (v8.5.6) - CSS transformation tool
- **Autoprefixer** (v10.4.21) - PostCSS plugin for vendor prefixes
- **@tailwindcss/postcss** (v4.1.13) - Tailwind PostCSS integration

**Custom Design System:**

- Custom color palettes (brand, gold)
- Custom animations (float, fadeup)
- Soft shadows and card effects
- Inter font family integration
- Dark mode support via class strategy

### Backend Technologies

#### Server Framework

- **Express.js** (v4.19.2) - Web application framework
- **Node.js** - JavaScript runtime environment
- **CORS** (v2.8.5) - Cross-origin resource sharing middleware

#### File Handling

- **Multer** (v1.4.5-lts.1) - Multipart/form-data handling for file uploads
- **Formidable** (v3.5.4) - Form and file upload parsing
- **Canvas** (v3.2.0) - Image processing capabilities

#### Environment & Configuration

- **dotenv** (v16.4.5) - Environment variable management
- **Concurrently** (v8.2.2) - Run multiple commands simultaneously

### AI & Machine Learning Services

#### Frontend AI Integration

- **@google/generative-ai** (v0.24.1) - Google Gemini API client
- **@huggingface/inference** (v4.7.1) - Hugging Face API integration
- **OpenAI** (v5.19.1) - OpenAI API client

#### Backend AI Services

- **Replicate** (v0.31.0) - AI model deployment platform
- **OpenRouter API** - AI model routing service
- **Node-fetch** (v3.3.2) - HTTP client for API requests

#### Python ML Stack (ml_models/)

- **TensorFlow** (v2.15.0) - Deep learning framework
- **PyTorch** (v2.1.0) - Machine learning framework
- **Torchvision** (v0.16.0) - Computer vision models
- **NumPy** (v1.24.3) - Numerical computing
- **Pillow** (v10.0.1) - Image processing
- **OpenCV** (v4.8.1.78) - Computer vision library
- **Scikit-learn** (v1.3.0) - Machine learning utilities
- **Matplotlib** (v3.7.2) - Data visualization
- **Trimesh** (v4.0.5) - 3D mesh processing
- **Open3D** (v0.18.0) - 3D data processing
- **Flask** (v2.3.3) - Python web framework
- **Flask-CORS** (v4.0.0) - CORS support for Flask
- **Requests** (v2.31.0) - HTTP library

### Authentication & Backend Services

#### Firebase Integration

- **Firebase** (v12.2.1) - Complete backend solution
  - Firebase Authentication (Phone number sign-in enabled)
  - Firebase Firestore (NoSQL database)
  - Firebase Storage (File storage)

### Deployment & Hosting

- **Vercel** - Primary deployment platform
  - Serverless functions
  - Static site hosting
  - Automatic deployments
  - Environment variable management

---

## Project Architecture

### Frontend Structure

#### React Components (src/)

- **App.jsx** - Main application component
- **main.jsx** - Application entry point
- **ErrorBoundary.jsx** - Error handling wrapper
- **FirebaseDebug.jsx** - Firebase debugging utilities
- **Footer.jsx** - Application footer
- **Header.jsx** - Application header
- **PanoramaViewer.jsx** - 360° room view component
- **ProtectedRoute.jsx** - Authentication guard
- **RoomCard.jsx** - Room display card
- **sidebar.jsx** - Navigation sidebar
- **ThreeDViewer.jsx** - 3D room visualization

#### Pages (src/pages/)

- **About.jsx** - About page
- **DemoLogin.jsx** - Demo authentication
- **Design.jsx** - Design generation interface
- **Home.jsx** - Landing page
- **Login.jsx** - Authentication page
- **RoomDetails.jsx** - Room detail view

#### Context Providers

- **AuthContext.jsx** - Authentication state management

### Backend Structure

#### API Server (server.js)

- Express server on port 8787
- File upload handling
- AI image generation orchestration
- Multiple AI provider integration (Replicate, OpenRouter)
- Furniture layout generation
- Room design description generation

#### API Routes

- `/api/health` - Health check endpoint
- `/api/design.js` - Design generation endpoint
- Proxy configuration for frontend-backend communication

#### Machine Learning Module (ml_models/)

- **ml_api.py** - ML model API server
- **3d_model_generator.py** - 3D model generation
- **model_architecture.py** - Neural network architectures
- **train_model.py** - Model training pipeline
- **quick_start.py** - Quick start script
- **setup_ml.py** - ML environment setup
- **test_3d_generation.py** - 3D generation testing
- **training_data/** - Training data directory

### Configuration Files

- **vite.config.mjs** - Vite configuration with API proxy
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS configuration
- **vercel.json** - Vercel deployment configuration
- **package.json** - Node.js dependencies and scripts
- **.env** - Environment variables (API keys)
- **replicate.env** - Replicate API token

---

## Key Features

### Room Design Generation

- Upload empty room photos
- Support for 10+ room types (living room, bedroom, kitchen, office, etc.)
- Custom element addition (TV, bookshelf, piano, etc.)
- Multiple design styles (modern, traditional, minimalist, industrial)
- AI-powered furniture placement with measurements

### 3D Visualization

- Interactive 3D room preview
- Three.js-based rendering
- React Three Fiber integration
- Panoramic 360° room views
- Real-time 3D model generation

### Authentication

- Firebase Authentication
- **Phone number sign-in** (primary method)
- Protected routes
- Demo login capability
- Session management

### AI Integration

- Multiple AI provider support
- Google Gemini API for text generation
- Replicate for image generation
- OpenRouter for model routing
- Hugging Face model integration
- Custom ML models with TensorFlow/PyTorch

---

## Development Scripts

```json
"dev": "vite --host --port 5175 --open"
"api": "node server.js"
"dev:full": "concurrently \"npm run api\" \"npm run dev\""
"dev:ml": "python start_with_ml.py"
"ml:setup": "cd ml_models && python setup_ml.py"
"ml:train": "cd ml_models && python train_model.py"
"ml:api": "cd ml_models && python ml_api.py"
"ml:test": "cd ml_models && python test_3d_generation.py"
"ml:start": "cd ml_models && python quick_start.py"
"test:api": "node test_ml_api.js"
"build": "vite build"
"preview": "vite preview"
"vercel-build": "vite build"
```

---

## API Integrations

### External APIs

1. **Google AI Studio** - Gemini API for AI-powered design suggestions
2. **Replicate** - AI model deployment and image generation
3. **OpenRouter** - AI model routing (Flux Pro 1.1)
4. **Hugging Face** - Pre-trained model inference
5. **Firebase** - Authentication and database services
6. **Unsplash** - Placeholder design images

---

## Development Environment

### Prerequisites

- Node.js (with npm)
- Python 3.x (for ML models)
- Google AI Studio account
- Replicate API account
- Firebase project

### Port Configuration

- Frontend: `localhost:5175`
- Backend API: `localhost:8787`
- ML API: Configurable in ml_models

---

## Data Flow

1. **User uploads room photo** → Frontend (React)
2. **Image sent to backend** → Express server (Multer)
3. **AI processing** → Multiple AI providers (Replicate/OpenRouter/Gemini)
4. **3D generation** → Python ML models (TensorFlow/PyTorch)
5. **Visualization** → Three.js rendering
6. **Results stored** → Firebase Firestore
7. **User authentication** → Firebase Auth (Phone number)

---

## Documentation Files

- **README.md** - Main project documentation
- **ARCHITECTURE.md** - System architecture details
- **3D_FEATURE_GUIDE.md** - 3D visualization guide
- **3D_SYSTEM_README.md** - 3D system documentation
- **3D_VIEW_FEATURE.md** - 3D view feature specifications
- **ml_models/README.md** - ML module documentation

---

## Build & Deployment

### Production Build

- Vite builds optimized production bundle
- Assets compiled to `dist/` directory
- Code splitting and tree shaking enabled
- CSS minification with Tailwind

### Deployment Platform

- **Vercel** serverless deployment
- Automatic Git deployments
- Environment variables configured
- Static file serving from CDN
- Serverless API functions

---

## Security Considerations

- API keys stored in `.env` files (not committed to Git)
- CORS configured for specific origins
- Protected routes with authentication
- Firebase security rules
- Environment variable validation
- Secure file upload handling

---

## Image Sources

### Design Generation

- Replicate AI models for custom generation
- Unsplash API for fallback images
- Custom ML-generated 3D models
- Cached design templates

---

## Future Enhancements

Based on the current architecture, potential areas for expansion:

- Additional AI model providers
- Advanced 3D rendering capabilities
- Real-time collaboration features
- Extended room type support
- Enhanced furniture catalog
- AR visualization integration

---

## Conclusion

This Interior Designer App represents a comprehensive full-stack application combining modern web technologies (React, Vite, Tailwind) with advanced AI/ML capabilities (TensorFlow, PyTorch, multiple AI APIs) and 3D visualization (Three.js). The application demonstrates expertise in:

- Modern frontend development
- Backend API design
- Machine learning integration
- 3D graphics programming
- Cloud deployment
- Authentication systems
- Real-time data processing

**Total Dependencies:** 30+ npm packages, 14 Python packages  
**Total Components:** 18 React components  
**API Integrations:** 5+ external services  
**Documentation Pages:** 5+ markdown files

---

_This report was generated on December 5, 2025_
