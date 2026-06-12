import fetch from 'node-fetch';
import 'dotenv/config';

async function testOpenRouterText() {
  console.log('Testing OpenRouter Text Generation...');
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error('No OPENROUTER_API_KEY found in .env');
    return;
  }
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5175',
        'X-Title': 'Interior Design App'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          {
            role: 'user',
            content: 'Generate a JSON array of 3 real furniture products that are a "blue sofa". For each product, include "title", "retailer" (e.g. IKEA, Amazon, Wayfair), "price" (e.g. $799), "rating" (e.g. 4.5), and "redirectUrl" (a real search or product page on the retailer\'s site). Return only raw JSON.'
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response content:', data.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('OpenRouter text generation failed:', error.message);
  }
}

testOpenRouterText();
