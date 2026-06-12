import fetch from 'node-fetch';

async function testShopRoute() {
  console.log('Testing Shop Search API route...');
  
  try {
    const url = 'http://localhost:8787/api/shop/search?q=chair&color=green';
    console.log(`Sending request to: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully received furniture data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Shop route test failed:', error.message);
  }
}

testShopRoute();
