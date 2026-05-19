# Interior Designer App

## Overview
This application allows you to upload photos of empty rooms and generate redesigned interior images using AI.

## Setup Instructions

### Prerequisites
- Node.js installed
- NPM installed
- A Google AI Studio account for Gemini API access

### Getting a Gemini API Key
1. Sign up at [Google AI Studio](https://aistudio.google.com/)
2. Go to your API keys section
3. Generate an API key
4. Copy the key

### Configuration
1. Open the `.env` file in the root directory
2. Replace the value for `REPLICATE_API_TOKEN` with your actual Replicate API token
3. Replace the value for `OPENROUTER_API_KEY` with your actual OpenRouter API key
4. Update the Firebase configuration values with your own Firebase project credentials

### Installation
```bash
npm install
```

### Running the Application
Start both the API server and frontend development server:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Start the API server
node server.js

# In another terminal, start the frontend
npm run dev
```

## Using the Application
1. Navigate to http://localhost:5175 in your browser
2. Upload a photo of an empty room
3. Select the room type
4. Add custom elements (optional)
   - Type the name of an element (e.g., "TV", "bookshelf", "piano")
   - Click "Add" or press Enter
   - Add multiple elements as needed
   - Remove elements by clicking the × button
5. Click "Generate design"
6. Wait for the AI to generate a redesigned interior with your custom elements

## Troubleshooting
- If image generation fails, check that your Gemini API key is correctly set in the `.env` file
- Ensure your Gemini API quota has not been exceeded
- Check the browser console and server logs for any error messages
- Note that the current implementation uses Gemini for text generation only, with a placeholder image URL
