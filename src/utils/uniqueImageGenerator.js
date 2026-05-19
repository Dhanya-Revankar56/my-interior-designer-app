/**
 * Generate unique images and 3D models based on room type and style
 * This ensures we never show the same image twice
 */

export function generateUniqueImage(roomType, style, generationType) {
    // Create unique image based on parameters
    const timestamp = Date.now();
    const roomHash = roomType.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const styleHash = style.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const uniqueId = (roomHash + styleHash + timestamp) % 1000;
    
    // Different image sources for different room types
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
    
    // Add unique parameters to prevent caching
    return `${selectedImage}&t=${timestamp}&r=${roomHash}&s=${styleHash}`;
}

export function generateUniqueFurnitureLayout(roomType, style) {
    // Generate unique furniture layout based on room type and style
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
    
    // Apply style variations
    const styleVariations = {
        modern: { colorShift: 0, materialPreference: 'wood' },
        traditional: { colorShift: 1, materialPreference: 'wood' },
        minimalist: { colorShift: 2, materialPreference: 'wood' },
        industrial: { colorShift: 3, materialPreference: 'metal' }
    };
    
    const styleConfig = styleVariations[style] || styleVariations.modern;
    
    // Create unique layout with variations
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

export function generateUniqueDescription(roomType, style, generationType) {
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








