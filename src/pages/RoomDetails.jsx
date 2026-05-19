import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ThreeDViewer from '../components/ThreeDViewer';

function RoomDetails() {
  const { id } = useParams();
  
  // Room data based on ID
  const roomsData = {
    1: {
      title: 'Living Room',
      description: 'A cozy space for family time and entertaining guests.',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Comfortable seating', 'Natural lighting', 'Entertainment center', 'Coffee table'],
      dimensions: '16\'x12\'',
      style: 'Modern Contemporary',
      colorPalette: ['#8bc34a', '#ffffff', '#2c3e50', '#ecf0f1'],
      furniture: [
        { item: 'Sectional Sofa', price: '₹1,08,000', description: 'L-shaped sectional with premium fabric' },
        { item: 'Coffee Table', price: '₹33,200', description: 'Glass top with wooden legs' },
        { item: 'Table Lamps', price: '₹12,400', description: 'Set of 2 modern table lamps' },
        { item: 'Area Rug', price: '₹24,900', description: '8x10 geometric pattern rug' }
      ],
      roomDimensions: { length: 16, width: 12, height: 9 },
      furnitureLayout: [
        { type: 'sofa', position: { x: 0.3, y: 0.5 }, color: 'gray' },
        { type: 'coffee_table', position: { x: 0.5, y: 0.5 } },
        { type: 'tv_stand', position: { x: 0.7, y: 0.3 }, color: 'black' },
        { type: 'dining_table', position: { x: 0.5, y: 0.7 } }
      ]
    },
    2: {
      title: 'Bedroom',
      description: 'A tranquil retreat designed for rest and relaxation.',
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['King size bed', 'Walk-in closet', 'Reading nook', 'Blackout curtains'],
      dimensions: '14\'x12\'',
      style: 'Scandinavian Minimalist',
      colorPalette: ['#689f38', '#ffffff', '#f5f5f5', '#8bc34a'],
      furniture: [
        { item: 'Platform Bed', price: '₹74,800', description: 'King size with built-in nightstands' },
        { item: 'Dresser', price: '₹45,700', description: '6-drawer with mirror' },
        { item: 'Bedside Lamps', price: '₹7,400', description: 'Minimalist pendant lights' },
        { item: 'Accent Chair', price: '₹33,200', description: 'Comfortable reading chair' }
      ],
      roomDimensions: { length: 14, width: 12, height: 9 },
      furnitureLayout: [
        { type: 'bed', position: { x: 0.5, y: 0.5 }, color: 'white' },
        { type: 'nightstand', position: { x: 0.4, y: 0.5 }, color: 'white' },
        { type: 'dresser', position: { x: 0.5, y: 0.3 }, color: 'white' }
      ]
    },
    3: {
      title: 'Kitchen',
      description: 'A functional and stylish kitchen for culinary creativity.',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Island with seating', 'Stainless appliances', 'Granite countertops', 'Custom cabinets'],
      dimensions: '12\'x10\'',
      style: 'Modern Farmhouse',
      colorPalette: ['#7cb342', '#ffffff', '#34495e', '#aed581'],
      furniture: [
        { item: 'Kitchen Island', price: '₹1,33,200', description: 'With storage and seating for 3' },
        { item: 'Bar Stools', price: '₹16,600', description: 'Set of 3 adjustable height stools' },
        { item: 'Pendant Lights', price: '₹24,900', description: 'Industrial style over island' },
        { item: 'Storage Cabinet', price: '₹37,400', description: 'Pantry-style with glass doors' }
      ],
      roomDimensions: { length: 12, width: 10, height: 9 },
      furnitureLayout: [
        { type: 'dining_table', position: { x: 0.5, y: 0.5 } },
        { type: 'chair', position: { x: 0.4, y: 0.5 }, color: 'white' },
        { type: 'chair', position: { x: 0.6, y: 0.5 }, color: 'white' }
      ]
    },
    4: {
      title: 'Home Office',
      description: 'A productive workspace with ergonomic design.',
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      features: ['Standing desk', 'Ergonomic chair', 'Built-in storage', 'Natural lighting'],
      dimensions: '10\'x8\'',
      style: 'Contemporary Professional',
      colorPalette: ['#558b2f', '#ffffff', '#263238', '#c5e1a5'],
      furniture: [
        { item: 'Standing Desk', price: '₹58,200', description: 'Electric adjustable height desk' },
        { item: 'Office Chair', price: '₹37,400', description: 'Ergonomic with lumbar support' },
        { item: 'Bookshelf', price: '₹24,900', description: 'Modern 5-tier shelving unit' },
        { item: 'Desk Lamp', price: '₹10,700', description: 'LED with adjustable arm' }
      ],
      roomDimensions: { length: 10, width: 8, height: 9 },
      furnitureLayout: [
        { type: 'desk', position: { x: 0.5, y: 0.5 }, color: 'brown' },
        { type: 'chair', position: { x: 0.5, y: 0.6 } },
        { type: 'bookshelf', position: { x: 0.8, y: 0.5 }, color: 'brown' }
      ]
    }
  };
  
  const room = roomsData[id] || {
    title: `Room ${id}`,
    description: 'Room details not available.',
    imageUrl: null,
    features: [],
    dimensions: 'N/A',
    style: 'N/A',
    colorPalette: ['#8bc34a'],
    furniture: []
  };
  
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-green-600 transition-colors duration-200">Home</Link>
        <span>→</span>
        <span className="text-green-600 font-medium">{room.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {room.title}
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{room.description}</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-200">
                <span className="text-sm font-medium text-gray-600">Dimensions</span>
                <div className="text-lg font-bold text-green-700">{room.dimensions}</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-200">
                <span className="text-sm font-medium text-gray-600">Style</span>
                <div className="text-lg font-bold text-green-700">{room.style}</div>
              </div>
            </div>
          </div>
          <div className="relative">
            {room.imageUrl ? (
              <img 
                src={room.imageUrl} 
                alt={room.title} 
                className="w-full h-80 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl flex items-center justify-center">
                <span className="text-green-700 font-medium">Image Not Available</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              ID: {id}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Room Viewer */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></span>
          3D Room Viewer
        </h2>
        <ThreeDViewer 
          furnitureLayout={room.furnitureLayout} 
          roomDimensions={room.roomDimensions} 
          enable360View={true} 
        />
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></span>
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {room.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></span>
          Color Palette
        </h2>
        <div className="flex flex-wrap gap-4">
          {room.colorPalette.map((color, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-16 h-16 rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Furniture & Pricing */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></span>
          Furniture & Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {room.furniture.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg">{item.item}</h3>
                <span className="text-2xl font-bold text-green-600">{item.price}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Complete Room Package</h3>
              <p className="opacity-90">Get everything for this room at a special price</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ₹{room.furniture.reduce((total, item) => total + parseInt(item.price.replace('₹', '').replace(/,/g, '')), 0).toLocaleString('en-IN')}
              </div>
              <button className="mt-2 bg-white text-green-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Buy Package
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="flex justify-center pt-4">
        <Link 
          to="/"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to All Rooms</span>
        </Link>
      </div>
    </div>
  );
}

export default RoomDetails;

