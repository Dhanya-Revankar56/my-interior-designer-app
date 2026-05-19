import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Replicate from 'replicate';
import fetch from 'node-fetch';

dotenv.config();

// Import unique image generator functions
function generateUniqueImage(roomType, style, generationType) {
    const timestamp = Date.now();
    const roomHash = roomType.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const styleHash = style.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const uniqueId = (roomHash + styleHash + timestamp) % 1000;
    
    const imageSources = {
        living: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024&h=768&fit=crop'
        ],
        bedroom: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1024&h=768&fit=crop'
        ],
        kitchen: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&h=768&fit=crop'
        ],
        office: [
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&h=768&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1024&h=768&fit=crop'
        ]
    };
    
    const sources = imageSources[roomType] || imageSources.living;
    const selectedImage = sources[uniqueId % sources.length];
    return `${selectedImage}&t=${timestamp}&r=${roomHash}&s=${styleHash}`;
}

function generateUniqueFurnitureLayout(roomType, style) {
    const layouts = {
        living: [
            { type: 'sofa', position: { x: 0.3, y: 0.5, z: 0.2 }, material: 'fabric', color: 'brown' },
            { type: 'coffee_table', position: { x: 0.5, y: 0.5, z: 0.1 }, material: 'wood', color: 'brown' },
            { type: 'tv_stand', position: { x: 0.5, y: 0.1, z: 0.2 }, material: 'wood', color: 'black' },
            { type: 'bookshelf', position: { x: 0.1, y: 0.3, z: 0.2 }, material: 'wood', color: 'brown' },
            { type: 'chair', position: { x: 0.7, y: 0.6, z: 0.2 }, material: 'fabric', color: 'gray' }
        ],
        bedroom: [
            { type: 'bed', position: { x: 0.3, y: 0.7, z: 0.2 }, material: 'wood', color: 'brown' },
            { type: 'nightstand', position: { x: 0.1, y: 0.7, z: 0.2 }, material: 'wood', color: 'brown' },
            { type: 'dresser', position: { x: 0.7, y: 0.3, z: 0.2 }, material: 'wood', color: 'white' },
            { type: 'chair', position: { x: 0.5, y: 0.2, z: 0.2 }, material: 'fabric', color: 'gray' }
        ],
        kitchen: [
            { type: 'kitchen_island', position: { x: 0.5, y: 0.5, z: 0.1 }, material: 'wood', color: 'brown' },
            { type: 'dining_table', position: { x: 0.3, y: 0.2, z: 0.1 }, material: 'wood', color: 'brown' },
            { type: 'chair', position: { x: 0.2, y: 0.2, z: 0.1 }, material: 'wood', color: 'brown' },
            { type: 'chair', position: { x: 0.4, y: 0.2, z: 0.1 }, material: 'wood', color: 'brown' }
        ],
        office: [
            { type: 'desk', position: { x: 0.5, y: 0.5, z: 0.1 }, material: 'wood', color: 'brown' },
            { type: 'chair', position: { x: 0.5, y: 0.3, z: 0.1 }, material: 'fabric', color: 'black' },
            { type: 'bookshelf', position: { x: 0.1, y: 0.3, z: 0.2 }, material: 'wood', color: 'brown' },
            { type: 'chair', position: { x: 0.7, y: 0.6, z: 0.2 }, material: 'fabric', color: 'gray' }
        ]
    };
    
    const baseLayout = layouts[roomType] || layouts.living;
    const styleVariations = {
        modern: { materialPreference: 'wood' },
        traditional: { materialPreference: 'wood' },
        minimalist: { materialPreference: 'wood' },
        industrial: { materialPreference: 'metal' }
    };
    
    const styleConfig = styleVariations[style] || styleVariations.modern;
    
    return baseLayout.map((furniture, index) => {
        const variation = (index + Date.now()) % 3;
        return {
            ...furniture,
            position: {
                x: furniture.position.x + (variation * 0.05),
                y: furniture.position.y + (variation * 0.05),
                z: furniture.position.z
            },
            material: styleConfig.materialPreference === 'metal' && furniture.material === 'wood' ? 'metal' : furniture.material,
            color: styleConfig.materialPreference === 'metal' && furniture.material === 'wood' ? 'gray' : furniture.color
        };
    });
}

