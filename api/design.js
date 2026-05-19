import Replicate from 'replicate';
import { IncomingForm } from 'formidable';
import fs from 'fs';

// Disable default body parser for multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
  runtime: 'nodejs18.x'
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(401).json({ 
        error: 'missing_api_key', 
        message: 'Replicate API token is not configured. Please add your API token to the environment variables.'
      });
    }

    // Parse the multipart form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const roomType = String(fields.roomType?.[0] || 'living room');
    const imageFile = files.image?.[0];
    
    // Parse custom elements if provided
    let customElements = [];
    try {
      if (fields.customElements?.[0]) {
        customElements = JSON.parse(fields.customElements[0]);
      }
    } catch (e) {
      console.error('Error parsing custom elements:', e);
    }

    // Create room-specific prompts with detailed design elements
    let basePrompt;
    
    if (roomType === 'bedroom') {
      basePrompt = `A photorealistic, well-lit bedroom with modern interior design, featuring a comfortable bed with plush bedding, stylish nightstands, elegant reading lamps, a cozy area rug, tasteful wall art, blackout curtains, a dresser, full-length mirror, and indoor plants`;
    } else if (roomType === 'living') {
      basePrompt = `A photorealistic, well-lit living room with modern interior design, featuring a comfortable sofa, coffee table, accent chairs, area rug, wall art, entertainment center, bookshelves, floor and table lamps, throw pillows, and indoor plants`;
    } else if (roomType === 'kitchen') {
      basePrompt = `A photorealistic, well-lit kitchen with modern interior design, featuring sleek countertops, modern appliances, island with seating, pendant lighting, backsplash, organized cabinets, kitchen tools, small appliances, and a dining area`;
    } else if (roomType === 'office') {
      basePrompt = `A photorealistic, well-lit home office with modern interior design, featuring an ergonomic desk, comfortable office chair, computer setup, bookshelves, filing cabinets, desk lamp, wall art, indoor plants, and organizational tools`;
    } else {
      basePrompt = `A photorealistic, well-lit ${roomType} with modern interior design`;
    }
    
    // Add custom elements to the prompt
    let customElementsText = '';
    if (customElements.length > 0) {
      customElementsText = `, additionally include: ${customElements.join(', ')}`;
    }
    
    // Combine base prompt with custom elements and standard ending
    const prompt = `${basePrompt}${customElementsText}. Clean walls, natural light, wooden flooring, realistic materials, 8k, highly detailed, professional interior photography`;

    let input = {
      prompt: prompt,
      width: 1024,
      height: 768,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 50
    };
    
    // If image is provided, use it for image-to-image generation
    if (imageFile) {
      // Read the uploaded file
      const imageBuffer = fs.readFileSync(imageFile.filepath);
      const base64Image = `data:${imageFile.mimetype};base64,${imageBuffer.toString('base64')}`;
      input.image = base64Image;
      input.prompt_strength = 0.8;
    }

    // Use Replicate's interior design model
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      { input }
    );
    
    // The output is typically an array with the generated image URL
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    res.json({ 
      imageUrl: imageUrl,
      description: `Generated ${roomType} design with modern interior styling` 
    });
  } catch (err) {
    console.error('Replicate API Error:', err);
    
    // Check for specific Replicate API errors
    if (err.message && (err.message.includes('API token') || err.message.includes('authentication'))) {
      return res.status(401).json({ 
        error: 'invalid_api_key', 
        message: 'Your Replicate API token is not valid. Please check your API token and try again.'
      });
    }
    
    if (err.message && (err.message.includes('quota') || err.message.includes('credit'))) {
      return res.status(429).json({ 
        error: 'quota_exceeded', 
        message: 'Your Replicate API quota has been exceeded. Please add credits to your account.'
      });
    }
    
    if (err.message && err.message.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'rate_limited', 
        message: 'Rate limit exceeded. Please wait a moment and try again.'
      });
    }
    
    res.status(500).json({ 
      error: 'generation_failed', 
      message: String(err?.message || 'Failed to generate design. Please try again.')
    });
  }
}
