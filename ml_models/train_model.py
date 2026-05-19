"""
Training pipeline for the 3D Interior Design Generation Model
"""
import os
import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import tensorflow as tf

from model_architecture import InteriorDesign3DGenerator, DataPreprocessor
from training_data.data_structure import InteriorDesignDataset

class ModelTrainer:
    def __init__(self, data_dir="training_data", model_dir="saved_models"):
        self.data_dir = data_dir
        self.model_dir = model_dir
        self.generator = InteriorDesign3DGenerator()
        self.preprocessor = DataPreprocessor()
        
        # Create directories
        os.makedirs(self.model_dir, exist_ok=True)
        os.makedirs("logs", exist_ok=True)
    
    def load_training_data(self):
        """Load and preprocess training data"""
        print("Loading training data...")
        
        # Load the dataset
        dataset = InteriorDesignDataset(self.data_dir)
        
        # Create sample data if it doesn't exist
        data_file = os.path.join(self.data_dir, "training_data.json")
        if not os.path.exists(data_file):
            print("Creating sample training data...")
            training_data = dataset.create_sample_training_data()
            dataset.save_training_data(training_data)
        else:
            training_data = dataset.load_training_data()
        
        print(f"Loaded {len(training_data)} training samples")
        
        # Preprocess the data
        X, y = self.preprocessor.prepare_training_data(training_data)
        
        return X, y
    
    def split_data(self, X, y, test_size=0.2, val_size=0.1):
        """Split data into train, validation, and test sets"""
        print("Splitting data...")
        
        # First split: train+val vs test
        X_temp, X_test, y_temp, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Second split: train vs val
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, test_size=val_size/(1-test_size), random_state=42
        )
        
        print(f"Training set: {len(X_train['room_type'])} samples")
        print(f"Validation set: {len(X_val['room_type'])} samples")
        print(f"Test set: {len(X_test['room_type'])} samples")
        
        return (X_train, y_train), (X_val, y_val), (X_test, y_test)
    
    def setup_callbacks(self):
        """Setup training callbacks"""
        callbacks = [
            EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            ),
            ModelCheckpoint(
                filepath=os.path.join(self.model_dir, 'best_model.h5'),
                monitor='val_loss',
                save_best_only=True,
                verbose=1
            )
        ]
        return callbacks
    
    def train_model(self, epochs=100, batch_size=32):
        """Train the 3D interior design model"""
        print("Starting model training...")
        
        # Load and preprocess data
        X, y = self.load_training_data()
        
        # Split data
        (X_train, y_train), (X_val, y_val), (X_test, y_test) = self.split_data(X, y)
        
        # Compile model
        model = self.generator.compile_model()
        
        # Setup callbacks
        callbacks = self.setup_callbacks()
        
        # Train model
        print("Training model...")
        history = model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Save final model
        final_model_path = os.path.join(self.model_dir, 'final_model.h5')
        model.save(final_model_path)
        print(f"Final model saved to {final_model_path}")
        
        # Plot training history
        self.plot_training_history(history)
        
        # Evaluate on test set
        test_loss = model.evaluate(X_test, y_test, verbose=0)
        print(f"Test loss: {test_loss}")
        
        return model, history
    
    def plot_training_history(self, history):
        """Plot training history"""
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        
        # Plot loss
        axes[0, 0].plot(history.history['loss'], label='Training Loss')
        axes[0, 0].plot(history.history['val_loss'], label='Validation Loss')
        axes[0, 0].set_title('Model Loss')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Loss')
        axes[0, 0].legend()
        
        # Plot coordinates loss
        axes[0, 1].plot(history.history['coordinates_loss'], label='Training')
        axes[0, 1].plot(history.history['val_coordinates_loss'], label='Validation')
        axes[0, 1].set_title('Coordinates Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        
        # Plot material accuracy
        axes[0, 2].plot(history.history['material_accuracy'], label='Training')
        axes[0, 2].plot(history.history['val_material_accuracy'], label='Validation')
        axes[0, 2].set_title('Material Accuracy')
        axes[0, 2].set_xlabel('Epoch')
        axes[0, 2].set_ylabel('Accuracy')
        axes[0, 2].legend()
        
        # Plot color accuracy
        axes[1, 0].plot(history.history['color_accuracy'], label='Training')
        axes[1, 0].plot(history.history['val_color_accuracy'], label='Validation')
        axes[1, 0].set_title('Color Accuracy')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('Accuracy')
        axes[1, 0].legend()
        
        # Plot furniture accuracy
        axes[1, 1].plot(history.history['furniture_type_accuracy'], label='Training')
        axes[1, 1].plot(history.history['val_furniture_type_accuracy'], label='Validation')
        axes[1, 1].set_title('Furniture Type Accuracy')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Accuracy')
        axes[1, 1].legend()
        
        # Plot lighting loss
        axes[1, 2].plot(history.history['lighting_loss'], label='Training')
        axes[1, 2].plot(history.history['val_lighting_loss'], label='Validation')
        axes[1, 2].set_title('Lighting Loss')
        axes[1, 2].set_xlabel('Epoch')
        axes[1, 2].set_ylabel('Loss')
        axes[1, 2].legend()
        
        plt.tight_layout()
        plt.savefig('training_history.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def generate_sample_design(self, model, room_type='living', style='modern'):
        """Generate a sample 3D design"""
        print(f"Generating {style} {room_type} design...")
        
        # Prepare input
        room_type_encoded = self.preprocessor.encode_room_type(room_type)
        style_encoded = self.preprocessor.encode_style(style)
        
        # Sample dimensions and other features
        dimensions = [0.5, 0.6, 0.7]  # Normalized dimensions
        furniture = [1, 1, 1] + [0] * 17  # 3 furniture items
        materials = [1, 0, 1, 0, 0, 0, 0]  # wood and fabric
        colors = [1, 0, 0, 0, 0, 0, 0, 0]  # white
        
        input_data = {
            'room_type': np.array([room_type_encoded]),
            'dimensions': np.array([dimensions]),
            'style': np.array([style_encoded]),
            'furniture': np.array([furniture]),
            'materials': np.array([materials]),
            'colors': np.array([colors])
        }
        
        # Generate design
        result = self.generator.generate_3d_design(input_data)
        
        print("Generated 3D Design:")
        print(f"Coordinates: {result['coordinates']}")
        print(f"Materials: {result['materials']}")
        print(f"Colors: {result['colors']}")
        print(f"Furniture Types: {result['furniture_types']}")
        print(f"Lighting: {result['lighting']}")
        
        return result

def main():
    """Main training function"""
    print("Starting 3D Interior Design Model Training")
    print("=" * 50)
    
    # Initialize trainer
    trainer = ModelTrainer()
    
    # Train model
    model, history = trainer.train_model(epochs=50, batch_size=16)
    
    # Generate sample designs
    print("\nGenerating sample designs...")
    trainer.generate_sample_design(model, 'living', 'modern')
    trainer.generate_sample_design(model, 'bedroom', 'minimalist')
    trainer.generate_sample_design(model, 'kitchen', 'industrial')
    
    print("\nTraining completed!")

if __name__ == "__main__":
    main()



