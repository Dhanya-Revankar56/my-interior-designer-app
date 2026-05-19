"""
Custom Neural Network Architecture for 3D Interior Design Generation
"""
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

class InteriorDesign3DGenerator:
    def __init__(self, input_dim=128, output_dim=64):
        self.input_dim = input_dim
        self.output_dim = output_dim
        self.model = self._build_model()
    
    def _build_model(self):
        """Build the 3D interior design generation model"""
        
        # Input layers for different types of information
        room_type_input = layers.Input(shape=(10,), name='room_type')  # One-hot encoded room types
        dimensions_input = layers.Input(shape=(3,), name='dimensions')  # length, width, height
        style_input = layers.Input(shape=(4,), name='style')  # One-hot encoded style
        furniture_input = layers.Input(shape=(20,), name='furniture')  # Furniture layout features
        materials_input = layers.Input(shape=(7,), name='materials')  # Material preferences
        colors_input = layers.Input(shape=(8,), name='colors')  # Color scheme
        
        # Embedding and processing layers
        room_embedding = layers.Dense(64, activation='relu')(room_type_input)
        room_embedding = layers.Dropout(0.2)(room_embedding)
        
        dimensions_processed = layers.Dense(32, activation='relu')(dimensions_input)
        dimensions_processed = layers.Dropout(0.1)(dimensions_processed)
        
        style_embedding = layers.Dense(32, activation='relu')(style_input)
        style_embedding = layers.Dropout(0.2)(style_embedding)
        
        furniture_processed = layers.Dense(64, activation='relu')(furniture_input)
        furniture_processed = layers.Dropout(0.2)(furniture_processed)
        
        materials_processed = layers.Dense(32, activation='relu')(materials_input)
        materials_processed = layers.Dropout(0.1)(materials_processed)
        
        colors_processed = layers.Dense(32, activation='relu')(colors_input)
        colors_processed = layers.Dropout(0.1)(colors_processed)
        
        # Concatenate all features
        combined = layers.Concatenate()([
            room_embedding, dimensions_processed, style_embedding,
            furniture_processed, materials_processed, colors_processed
        ])
        
        # Main processing network
        x = layers.Dense(512, activation='relu')(combined)
        x = layers.Dropout(0.3)(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        x = layers.Dense(128, activation='relu')(x)
        x = layers.Dropout(0.2)(x)
        
        # 3D output layers - generating 3D coordinates and features
        # Output: [x, y, z, material_id, color_id, furniture_type]
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dense(128, activation='relu')(x)
        
        # 3D coordinate generation (x, y, z positions)
        coordinates = layers.Dense(3, activation='tanh', name='coordinates')(x)
        
        # Material and color predictions
        material_pred = layers.Dense(7, activation='softmax', name='material')(x)
        color_pred = layers.Dense(8, activation='softmax', name='color')(x)
        
        # Furniture type prediction
        furniture_pred = layers.Dense(20, activation='softmax', name='furniture_type')(x)
        
        # Lighting prediction
        lighting_pred = layers.Dense(2, activation='sigmoid', name='lighting')(x)
        
        # Create model
        model = keras.Model(
            inputs=[
                room_type_input, dimensions_input, style_input,
                furniture_input, materials_input, colors_input
            ],
            outputs=[
                coordinates, material_pred, color_pred, furniture_pred, lighting_pred
            ],
            name='InteriorDesign3DGenerator'
        )
        
        return model
    
    def compile_model(self, learning_rate=0.001):
        """Compile the model with appropriate loss functions and metrics"""
        
        # Define loss functions for different outputs
        losses = {
            'coordinates': 'mse',
            'material': 'categorical_crossentropy',
            'color': 'categorical_crossentropy',
            'furniture_type': 'categorical_crossentropy',
            'lighting': 'mse'
        }
        
        # Define loss weights
        loss_weights = {
            'coordinates': 1.0,
            'material': 0.5,
            'color': 0.5,
            'furniture_type': 0.8,
            'lighting': 0.3
        }
        
        # Define metrics
        metrics = {
            'coordinates': ['mae'],
            'material': ['accuracy'],
            'color': ['accuracy'],
            'furniture_type': ['accuracy'],
            'lighting': ['mae']
        }
        
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
            loss=losses,
            loss_weights=loss_weights,
            metrics=metrics
        )
        
        return self.model
    
    def generate_3d_design(self, input_data):
        """Generate 3D interior design based on input parameters"""
        predictions = self.model.predict(input_data)
        
        result = {
            'coordinates': predictions[0],
            'materials': predictions[1],
            'colors': predictions[2],
            'furniture_types': predictions[3],
            'lighting': predictions[4]
        }
        
        return result
    
    def save_model(self, filepath):
        """Save the trained model"""
        self.model.save(filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        self.model = keras.models.load_model(filepath)
        print(f"Model loaded from {filepath}")

class DataPreprocessor:
    """Preprocess training data for the 3D interior design model"""
    
    def __init__(self):
        self.room_types = [
            'living', 'bedroom', 'kitchen', 'office', 'bathroom', 
            'dining', 'nursery', 'laundry', 'entryway', 'guest'
        ]
        self.styles = ['modern', 'traditional', 'minimalist', 'industrial']
        self.materials = ['wood', 'metal', 'fabric', 'glass', 'leather', 'plastic', 'stone']
        self.colors = ['white', 'black', 'brown', 'gray', 'blue', 'green', 'red', 'yellow']
    
    def encode_room_type(self, room_type):
        """One-hot encode room type"""
        encoding = [0] * len(self.room_types)
        if room_type in self.room_types:
            encoding[self.room_types.index(room_type)] = 1
        return encoding
    
    def encode_style(self, style):
        """One-hot encode style"""
        encoding = [0] * len(self.styles)
        if style in self.styles:
            encoding[self.styles.index(style)] = 1
        return encoding
    
    def encode_materials(self, materials_list):
        """One-hot encode materials"""
        encoding = [0] * len(self.materials)
        for material in materials_list:
            if material in self.materials:
                encoding[self.materials.index(material)] = 1
        return encoding
    
    def encode_colors(self, colors_list):
        """One-hot encode colors"""
        encoding = [0] * len(self.colors)
        for color in colors_list:
            if color in self.colors:
                encoding[self.colors.index(color)] = 1
        return encoding
    
    def encode_furniture_layout(self, furniture_list):
        """Encode furniture layout as feature vector"""
        # Create a 20-dimensional vector representing furniture layout
        features = [0] * 20
        
        for i, furniture in enumerate(furniture_list[:20]):  # Limit to 20 furniture items
            if i < 20:
                # Encode furniture type, position, and size
                features[i] = 1  # Furniture present
                # Additional features could be added here
        
        return features
    
    def normalize_dimensions(self, dimensions):
        """Normalize room dimensions to [0, 1] range"""
        # Assuming max dimensions: length=20, width=16, height=12
        max_dims = [20, 16, 12]
        normalized = [
            dimensions['length'] / max_dims[0],
            dimensions['width'] / max_dims[1],
            dimensions['height'] / max_dims[2]
        ]
        return normalized
    
    def prepare_training_data(self, training_samples):
        """Prepare training data for the model"""
        X = {
            'room_type': [],
            'dimensions': [],
            'style': [],
            'furniture': [],
            'materials': [],
            'colors': []
        }
        
        y = {
            'coordinates': [],
            'material': [],
            'color': [],
            'furniture_type': [],
            'lighting': []
        }
        
        for sample in training_samples:
            # Prepare inputs
            X['room_type'].append(self.encode_room_type(sample['room_type']))
            X['dimensions'].append(self.normalize_dimensions(sample['dimensions']))
            X['style'].append(self.encode_style(sample['style']))
            X['furniture'].append(self.encode_furniture_layout(sample['furniture']))
            X['materials'].append(self.encode_materials(sample['materials']))
            X['colors'].append(self.encode_colors(sample['color_scheme']))
            
            # Prepare outputs (targets) - these would need to be generated from 3D models
            # For now, creating placeholder targets
            y['coordinates'].append([0.5, 0.5, 0.5])  # Center position
            y['material'].append(self.encode_materials(sample['materials']))
            y['color'].append(self.encode_colors(sample['color_scheme']))
            y['furniture_type'].append([1] + [0] * 19)  # Placeholder
            y['lighting'].append([
                sample['lighting']['natural_light'],
                sample['lighting']['artificial_light']
            ])
        
        # Convert to numpy arrays
        for key in X:
            X[key] = np.array(X[key])
        for key in y:
            y[key] = np.array(y[key])
        
        return X, y

if __name__ == "__main__":
    # Test the model architecture
    generator = InteriorDesign3DGenerator()
    model = generator.compile_model()
    
    print("Model Architecture:")
    model.summary()
    
    # Test with sample input
    sample_input = {
        'room_type': np.array([[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]]),  # living room
        'dimensions': np.array([[0.5, 0.6, 0.7]]),  # normalized dimensions
        'style': np.array([[1, 0, 0, 0]]),  # modern
        'furniture': np.array([[1, 1, 1] + [0] * 17]),  # 3 furniture items
        'materials': np.array([[1, 0, 1, 0, 0, 0, 0]]),  # wood and fabric
        'colors': np.array([[1, 0, 0, 0, 0, 0, 0, 0]])  # white
    }
    
    print("\nTesting model prediction:")
    result = generator.generate_3d_design(sample_input)
    print(f"Generated coordinates: {result['coordinates']}")
    print(f"Predicted materials: {result['materials']}")
    print(f"Predicted colors: {result['colors']}")



