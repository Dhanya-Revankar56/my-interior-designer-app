import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThreeDViewer from '../components/ThreeDViewer';
import PanoramaViewer from '../components/PanoramaViewer';
import { useSearchParams } from 'react-router-dom';
import useRoomCollaboration from '../hooks/useRoomCollaboration';

const roomTypes = [
  { 
    value: 'living', 
    label: 'Living Room',
    description: 'Modern living room with 3-seater sofa (84" L), coffee table (48" L), accent chairs, 8x10 area rug, wall art, entertainment center, bookshelves, floor lamps, throw pillows, and plants.'
  },
  { 
    value: 'bedroom', 
    label: 'Bedroom',
    description: 'Stylish bedroom with queen bed (60" W x 80" L), nightstands (24" W), reading lamps, 8x10 area rug, wall art, blackout curtains, dresser (60" W), full-length mirror, and plants.'
  },
  { 
    value: 'kitchen', 
    label: 'Kitchen',
    description: 'Contemporary kitchen with island (72" L x 36" W), pendant lighting, backsplash, upper cabinets (12" D), lower cabinets (24" D), appliances, and dining table (60" L).'
  },
  { 
    value: 'office', 
    label: 'Home Office',
    description: 'Productive home office with desk (60" L x 30" W), ergonomic chair, computer setup, bookshelves (72" H), filing cabinets, desk lamp, wall art, and organizational tools.'
  },
  { 
    value: 'bathroom', 
    label: 'Bathroom',
    description: 'Modern bathroom with vanity (48" W), mirror (36" W), shower/tub combo (60" L), toilet, storage cabinets, towel racks, lighting fixtures, and plants.'
  },
  { 
    value: 'dining', 
    label: 'Dining Room',
    description: 'Elegant dining room with dining table (72" L x 36" W), 6 chairs, buffet cabinet (60" W), chandelier, area rug (9x12), wall art, and decorative accessories.'
  },
  { 
    value: 'nursery', 
    label: 'Nursery',
    description: 'Cozy nursery with crib (54" L x 30" W), changing table (36" W), rocking chair, dresser (48" W), bookshelf, soft lighting, wall decals, and storage baskets.'
  },
  { 
    value: 'laundry', 
    label: 'Laundry Room',
    description: 'Functional laundry room with washer/dryer (27" W each), folding counter (60" L), upper cabinets, sink, hanging rod, storage baskets, and organizational systems.'
  },
  { 
    value: 'entryway', 
    label: 'Entryway/Foyer',
    description: 'Welcoming entryway with console table (48" L), mirror (30" W), bench (36" L), coat hooks, shoe storage, lighting fixture, area rug, and decorative elements.'
  },
  { 
    value: 'guest', 
    label: 'Guest Room',
    description: 'Comfortable guest room with full bed (54" W x 75" L), nightstand (20" W), dresser (54" W), reading chair, desk (42" L), closet organization, and welcoming decor.'
  }
];

roomTypes.push({
  value: 'home_theatre',
  label: 'Home Theatre',
  description: 'Immersive home theatre with 120" projection screen or 85" TV, 7.1 surround sound speakers, acoustic panels, tiered recliner seating, blackout curtains, ambient LED lighting, media console, and cable management.'
});

