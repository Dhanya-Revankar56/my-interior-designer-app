import fetch from 'node-fetch';
import 'dotenv/config';

async function testModels() {
  const key = process.env.OPENROUTER_API_KEY;
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${key}` }
    });
    if (!res.ok) {
      console.log(`Failed to fetch models: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(text);
      return;
    }
    const data = await res.json();
    console.log('Successfully fetched models list!');
    console.log('Total models:', data.data?.length);
    const freeModels = data.data?.filter(m => m.id.includes('free')) || [];
    console.log('Free models available:', freeModels.map(m => m.id).slice(0, 15));
  } catch (err) {
    console.error('Error fetching models:', err.message);
  }
}

testModels();
