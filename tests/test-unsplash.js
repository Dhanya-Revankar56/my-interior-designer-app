import fetch from 'node-fetch';

async function testUnsplash() {
  const query = 'blue sofa';
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
  
  try {
    console.log(`Fetching from Unsplash napi: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Success! Results found:', data.results?.length);
    if (data.results && data.results.length > 0) {
      console.log('First result image URL:', data.results[0].urls.regular);
    }
  } catch (error) {
    console.error('Unsplash napi fetch failed:', error.message);
  }
}

testUnsplash();
