"""
Setup script for the custom ML 3D Interior Design system
"""
import os
import subprocess
import sys

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        return False
    return True

def create_directories():
    """Create necessary directories"""
    directories = [
        "training_data",
        "saved_models", 
        "logs",
        "models",
        "textures"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def generate_training_data():
    """Generate sample training data"""
    print("Generating training data...")
    try:
        from training_data.data_structure import InteriorDesignDataset
        dataset = InteriorDesignDataset()
        training_data = dataset.create_sample_training_data()
        dataset.save_training_data(training_data)
        print(f"Generated {len(training_data)} training samples")
    except Exception as e:
        print(f"Error generating training data: {e}")
        return False
    return True

def train_model():
    """Train the ML model"""
    print("Training the ML model...")
    try:
        from train_model import ModelTrainer
        trainer = ModelTrainer()
        model, history = trainer.train_model(epochs=20, batch_size=16)
        print("Model training completed!")
        return True
    except Exception as e:
        print(f"Error training model: {e}")
        return False

def start_ml_api():
    """Start the ML API server"""
    print("Starting ML API server...")
    try:
        subprocess.Popen([sys.executable, "ml_api.py"])
        print("ML API server started on http://localhost:5000")
        return True
    except Exception as e:
        print(f"Error starting ML API: {e}")
        return False

def main():
    """Main setup function"""
    print("Setting up Custom ML 3D Interior Design System")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        print("Failed to install requirements. Please install manually.")
        return
    
    # Generate training data
    if not generate_training_data():
        print("Failed to generate training data.")
        return
    
    # Train model
    if not train_model():
        print("Failed to train model.")
        return
    
    # Start ML API
    if not start_ml_api():
        print("Failed to start ML API.")
        return
    
    print("\nSetup completed successfully!")
    print("The ML API is running on http://localhost:5000")
    print("You can now use the custom ML model for 3D interior design generation.")

if __name__ == "__main__":
    main()



