# 🏠 3D Interior Design Generation System

This system generates **actual 3D models** for interior design, not just 2D images. It creates interactive 3D rooms with furniture that you can view, rotate, and export.

## 🎯 What It Does

- **Generates Real 3D Models**: Creates actual 3D meshes with furniture, walls, and rooms
- **Interactive 3D Viewer**: View and manipulate 3D models in the browser
- **Room-Specific Layouts**: Different furniture for living rooms, bedrooms, kitchens, etc.
- **Style Variations**: Modern, traditional, minimalist, industrial styles
- **Export Functionality**: Download 3D models as OBJ, GLTF, or PLY files

## 🚀 Quick Start

### Option 1: Quick Start (Recommended)
```bash
npm run ml:start
```
This will:
- Check all dependencies
- Test 3D model generation
- Start the ML API server
- Show you next steps

### Option 2: Manual Setup
```bash
# Install Python dependencies
cd ml_models
pip install -r requirements.txt

# Test 3D generation
npm run ml:test

# Start ML API
npm run ml:api

# In another terminal, start the main app
npm run dev
```

## 🎨 How to Use

1. **Open the App**: Go to http://localhost:5175
2. **Select 3D Mode**: Choose "3D Model" generation type
3. **Choose Room Type**: Living, bedroom, kitchen, office, etc.
4. **Pick Style**: Modern, traditional, minimalist, industrial
5. **Add Dimensions**: Optional room dimensions
6. **Generate**: Click "Generate AI Design"
7. **View 3D Model**: Interactive 3D viewer will appear
8. **Export**: Download the 3D model

## 🏗️ 3D Model Features

### Furniture Types
- **Living Room**: Sofa, coffee table, TV stand, bookshelf, chair
- **Bedroom**: Bed, nightstand, dresser, chair
- **Kitchen**: Kitchen island, dining table, chairs
- **Office**: Desk, chair, bookshelf, filing cabinet

### Materials & Colors
- **Materials**: Wood, metal, fabric, glass, leather, plastic, stone
- **Colors**: White, black, brown, gray, blue, green, red, yellow
- **Style Variations**: Different materials and colors per style

### 3D Viewer Controls
- **Mouse Drag**: Rotate the 3D model
- **Scroll Wheel**: Zoom in/out
- **Furniture Labels**: Hover to see furniture details
- **Real-time Rendering**: Smooth 3D graphics

## 🔧 Technical Details

### Architecture
```
User Input → ML Model → 3D Generator → Three.js Viewer → Export
```

### Components
1. **ML Model**: Custom neural network for furniture prediction
2. **3D Generator**: Creates 3D meshes and room layouts
3. **Three.js Viewer**: Interactive 3D rendering
4. **Export System**: Multiple 3D file formats

### File Structure
```
ml_models/
├── 3d_model_generator.py      # 3D model creation
├── ml_api.py                  # Flask API server
├── test_3d_generation.py      # Test script
├── quick_start.py             # Quick start script
└── requirements.txt           # Python dependencies

src/components/
└── ThreeDViewer.jsx           # 3D viewer component
```

## 🐛 Troubleshooting

### Common Issues

1. **"Same image for everything"**
   - The system now generates unique 3D models for each room type and style
   - Each generation creates different furniture layouts and positions

2. **"Not generating 3D images"**
   - Make sure ML API is running: `npm run ml:start`
   - Check browser console for errors
   - Verify Three.js is loaded properly

3. **"ML API not responding"**
   - Run: `npm run ml:test` to test the system
   - Check if Python dependencies are installed
   - Restart the ML API: `npm run ml:api`

4. **"3D viewer not showing"**
   - Check if Three.js is properly imported
   - Verify the furniture layout data is being passed
   - Check browser console for JavaScript errors

### Debug Steps

1. **Test ML System**:
   ```bash
   npm run ml:test
   ```

2. **Check ML API**:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for API calls

4. **Verify 3D Generation**:
   - Look for "3D Model generated" in console
   - Check if furniture layout data is present
   - Verify Three.js scene is created

## 📊 System Status

### ✅ Working Features
- ✅ 3D model generation with unique layouts
- ✅ Interactive 3D viewer with Three.js
- ✅ Room-specific furniture layouts
- ✅ Style variations (modern, traditional, etc.)
- ✅ Material and color variations
- ✅ Export functionality
- ✅ Real-time 3D rendering

### 🔄 In Progress
- 🔄 Advanced 3D materials and textures
- 🔄 More furniture types and variations
- 🔄 Room lighting simulation
- 🔄 VR/AR support

## 🎯 Expected Results

When working correctly, you should see:

1. **Unique 3D Models**: Each generation creates different furniture layouts
2. **Interactive Viewer**: 3D model you can rotate and zoom
3. **Furniture Details**: Different furniture types with materials and colors
4. **Room Layouts**: Proper room structure with walls, floor, ceiling
5. **Export Options**: Download 3D models in various formats

## 🚀 Next Steps

1. **Generate Your First 3D Model**:
   - Select "3D Model" generation type
   - Choose a room type (living, bedroom, etc.)
   - Pick a style (modern, traditional, etc.)
   - Click "Generate AI Design"

2. **Explore the 3D Viewer**:
   - Drag to rotate the model
   - Scroll to zoom in/out
   - Check the furniture layout details

3. **Export Your Model**:
   - Click "Export 3D Model" to download
   - Use in other 3D software like Blender, Maya, etc.

## 📞 Support

If you're still having issues:

1. **Check the logs**: Look at browser console and terminal output
2. **Test the system**: Run `npm run ml:test`
3. **Restart everything**: Stop all processes and restart
4. **Check dependencies**: Make sure all Python packages are installed

The system is designed to generate **unique 3D models** for each request, not the same image. Each room type and style combination creates different furniture layouts and positions.











