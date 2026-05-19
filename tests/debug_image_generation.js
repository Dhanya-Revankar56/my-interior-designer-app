/**
 * Debug script to check image generation and identify why same images are generated
 */
const fs = require('fs');
const path = require('path');

function debugImageGeneration() {
    console.log('🔍 Debugging Image Generation Issues\n');
    
    // Check if ML API is configured
    console.log('1. Checking ML API configuration...');
    const serverJsPath = path.join(__dirname, 'server.js');
    if (fs.existsSync(serverJsPath)) {
        const serverContent = fs.readFileSync(serverJsPath, 'utf8');
        
        if (serverContent.includes('useCustomML = true')) {
            console.log('✅ Custom ML is enabled in server.js');
        } else {
            console.log('❌ Custom ML is not enabled in server.js');
        }
        
        if (serverContent.includes('ML_API_URL')) {
            console.log('✅ ML API URL is configured');
        } else {
            console.log('❌ ML API URL is not configured');
        }
        
        if (serverContent.includes('mlError')) {
            console.log('✅ ML error handling is present');
        } else {
            console.log('❌ ML error handling is missing');
        }
    } else {
        console.log('❌ server.js not found');
    }
    
    // Check ML models directory
    console.log('\n2. Checking ML models directory...');
    const mlModelsPath = path.join(__dirname, 'ml_models');
    if (fs.existsSync(mlModelsPath)) {
        console.log('✅ ML models directory exists');
        
        const files = fs.readdirSync(mlModelsPath);
        console.log(`   Files: ${files.join(', ')}`);
        
        if (files.includes('ml_api.py')) {
            console.log('✅ ml_api.py exists');
        } else {
            console.log('❌ ml_api.py missing');
        }
        
        if (files.includes('3d_model_generator.py')) {
            console.log('✅ 3d_model_generator.py exists');
        } else {
            console.log('❌ 3d_model_generator.py missing');
        }
    } else {
        console.log('❌ ML models directory not found');
    }
    
    // Check if ML API is running
    console.log('\n3. Checking ML API status...');
    console.log('   Run: npm run test:api to test the ML API');
    
    // Common issues and solutions
    console.log('\n4. Common Issues and Solutions:');
    console.log('   ❌ Same image for everything:');
    console.log('      - ML API not running: npm run ml:api');
    console.log('      - ML API not responding: check http://localhost:5000/api/health');
    console.log('      - Fallback to same Unsplash image');
    console.log('   ❌ No 3D models:');
    console.log('      - Three.js not loaded properly');
    console.log('      - Furniture layout data missing');
    console.log('      - 3D viewer component not rendering');
    
    console.log('\n5. Debug Steps:');
    console.log('   1. Start ML API: npm run ml:api');
    console.log('   2. Test ML API: npm run test:api');
    console.log('   3. Check browser console for errors');
    console.log('   4. Verify 3D viewer is loading');
    console.log('   5. Check network tab for API calls');
    
    console.log('\n6. Expected Behavior:');
    console.log('   ✅ Different room types should generate different furniture layouts');
    console.log('   ✅ Different styles should generate different materials and colors');
    console.log('   ✅ Each request should create unique 3D models');
    console.log('   ✅ 3D viewer should show interactive models');
    
    console.log('\n🎯 If you\'re still seeing the same image:');
    console.log('   1. The ML API is not running or not responding');
    console.log('   2. The system is falling back to the same Unsplash image');
    console.log('   3. Check the browser network tab to see what API calls are being made');
    console.log('   4. Look for error messages in the browser console');
}

if (require.main === module) {
    debugImageGeneration();
}

module.exports = { debugImageGeneration };








