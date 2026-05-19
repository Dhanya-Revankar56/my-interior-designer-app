/**
 * Test script to verify ML API generates unique content
 */
const fetch = require('node-fetch');

async function testMLAPI() {
    console.log('🧪 Testing ML API for unique content generation...\n');
    
    const testCases = [
        { roomType: 'living', style: 'modern', generationType: '3D' },
        { roomType: 'bedroom', style: 'minimalist', generationType: '3D' },
        { roomType: 'kitchen', style: 'industrial', generationType: '3D' },
        { roomType: 'office', style: 'traditional', generationType: '3D' }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Test ${i + 1}: ${testCase.roomType} ${testCase.style}`);
        
        try {
            const response = await fetch('http://localhost:5000/api/design', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomType: testCase.roomType,
                    style: testCase.style,
                    dimensions: { length: 12, width: 10, height: 9 },
                    customElements: [],
                    generationType: testCase.generationType
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Success: ${data.description}`);
                console.log(`   Image URL: ${data.imageUrl ? data.imageUrl.substring(0, 50) + '...' : 'No image'}`);
                console.log(`   Furniture count: ${data.furniture_layout ? data.furniture_layout.length : 0}`);
                console.log(`   Room type: ${data.design ? data.design.room_type : 'Unknown'}`);
                console.log('');
            } else {
                console.log(`❌ Failed: ${response.status} ${response.statusText}`);
                const errorText = await response.text();
                console.log(`   Error: ${errorText}`);
                console.log('');
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
            console.log('');
        }
    }
    
    console.log('🎯 Test completed!');
    console.log('If you see the same image URLs, the ML API is not generating unique content.');
    console.log('If you see different descriptions and furniture counts, the ML API is working correctly.');
}

// Check if ML API is running
async function checkMLAPI() {
    try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ ML API is running');
            console.log(`   Model loaded: ${data.model_loaded}`);
            console.log(`   Model type: ${data.model_type}`);
            return true;
        } else {
            console.log('❌ ML API not responding');
            return false;
        }
    } catch (error) {
        console.log('❌ ML API not accessible');
        console.log('   Make sure to run: npm run ml:api');
        return false;
    }
}

async function main() {
    console.log('🔍 Checking ML API status...');
    
    const isRunning = await checkMLAPI();
    if (!isRunning) {
        console.log('\n💡 To start the ML API, run:');
        console.log('   npm run ml:api');
        console.log('   or');
        console.log('   cd ml_models && python ml_api.py');
        return;
    }
    
    console.log('\n🧪 Running content generation tests...');
    await testMLAPI();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testMLAPI, checkMLAPI };