function generateUniqueDescription(roomType, style, generationType) {
    const descriptions = {
        living: {
            modern: 'Modern living room with sleek furniture and clean lines',
            traditional: 'Traditional living room with classic furniture and warm tones',
            minimalist: 'Minimalist living room with simple, functional furniture',
            industrial: 'Industrial living room with metal accents and raw materials'
        },
        bedroom: {
            modern: 'Modern bedroom with contemporary furniture and neutral colors',
            traditional: 'Traditional bedroom with classic furniture and warm wood tones',
            minimalist: 'Minimalist bedroom with essential furniture and clean design',
            industrial: 'Industrial bedroom with metal furniture and urban aesthetic'
        },
        kitchen: {
            modern: 'Modern kitchen with sleek appliances and contemporary design',
            traditional: 'Traditional kitchen with classic cabinets and warm wood',
            minimalist: 'Minimalist kitchen with clean lines and essential appliances',
            industrial: 'Industrial kitchen with metal surfaces and urban design'
        },
        office: {
            modern: 'Modern office with contemporary furniture and clean workspace',
            traditional: 'Traditional office with classic furniture and warm wood',
            minimalist: 'Minimalist office with essential furniture and clean design',
            industrial: 'Industrial office with metal furniture and urban aesthetic'
        }
    };
    
    return descriptions[roomType]?.[style] || `Generated ${style} ${roomType} design`;
}

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Replicate client for AI image generation
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// OpenRouter AI image generation function
async function generateImageWithOpenRouter(prompt) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5175',
        'X-Title': 'Interior Design App'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-pro-1.1',
        messages: [
          {
            role: 'user',
            content: `Generate a high-quality interior design image: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // OpenRouter with chat models might return text descriptions
    // For actual image generation, we might need a different approach
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        success: true,
        imageUrl: null, // OpenRouter chat models don't generate images directly
        description: data.choices[0].message.content,
        provider: 'openrouter'
      };
    }
    
    throw new Error('Invalid response from OpenRouter');
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ 
    ok: true,
    replicate_token_configured: !!process.env.REPLICATE_API_TOKEN,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-replicate', async (_req, res) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(400).json({ 
        error: 'No Replicate API token configured',
        configured: false 
      });
    }
    
    // Just verify token is configured - don't make actual API call
    // The actual error will show when generating designs
    res.json({ 
      success: true,
      message: 'Replicate API token is configured',
      token_length: process.env.REPLICATE_API_TOKEN.length,
      note: 'Token validity will be tested when generating designs'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Replicate API test failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get('/api/test-openrouter', async (_req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(400).json({ 
        error: 'No OpenRouter API key configured',
        configured: false 
      });
    }
    
    // Test OpenRouter API connection
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const models = await response.json();
    const imageModels = models.data.filter(model => 
      model.id.includes('flux') || 
      model.id.includes('dall-e') || 
      model.id.includes('midjourney') ||
      model.id.includes('stable-diffusion')
    );
    
    res.json({ 
      success: true,
      message: 'OpenRouter API key is configured',
      token_length: process.env.OPENROUTER_API_KEY.length,
      availableImageModels: imageModels.map(m => ({ id: m.id, name: m.name })).slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'OpenRouter API test failed',
      message: error.message 
    });
  }
});

app.post('/api/design', upload.single('image'), async (req, res) => {
  try {
    // Use Replicate API for image generation
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(400).json({ 
        error: 'replicate_token_required', 
        message: 'Replicate API token is required. Please configure REPLICATE_API_TOKEN in your environment variables.'
      });
    }

    const roomType = String(req.body.roomType || 'living room');
    const generationType = String(req.body.generationType || '2D');
    const imageFile = req.file;
    
    // Parse custom elements if provided
    let customElements = [];
    try {
      if (req.body.customElements) {
        customElements = JSON.parse(req.body.customElements);
      }
    } catch (e) {
      console.error('Error parsing custom elements:', e);
    }
    
    // Parse room dimensions if provided
    let roomDimensions = { length: '', width: '', height: '' };
    try {
      if (req.body.roomDimensions) {
        roomDimensions = JSON.parse(req.body.roomDimensions);
      }
    } catch (e) {
      console.error('Error parsing room dimensions:', e);
    }

    // Create dimension text if provided
    let dimensionText = '';
    if (roomDimensions.length || roomDimensions.width || roomDimensions.height) {
      const dims = [];
      if (roomDimensions.length) dims.push(`${roomDimensions.length}ft long`);
      if (roomDimensions.width) dims.push(`${roomDimensions.width}ft wide`);
      if (roomDimensions.height) dims.push(`${roomDimensions.height}ft high ceiling`);
      dimensionText = ` (room dimensions: ${dims.join(', ')})`;
    }
    
    // Create room-specific prompts with detailed design elements and measurements
    let basePrompt;
    
    // 3D-specific prompt modifications
    const is3D = generationType === '3D';
    const dimensionPrefix = is3D ? 'Three-dimensional, isometric view' : 'Photorealistic, well-lit';
    const perspective = is3D ? ', rendered in 3D perspective with depth and realistic lighting, showing multiple angles and full room layout' : '';
    
    if (roomType === 'living') {
      basePrompt = `A ${dimensionPrefix} living room with modern interior design${dimensionText}, featuring a 3-seater sofa (84 inches long), coffee table (48x24 inches), accent chairs (30 inches wide), 8x10 area rug, wall art with measurements labeled, entertainment center (60 inches wide), bookshelves (72 inches tall), floor and table lamps, throw pillows, and indoor plants. Include visible furniture dimensions and measurements in the image${perspective}`;
    } else if (roomType === 'bedroom') {
      basePrompt = `A ${dimensionPrefix} bedroom with modern interior design${dimensionText}, featuring a queen bed (60x80 inches) with plush bedding, nightstands (24 inches wide), reading lamps, 8x10 area rug, tasteful wall art, blackout curtains, dresser (60 inches wide), full-length mirror (18x60 inches), and indoor plants. Show furniture measurements and dimensions clearly${perspective}`;
    } else if (roomType === 'kitchen') {
      basePrompt = `A ${dimensionPrefix} kitchen with modern interior design${dimensionText}, featuring kitchen island (72x36 inches), pendant lighting, backsplash, upper cabinets (12 inches deep), lower cabinets (24 inches deep), modern appliances with dimensions, and dining table (60x36 inches). Display measurements and dimensions for all major elements${perspective}`;
    } else if (roomType === 'office') {
      basePrompt = `A ${dimensionPrefix} home office with modern interior design${dimensionText}, featuring ergonomic desk (60x30 inches), comfortable office chair, computer setup, bookshelves (72 inches tall, 30 inches wide), filing cabinets (15 inches wide), desk lamp, wall art, indoor plants, and organizational tools. Include furniture dimensions and measurements${perspective}`;
    } else if (roomType === 'bathroom') {
      basePrompt = `A photorealistic, well-lit bathroom with modern interior design${dimensionText}, featuring vanity (48 inches wide), mirror (36 inches wide), shower/tub combo (60 inches long), toilet, storage cabinets (12 inches deep), towel racks, lighting fixtures, and plants. Show measurements for all fixtures`;
    } else if (roomType === 'dining') {
      basePrompt = `A photorealistic, well-lit dining room with modern interior design${dimensionText}, featuring dining table (72x36 inches), 6 dining chairs (18 inches wide each), buffet cabinet (60 inches wide), chandelier, area rug (9x12 feet), wall art, and decorative accessories. Display furniture dimensions clearly`;
    } else if (roomType === 'nursery') {
      basePrompt = `A photorealistic, well-lit nursery with modern interior design${dimensionText}, featuring crib (54x30 inches), changing table (36 inches wide), rocking chair (30 inches wide), dresser (48 inches wide), bookshelf (60 inches tall), soft lighting, wall decals, and storage baskets. Include measurements for safety compliance`;
    } else if (roomType === 'laundry') {
      basePrompt = `A photorealistic, well-lit laundry room with modern interior design${dimensionText}, featuring washer and dryer (27 inches wide each), folding counter (60 inches long), upper cabinets (12 inches deep), utility sink (24 inches wide), hanging rod, storage baskets, and organizational systems. Show appliance and fixture dimensions`;
    } else if (roomType === 'entryway') {
      basePrompt = `A photorealistic, well-lit entryway/foyer with modern interior design${dimensionText}, featuring console table (48x15 inches), mirror (30 inches wide), bench (36 inches long), coat hooks, shoe storage, lighting fixture, area rug (4x6 feet), and decorative elements. Display furniture measurements`;
    } else if (roomType === 'guest') {
      basePrompt = `A photorealistic, well-lit guest room with modern interior design${dimensionText}, featuring full bed (54x75 inches), nightstand (20 inches wide), dresser (54 inches wide), reading chair (28 inches wide), desk (42x24 inches), closet organization, and welcoming decor. Include all furniture dimensions`;
    } else {
      basePrompt = `A ${dimensionPrefix} ${roomType} with modern interior design${dimensionText}, including appropriately sized furniture with visible measurements and dimensions${perspective}`;
    }
    
    // Add custom elements to the prompt
    let customElementsText = '';
    if (customElements.length > 0) {
      customElementsText = `, additionally include: ${customElements.join(', ')}`;
    }
    
    // Combine base prompt with custom elements and standard ending
    const endingText = is3D 
      ? '. Clean walls, natural light, wooden flooring, realistic materials, 8k, highly detailed, 3D isometric architectural visualization with depth and perspective'
      : '. Clean walls, natural light, wooden flooring, realistic materials, 8k, highly detailed, professional interior photography';
    
    const prompt = `${basePrompt}${customElementsText}${endingText}`;

    // Note: Replicate generates images from text prompts
    if (imageFile) {
      console.log('Note: Image upload detected. Replicate will generate a new image based on the text prompt.');
    }

    console.log(`Generating ${generationType} ${roomType} interior design with Replicate AI`);
    console.log('AI Provider: Replicate');
    console.log('Generation type:', generationType);
    console.log('Custom elements:', customElements);
    console.log('Room dimensions:', roomDimensions);
    console.log('Full prompt:', prompt);
    console.log('Replicate API Token configured:', !!process.env.REPLICATE_API_TOKEN);
    console.log('Token length:', process.env.REPLICATE_API_TOKEN?.length);
    
    // Use a fast text-to-image model optimized for speed
    // Using Flux Schnell for fast, high-quality interior design generation
    console.log('Attempting to run Replicate model: black-forest-labs/flux-schnell (fast mode)');
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 768,
          num_outputs: 1,
          output_format: "webp",
          output_quality: 85
        }
      }
    );
    
    console.log('Replicate AI image generated successfully');
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    console.log('Image generation completed successfully');
    
    res.json({ 
      imageUrl: imageUrl,
      generationType: generationType,
      aiProvider: 'Replicate',
      description: `Generated ${generationType} ${roomType} design with ${is3D ? '3D perspective and depth visualization' : 'photorealistic modern interior styling'} using Replicate AI`
    });
  } catch (err) {
    // Log the full error structure for debugging
    // Replicate SDK errors might have different structures
    const errorDetails = {
      message: err.message,
      name: err.name,
      status: err.status || err.statusCode || err.response?.status,
      statusCode: err.statusCode || err.response?.statusCode,
      response: err.response?.data || err.response || err.data || 'No response data',
      body: err.body,
      request: err.request ? { url: err.request?.url, method: err.request?.method } : null,
      // Check for Replicate-specific error properties
      error: err.error,
      detail: err.detail,
      // Get all enumerable properties
      allProperties: Object.keys(err)
    };
    
    console.error('=== REPLICATE API ERROR ===');
    console.error('Error Details (Full):', JSON.stringify(errorDetails, null, 2));
    console.error('Error Object:', err);
    console.error('Error Stack:', err.stack);
    console.error('==========================');
    
    // Check HTTP status codes first (most reliable)
    // Replicate SDK might put status in different places
    const httpStatus = err.status || err.statusCode || err.response?.status || err.response?.statusCode || err.response?.status_code;
    
    // Get error message from various possible locations
    const errorMessage = err.message || err.error?.message || err.detail || err.response?.data?.detail || String(err);
    const errorMessageLower = errorMessage.toLowerCase();
    
    // Check for 401/403 authentication errors
    if (httpStatus === 401 || httpStatus === 403 || 
        (errorMessageLower.includes('api token') || errorMessageLower.includes('authentication') || errorMessageLower.includes('unauthorized') || errorMessageLower.includes('invalid token'))) {
      return res.status(401).json({ 
        error: 'invalid_api_key', 
        message: 'Your Replicate API token is not valid. Please check your REPLICATE_API_TOKEN environment variable and try again.',
        details: errorMessage,
        httpStatus: httpStatus
      });
    }
    
    // Check for 402 Payment Required or 429 Too Many Requests with specific quota messages
    // Only trigger quota error if status is 402 or if message explicitly mentions insufficient credits/quota
    const isQuotaError = httpStatus === 402 || 
      (httpStatus === 429 && (
        errorMessageLower.includes('insufficient credit') ||
        errorMessageLower.includes('quota exceeded') ||
        errorMessageLower.includes('no credits') ||
        errorMessageLower.includes('add credits') ||
        errorMessageLower.includes('payment required') ||
        errorMessageLower.includes('billing')
      )) ||
      (
        errorMessageLower.includes('insufficient credit') ||
        errorMessageLower.includes('quota exceeded') ||
        errorMessageLower.includes('no credits') ||
        errorMessageLower.includes('payment required') ||
        (errorMessageLower.includes('billing') && errorMessageLower.includes('credit'))
      );
    
    if (isQuotaError) {
      return res.status(402).json({ 
        error: 'quota_exceeded', 
        message: 'Your Replicate API quota has been exceeded. Please add credits to your Replicate account.',
        details: errorMessage,
        httpStatus: httpStatus
      });
    }
    
    // Check for rate limit errors (429 without quota message)
    if (httpStatus === 429 && !isQuotaError) {
      return res.status(429).json({ 
        error: 'rate_limited', 
        message: 'Rate limit exceeded. Please wait a moment and try again.',
        details: err.message
      });
    }
    
    // Check for 422 - validation errors (missing required parameters)
    if (httpStatus === 422 || (errorMessageLower.includes('required') && errorMessageLower.includes('input'))) {
      return res.status(422).json({ 
        error: 'validation_error', 
        message: 'The AI model requires additional parameters. The model configuration may need to be updated.',
        details: errorMessage,
        httpStatus: httpStatus
      });
    }
    
    // Check for 404 - model not found
    if (httpStatus === 404 || (err.message && err.message.includes('not found'))) {
      return res.status(404).json({ 
        error: 'model_not_found', 
        message: 'The AI model could not be found. Please check the model configuration.',
        details: err.message
      });
    }
    
    // Generic error message - include actual error for debugging
    const finalErrorMessage = errorMessage || String(err?.message || 'Failed to generate design with Replicate API. Please try again.');
    
    // Always return valid JSON, even on error
    res.status(500).json({ 
      error: 'generation_failed', 
      message: finalErrorMessage,
      provider: 'Replicate',
      details: `HTTP Status: ${httpStatus || 'unknown'}. Check server console for full error details.`,
      rawError: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});





