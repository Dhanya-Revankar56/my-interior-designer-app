"""
Flask API for Custom ML 3D Interior Design Generation
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from model_architecture import InteriorDesign3DGenerator, DataPreprocessor
from 3d_model_generator import ML3DModelGenerator

app = Flask(__name__)
CORS(app)

class MLDesignAPI:
    def __init__(self):
        self.generator = InteriorDesign3DGenerator()
        self.preprocessor = DataPreprocessor()
        self.model_loaded = False
        self.model_3d_generator = ML3DModelGenerator()
        
        # Try to load pre-trained model
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        model_path = "saved_models/best_model.h5"
        if os.path.exists(model_path):
            try:
                self.generator.load_model(model_path)
                self.model_loaded = True
                print(f"Model loaded from {model_path}")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model_loaded = False
        else:
            print(f"Model file not found at {model_path}")
            self.model_loaded = False
    
    def generate_3d_design(self, room_type, style, dimensions, custom_elements=None):
        """Generate 3D interior design using custom ML model"""
        try:
            # Prepare input data
            room_type_encoded = self.preprocessor.encode_room_type(room_type)
            style_encoded = self.preprocessor.encode_style(style)
            
            # Normalize dimensions
            normalized_dims = self.preprocessor.normalize_dimensions(dimensions)
            
            # Default furniture layout (can be enhanced based on custom_elements)
            furniture_layout = [1, 1, 1] + [0] * 17  # 3 furniture items
            
            # Default materials and colors (can be customized)
            materials = [1, 0, 1, 0, 0, 0, 0]  # wood and fabric
            colors = [1, 0, 0, 0, 0, 0, 0, 0]  # white
            
            # Prepare input data
            input_data = {
                'room_type': np.array([room_type_encoded]),
                'dimensions': np.array([normalized_dims]),
                'style': np.array([style_encoded]),
                'furniture': np.array([furniture_layout]),
                'materials': np.array([materials]),
                'colors': np.array([colors])
            }
            
            # Generate 3D design
            result = self.generator.generate_3d_design(input_data)
            
            # Generate actual 3D model
            model_result = self.model_3d_generator.generate_3d_model_from_ml(
                result, room_type, style, dimensions
            )
            
            if model_result['success']:
                # Create 3D model URL
                model_url = self.model_3d_generator.create_3d_model_url(
                    model_result['model_metadata']['model_file']
                )
                
                # Generate preview image from 3D model data
                preview_image = _generate_3d_preview_image(
                    room_type, style, model_result['furniture_layout']
                )
                
                return {
                    'success': True,
                    'design': model_result['model_metadata'],
                    'model_url': model_url,
                    'imageUrl': f"data:image/png;base64,{preview_image}",
                    'model_type': 'custom_ml_3d',
                    'description': f'Generated 3D {style} {room_type} model using custom ML',
                    'furniture_layout': model_result['furniture_layout']
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to generate 3D model',
                    'model_type': 'custom_ml'
                }
            
        except Exception as e:
            print(f"Error generating design: {e}")
            return {
                'success': False,
                'error': str(e),
                'model_type': 'custom_ml'
            }
    
    def _convert_to_3d_model(self, ml_result, room_type, style):
        """Convert ML model output to 3D model format"""
        coordinates = ml_result['coordinates'][0]
        materials = ml_result['materials'][0]
        colors = ml_result['colors'][0]
        furniture_types = ml_result['furniture_types'][0]
        lighting = ml_result['lighting'][0]
        
        # Create 3D model structure
        design = {
            'room_type': room_type,
            'style': style,
            'furniture': [],
            'materials': [],
            'lighting': {
                'natural': float(lighting[0]),
                'artificial': float(lighting[1])
            },
            'coordinates': {
                'x': float(coordinates[0]),
                'y': float(coordinates[1]),
                'z': float(coordinates[2])
            }
        }
        
        # Add furniture based on predictions
        furniture_names = [
            'sofa', 'bed', 'dining_table', 'desk', 'chair', 'bookshelf',
            'tv_stand', 'coffee_table', 'nightstand', 'dresser', 'wardrobe',
            'kitchen_island', 'cabinet', 'dining_chair', 'ottoman',
            'side_table', 'lamp', 'mirror', 'plant', 'artwork'
        ]
        
        for i, prob in enumerate(furniture_types):
            if prob > 0.3:  # Threshold for including furniture
                furniture_item = {
                    'type': furniture_names[i] if i < len(furniture_names) else f'furniture_{i}',
                    'probability': float(prob),
                    'position': {
                        'x': float(coordinates[0] + np.random.normal(0, 0.1)),
                        'y': float(coordinates[1] + np.random.normal(0, 0.1)),
                        'z': float(coordinates[2] + np.random.normal(0, 0.1))
                    }
                }
                design['furniture'].append(furniture_item)
        
        # Add materials
        material_names = ['wood', 'metal', 'fabric', 'glass', 'leather', 'plastic', 'stone']
        for i, prob in enumerate(materials):
            if prob > 0.2:
                design['materials'].append({
                    'type': material_names[i],
                    'probability': float(prob)
                })
        
        return design

# Initialize API
ml_api = MLDesignAPI()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': ml_api.model_loaded,
        'model_type': 'custom_ml'
    })

@app.route('/api/design', methods=['POST'])
def generate_design():
    """Generate 3D interior design using custom ML model"""
    try:
        # Get request data
        data = request.get_json()
        
        room_type = data.get('roomType', 'living')
        style = data.get('style', 'modern')
        dimensions = data.get('dimensions', {'length': 12, 'width': 10, 'height': 9})
        custom_elements = data.get('customElements', [])
        generation_type = data.get('generationType', '3D')
        
        print(f"Generating {generation_type} {style} {room_type} design...")
        
        # Generate design using ML model
        result = ml_api.generate_3d_design(
            room_type=room_type,
            style=style,
            dimensions=dimensions,
            custom_elements=custom_elements
        )
        
        if result['success']:
            # Convert 3D model to image URL (placeholder for now)
            # In a real implementation, you would render the 3D model to an image
            image_url = f"data:image/png;base64,{_generate_placeholder_image(room_type, style)}"
            
            return jsonify({
            'imageUrl': image_url,
            'generationType': generation_type,
            'aiProvider': 'Custom ML Model',
            'description': result['description'],
            'design': result['design']
        })
        else:
            return jsonify({
                'error': 'generation_failed',
                'message': result['error']
            }), 500
            
    except Exception as e:
        print(f"API Error: {e}")
        return jsonify({
            'error': 'api_error',
            'message': str(e)
        }), 500

def _generate_3d_preview_image(room_type, style, furniture_layout):
    """Generate a preview image from 3D model data"""
    import base64
    from PIL import Image, ImageDraw, ImageFont
    import numpy as np
    
    # Create a more detailed preview image based on the 3D model
    img = Image.new('RGB', (1024, 768), color='#f0f0f0')
    draw = ImageDraw.Draw(img)
    
    # Add room background
    room_width = 800
    room_height = 600
    room_x = (1024 - room_width) // 2
    room_y = (768 - room_height) // 2
    
    # Draw room outline
    draw.rectangle([room_x, room_y, room_x + room_width, room_y + room_height], 
                   outline='#333333', width=3)
    
    # Draw furniture based on layout
    for i, furniture in enumerate(furniture_layout):
        # Scale furniture positions to image coordinates
        x = room_x + int(furniture['position']['x'] * room_width)
        y = room_y + int(furniture['position']['y'] * room_height)
        
        # Draw furniture rectangle
        furniture_size = 40 + (i * 10)  # Vary size based on furniture type
        color = _get_furniture_color(furniture.get('color', 'brown'))
        
        draw.rectangle([x - furniture_size//2, y - furniture_size//2, 
                       x + furniture_size//2, y + furniture_size//2], 
                      fill=color, outline='#000000', width=2)
        
        # Add furniture label
        try:
            font = ImageFont.truetype("arial.ttf", 12)
        except:
            font = ImageFont.load_default()
        
        label = furniture['type'].replace('_', ' ').title()
        draw.text((x - 20, y - 20), label, fill='black', font=font)
    
    # Add title
    try:
        title_font = ImageFont.truetype("arial.ttf", 36)
    except:
        title_font = ImageFont.load_default()
    
    title = f"{style.title()} {room_type.title()} - 3D Model"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    text_width = bbox[2] - bbox[0]
    title_x = (1024 - text_width) // 2
    draw.text((title_x, 20), title, fill='#333333', font=title_font)
    
    # Add 3D indicator
    draw.text((20, 20), "3D MODEL", fill='#0066cc', font=title_font)
    
    # Convert to base64
    import io
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return img_str

def _get_furniture_color(color_name):
    """Get RGB color for furniture"""
    colors = {
        'white': '#FFFFFF',
        'black': '#000000', 
        'brown': '#8B4513',
        'gray': '#808080',
        'blue': '#0000FF',
        'green': '#008000',
        'red': '#FF0000',
        'yellow': '#FFFF00'
    }
    return colors.get(color_name, '#8B4513')

@app.route('/api/train', methods=['POST'])
def train_model():
    """Trigger model training (for development)"""
    try:
        # This would typically be run separately, but included for completeness
        from train_model import ModelTrainer
        
        trainer = ModelTrainer()
        model, history = trainer.train_model(epochs=10, batch_size=16)
        
        return jsonify({
            'success': True,
            'message': 'Model training completed',
            'epochs': len(history.history['loss'])
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Custom ML 3D Interior Design API")
    print("=" * 50)
    print(f"Model loaded: {ml_api.model_loaded}")
    
    if not ml_api.model_loaded:
        print("Warning: No pre-trained model found. Please train the model first.")
        print("Run: python train_model.py")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
