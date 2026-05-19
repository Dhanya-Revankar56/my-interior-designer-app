import fetch from 'node-fetch';
import 'dotenv/config';

async function testOpenRouter() {
  console.log('Testing OpenRouter API...');
  
  try {
    // Test API key validation
    console.log('🔑 API Key configured:', !!process.env.OPENROUTER_API_KEY);
    console.log('🔑 Key length:', process.env.OPENROUTER_API_KEY?.length || 0);
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8787/api/health');
    const health = await healthResponse.json();
    console.log('🏥 Health check:', health);
    
    // Test OpenRouter endpoint
    const testResponse = await fetch('http://localhost:8787/api/test-openrouter');
    const testResult = await testResponse.json();
    console.log('🧪 OpenRouter test result:', testResult);
    
    // Test actual design generation
    const formData = new FormData();
    formData.append('roomType', 'living');
    formData.append('generationType', '2D');
    formData.append('customElements', JSON.stringify(['TV', 'bookshelf']));
    formData.append('roomDimensions', JSON.stringify({ length: '12', width: '10', height: '9' }));
    
    console.log('🎨 Testing design generation...');
    const designResponse = await fetch('http://localhost:8787/api/design', {
      method: 'POST',
      body: formData
    });
    
    const designResult = await designResponse.json();
    console.log('✨ Design generation result:', designResult);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOpenRouter();