function Design() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [image, setImage] = useState(null);
  const [room, setRoom] = useState('living');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');
  const [customElements, setCustomElements] = useState([]);
  const [customElementInput, setCustomElementInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [roomDimensions, setRoomDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [generationType, setGenerationType] = useState('3D'); // '2D' or '3D'
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [generated3DModel, setGenerated3DModel] = useState(null);
  const [furnitureLayout, setFurnitureLayout] = useState([]);
  const [enable360View, setEnable360View] = useState(false);
  const [showPanorama, setShowPanorama] = useState(false);
  const [panoramaUrl, setPanoramaUrl] = useState('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@main/equirect.jpg');
  const [roomId, setRoomId] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [chatInput, setChatInput] = useState('');

  const {
    furnitureLayout: collabLayout,
    presence,
    messages,
    updateFurniture,
    sendMessage
  } = useRoomCollaboration(roomId, user);

  useEffect(() => {
    const paramRoom = searchParams.get('room');
    if (paramRoom) {
      setRoomId(paramRoom);
      setRoomIdInput(paramRoom);
    } else if (user?.uid && !roomId) {
      const defaultId = user.uid.slice(0, 6);
      setRoomId(defaultId);
      setRoomIdInput(defaultId);
      const params = new URLSearchParams(searchParams);
      params.set('room', defaultId);
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams, user, roomId]);

  useEffect(() => {
    if (collabLayout && JSON.stringify(collabLayout) !== JSON.stringify(furnitureLayout)) {
      setFurnitureLayout(collabLayout);
    }
  }, [collabLayout]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoinRoom = () => {
    const nextId = (roomIdInput || '').trim() || user?.uid?.slice(0, 6) || 'demo-room';
    setRoomId(nextId);
    setRoomIdInput(nextId);
    const params = new URLSearchParams(searchParams);
    params.set('room', nextId);
    setSearchParams(params, { replace: true });
  };

  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text) return;
    await sendMessage(text);
    setChatInput('');
  };

  // Auto-sync the panorama viewer with the latest generated image
  useEffect(() => {
    if (resultUrl) {
      setPanoramaUrl(resultUrl);
      setShowPanorama(true);
    }
  }, [resultUrl]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  const handleAddCustomElement = () => {
    if (customElementInput.trim() !== '' && !customElements.includes(customElementInput.trim())) {
      setCustomElements([...customElements, customElementInput.trim()]);
      setCustomElementInput('');
    }
  };

  const handleRemoveCustomElement = (element) => {
    setCustomElements(customElements.filter(item => item !== element));
  };

  const startVoiceInput = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Voice input is not supported in this browser. Please use Chrome or Edge.');
        return;
      }
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (e) => {
        setIsRecording(false);
        setError(e.message || 'Voice input error');
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
          if (!customElements.includes(transcript)) {
            setCustomElements([...customElements, transcript]);
          }
          setCustomElementInput('');
        }
      };
      recognition.start();
    } catch (e) {
      setIsRecording(false);
      setError(e.message || 'Failed to start voice input');
    }
  };

  async function handleGenerate() {
    try {
      setError('');
      setLoading(true);
      const form = new FormData();
      if (image) {
        // Fetch the blob again since we stored an object URL
        const blob = await fetch(image).then((r) => r.blob());
        form.append('image', blob, 'room.jpg');
      }
      form.append('roomType', room);
      form.append('customElements', JSON.stringify(customElements));
      form.append('roomDimensions', JSON.stringify(roomDimensions));
      form.append('generationType', generationType);

      // Create AbortController for timeout (120 seconds for image generation)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

      let res;
      try {
        res = await fetch('/api/design', { 
          method: 'POST', 
          body: form,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Image generation is taking longer than expected. Please try again.');
        }
        if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
          throw new Error('Unable to connect to the server. Please check your internet connection and ensure the server is running.');
        }
        throw fetchError;
      }
      
      // Check if response is actually JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}. Expected JSON response but got ${contentType || 'unknown content type'}`);
      }
      
      // Try to parse JSON with better error handling
      let data;
      try {
        const responseText = await res.text();
        if (!responseText.trim()) {
          throw new Error('Server returned empty response');
        }
        data = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`Failed to parse JSON response: ${jsonError.message}`);
      }
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(data.message || 'Your Replicate API token is not valid. Please check your API token and try again.');
        } else if (res.status === 429) {
          throw new Error(data.message || 'Your Replicate API quota has been exceeded. Please check your usage limits.');
        }
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      
      setResultUrl(data.imageUrl || '');
      
      // Handle 3D model data
      if (data.design && data.furniture_layout) {
        setGenerated3DModel(data.design);
        setFurnitureLayout(data.furniture_layout);
        if (roomId) {
          try {
            await updateFurniture(data.furniture_layout);
          } catch (syncErr) {
            console.error('Failed to sync layout to room', syncErr);
          }
        }
        console.log('3D Model generated:', data.design);
        console.log('Furniture layout:', data.furniture_layout);
      }
      
      // Store the description from ML model if available
      if (data.description) {
        console.log('ML Model Response: ' + data.description);
      }
    } catch (e) {
      console.error('Design generation error:', e);
      console.error('Error details:', {
        message: e.message,
        stack: e.stack,
        name: e.name
      });
      
      // Provide user-friendly error messages
      let errorMessage = String(e?.message || e);
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and ensure the server is running on port 8787.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        errorMessage = 'Request timed out. The image generation is taking longer than expected. This may be due to high server load. Please try again in a moment.';
      } else if (errorMessage.includes('CORS')) {
        errorMessage = 'CORS error: Please ensure the backend server is running and CORS is properly configured.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* User Welcome */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'}
                    className="w-16 h-16 rounded-full border-4 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {user?.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'Designer'}! 👋
                </h1>
                <p className="text-white/80">
                  Ready to transform spaces with AI-powered interior design
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-white/80">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">48</div>
                <div className="text-sm text-white/80">Designs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5.0</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>
          
          {/* Main Title */}
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">
              AI Interior Design Studio
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
              Upload your room photo and watch our AI transform it into a stunning interior design
            </p>
            <p className="text-sm text-white/70 flex items-center justify-center gap-2">
              <span>Created by</span>
              <span className="font-semibold text-white">
                AYESHA,DHANYA,RAHIL,NANDI
              </span>
              <span>🎨</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Collaboration Panel */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Real-time Room</h3>
                <p className="text-sm text-gray-600">Share this room ID so teammates can join.</p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                {roomId || 'no-room'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="team-room-123"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleJoinRoom}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                Join / Create
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Presence</h3>
              <span className="text-sm text-gray-600">{Object.keys(presence).length} online</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.entries(presence).length === 0 && (
                <p className="text-sm text-gray-500">No collaborators yet.</p>
              )}
              {Object.entries(presence).map(([id, person]) => (
                <div key={id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold overflow-hidden">
                    {person.avatar ? (
                      <img src={person.avatar} alt={person.displayName || 'user'} className="w-full h-full object-cover" />
                    ) : (
                      (person.displayName || 'U')[0]
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{person.displayName || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{id === user?.uid ? 'You' : 'Collaborator'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">1. Upload Photo</h4>
              <p className="text-gray-600">Take a photo of your empty room or space that needs design</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">2. Customize</h4>
              <p className="text-gray-600">Choose room type and add your preferred design elements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">3. Generate</h4>
              <p className="text-gray-600">Our AI creates a stunning interior design instantly</p>
            </div>
          </div>
        </div>

        {/* Main Design Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Your Room</h2>
            </div>
            
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors duration-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Choose a photo</h3>
                <p className="text-gray-500 mb-4">Upload JPG, PNG up to 10MB</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFile} 
                  className="hidden" 
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Select Photo
                </label>
              </div>
            ) : (
              <div className="relative">
                <img src={image} alt="Uploaded room" className="w-full rounded-2xl shadow-lg" />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Design Preferences</h2>
            </div>
            
            {/* Generation Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Generation Type</label>
              <select
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="2D">🖼️ 2D Design</option>
                <option value="3D">🏠 3D Model</option>
              </select>
            </div>
            
            {/* Room Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Room Type</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem'
                }}
              >
                {roomTypes.map((roomType) => (
                  <option key={roomType.value} value={roomType.value}>
                    {roomType.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Room Dimensions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4m6 0h4a1 1 0 011 1v4m0 6v4a1 1 0 01-1 1h-4m-6 0H4a1 1 0 01-1-1v-4" />
                </svg>
                Room Dimensions (Optional)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    value={roomDimensions.length}
                    onChange={(e) => setRoomDimensions({...roomDimensions, length: e.target.value})}
                    placeholder="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    value={roomDimensions.width}
                    onChange={(e) => setRoomDimensions({...roomDimensions, width: e.target.value})}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Height (ft)</label>
                  <input
                    type="number"
                    value={roomDimensions.height}
                    onChange={(e) => setRoomDimensions({...roomDimensions, height: e.target.value})}
                    placeholder="9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Adding dimensions helps generate more accurate furniture sizing and room proportions
              </p>
            </div>
            
            {/* Design Elements Preview */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {generationType} Design Elements Included
              </h3>
              <p className="text-sm text-purple-700 leading-relaxed">
                {roomTypes.find(r => r.value === room)?.description}
              </p>
              {generationType === '3D' && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-purple-600">
                    ✨ 3D mode includes interactive room preview with realistic furniture placement
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEnable360View(!enable360View)}
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        enable360View
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                      }`}
                    >
                      {enable360View ? '🌀 360° View On' : '🌀 Enable 360° View'}
                    </button>
                    <button
                      onClick={() => setShow3DPreview(!show3DPreview)}
                      type="button"
                      className="px-3 py-1 bg-purple-200 hover:bg-purple-300 text-purple-800 rounded-lg text-xs font-medium transition-colors"
                    >
                      {show3DPreview ? '🙈 Hide Preview' : '👁️ Show Preview'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 3D Preview Section */}
            {generationType === '3D' && show3DPreview && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  3D Room Preview
                </h3>
                <ThreeDViewer 
                  modelData={generated3DModel}
                  furnitureLayout={furnitureLayout}
                  roomDimensions={roomDimensions}
                  enable360View={enable360View}
                />
              </div>
            )}

            {/* Custom Elements */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Custom Elements
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={customElementInput}
                  onChange={(e) => setCustomElementInput(e.target.value)}
                  placeholder="Add TV, desk, plant, etc."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomElement()}
                />
                <button 
                  onClick={handleAddCustomElement}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-medium"
                  type="button"
                >
                  Add
                </button>
                <button
                  onClick={startVoiceInput}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${isRecording ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105'}`}
                  type="button"
                  title={isRecording ? 'Listening… click to stop' : 'Voice'}
                >
                  {isRecording ? 'Listening…' : 'Voice'}
                </button>
              </div>
              
              {customElements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customElements.map((element, index) => (
                    <div key={index} className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm flex items-center gap-1 border border-purple-200">
                      <span>{element}</span>
                      <button 
                        onClick={() => handleRemoveCustomElement(element)}
                        className="text-purple-500 hover:text-purple-700 ml-1"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Collaboration Chat */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l1.2-3A7.952 7.952 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat
              </h3>
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 h-48 overflow-y-auto space-y-2">
                {messages.length === 0 && (
                  <p className="text-sm text-gray-500">No messages yet. Say hello! 😊</p>
                )}
                {messages.slice(-25).map((msg) => (
                  <div key={msg.id} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span className="font-semibold text-gray-700">{msg.userName || 'Guest'}</span>
                      <span>{msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={roomId ? 'Message collaborators…' : 'Join a room to chat'}
                  disabled={!roomId}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm disabled:bg-gray-100"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <button
                  type="button"
                  onClick={handleSendChat}
                  disabled={!roomId}
                  className={`px-4 py-2 rounded-xl text-white font-semibold transition-all duration-200 ${
                    roomId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Send
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerate} 
              disabled={loading || !image}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : !image
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Generating Design...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate AI Design</span>
                </>
              )}
            </button>
            
            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-red-600 font-semibold">Design Generation Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    {error.includes('insufficient credit') && (
                      <a 
                        href="https://replicate.com/account/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-blue-600 hover:underline font-medium"
                      >
                        Add credit to your Replicate account →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        {resultUrl && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Your AI-Generated Design</h2>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={resultUrl}
                alt="AI-generated interior design"
                className="w-full max-h-[460px] md:max-h-[520px] object-contain rounded-2xl shadow-2xl mx-auto"
              />
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Generated
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800">Panoramic View</h3>
                <button
                  type="button"
                  onClick={() => setShowPanorama((v) => !v)}
                  className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {showPanorama ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                360° viewer uses the latest generated image. For best results, upload or generate an equirectangular (2:1) panorama.
              </p>
              {showPanorama && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-3">
                    <input
                      type="url"
                      value={panoramaUrl}
                      onChange={(e) => setPanoramaUrl(e.target.value)}
                      placeholder="https://example.com/your-panorama.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPanoramaUrl('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@main/equirect.jpg')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm"
                      >
                        Use Sample
                      </button>
                      <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const objectUrl = URL.createObjectURL(file);
                              setPanoramaUrl(objectUrl);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setPanoramaUrl('')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <PanoramaViewer imageUrl={panoramaUrl} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="flex-1 min-w-48 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
              <button className="flex-1 min-w-48 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Generate Another</span>
              </button>
            </div>
          </div>
        )}

        {/* 3D Model Section */}
        {generated3DModel && furnitureLayout.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Interactive 3D Model</h2>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Drag to rotate • Scroll to zoom
                </span>
                <button
                  type="button"
                  onClick={() => setEnable360View(!enable360View)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    enable360View
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {enable360View ? '🌀 360° View On' : '🌀 Enable 360° View'}
                </button>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="mb-4">
              <ThreeDViewer 
                modelData={generated3DModel}
                furnitureLayout={furnitureLayout}
                roomDimensions={roomDimensions}
                enable360View={enable360View}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Furniture Layout</h3>
                <div className="space-y-2">
                  {furnitureLayout.map((furniture, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{furniture.type.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">
                            Position: ({furniture.position.x.toFixed(1)}, {furniture.position.y.toFixed(1)}, {furniture.position.z.toFixed(1)})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{furniture.material}</p>
                        <p className="text-xs text-gray-600">{furniture.color}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Model Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Room Type</span>
                    <span className="font-medium capitalize">{generated3DModel.room_type}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Furniture Count</span>
                    <span className="font-medium">{generated3DModel.furniture_count}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Model Format</span>
                    <span className="font-medium uppercase">{generated3DModel.format}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Generated</span>
                    <span className="font-medium text-green-600">✓ Ready</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="flex-1 min-w-48 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export 3D Model</span>
              </button>
              <button className="flex-1 min-w-48 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Regenerate 3D</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Design;
