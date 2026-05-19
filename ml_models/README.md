# Custom ML 3D Interior Design System

This directory contains a custom machine learning system for generating 3D interior designs, replacing the external AI APIs with a trained neural network.

## Overview

The system uses a custom TensorFlow/Keras neural network to generate 3D interior designs based on:
- Room type (living, bedroom, kitchen, etc.)
- Style preferences (modern, traditional, minimalist, industrial)
- Room dimensions
- Furniture preferences
- Material and color choices

## Architecture

### Components

1. **Data Structure** (`training_data/data_structure.py`)
   - Defines the training data format
   - Creates sample training data with room types, furniture, materials, colors
   - Handles data preprocessing and encoding

2. **Model Architecture** (`model_architecture.py`)
   - Custom neural network for 3D interior design generation
   - Multi-input architecture handling different feature types
   - Outputs 3D coordinates, materials, colors, furniture types, and lighting

3. **Training Pipeline** (`train_model.py`)
   - Complete training pipeline with data splitting
   - Model compilation with appropriate loss functions
   - Training callbacks and monitoring
   - Model evaluation and visualization

4. **ML API** (`ml_api.py`)
   - Flask API for serving the trained model
   - Converts ML outputs to 3D model format
   - Integrates with the main Node.js server

5. **Setup Script** (`setup_ml.py`)
   - Automated setup and installation
   - Training data generation
   - Model training and API startup

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js (for the main application)
- Sufficient RAM (8GB+ recommended for training)

### Quick Setup

```bash
# Navigate to the ml_models directory
cd ml_models

# Run the setup script
python setup_ml.py
```

This will:
1. Install all Python dependencies
2. Create necessary directories
3. Generate training data
4. Train the ML model
5. Start the ML API server

### Manual Setup

If you prefer to set up manually:

```bash
# Install dependencies
pip install -r requirements.txt

# Generate training data
python training_data/data_structure.py

# Train the model
python train_model.py

# Start the ML API
python ml_api.py
```

## Usage

### Training the Model

```python
from train_model import ModelTrainer

trainer = ModelTrainer()
model, history = trainer.train_model(epochs=50, batch_size=16)
```

### Generating Designs

```python
from model_architecture import InteriorDesign3DGenerator

generator = InteriorDesign3DGenerator()
result = generator.generate_3d_design(input_data)
```

### API Usage

The ML API provides endpoints for generating 3D designs:

```bash
# Health check
curl http://localhost:5000/api/health

# Generate design
curl -X POST http://localhost:5000/api/design \
  -H "Content-Type: application/json" \
  -d '{
    "roomType": "living",
    "style": "modern",
    "dimensions": {"length": 12, "width": 10, "height": 9},
    "customElements": ["sofa", "coffee_table"],
    "generationType": "3D"
  }'
```

## Model Architecture

### Input Features

- **Room Type**: One-hot encoded (10 room types)
- **Dimensions**: Normalized length, width, height
- **Style**: One-hot encoded (4 styles)
- **Furniture**: 20-dimensional furniture layout vector
- **Materials**: One-hot encoded (7 materials)
- **Colors**: One-hot encoded (8 colors)

### Output Features

- **Coordinates**: 3D position (x, y, z)
- **Materials**: Material probability distribution
- **Colors**: Color probability distribution
- **Furniture Types**: Furniture type probabilities
- **Lighting**: Natural and artificial lighting levels

### Network Architecture

```
Input Layers (Multiple)
    ↓
Embedding/Processing Layers
    ↓
Concatenation Layer
    ↓
Dense Layers (512 → 256 → 128)
    ↓
Output Layers (Coordinates, Materials, Colors, Furniture, Lighting)
```

## Training Data

The system generates synthetic training data with:
- 10 room types × 10 samples = 100 training samples
- Realistic furniture layouts per room type
- Material and color combinations
- Lighting preferences
- Style variations

## Integration with Main App

The custom ML system integrates with the main Node.js application:

1. **Server Integration**: The main `server.js` calls the ML API instead of external AI services
2. **Fallback System**: If the ML API fails, it falls back to placeholder images
3. **3D Model Output**: Generates structured 3D model data for frontend rendering

## Customization

### Adding New Room Types

1. Update `room_types` list in `data_structure.py`
2. Add furniture templates in `_generate_furniture_layout()`
3. Retrain the model

### Adding New Styles

1. Update `styles` list in `data_structure.py`
2. Modify style encoding in `DataPreprocessor`
3. Retrain the model

### Improving Model Performance

1. **More Training Data**: Add more diverse training samples
2. **Data Augmentation**: Implement data augmentation techniques
3. **Architecture Tuning**: Experiment with different network architectures
4. **Hyperparameter Tuning**: Optimize learning rate, batch size, etc.

## File Structure

```
ml_models/
├── requirements.txt          # Python dependencies
├── setup_ml.py             # Setup script
├── README.md               # This file
├── training_data/
│   └── data_structure.py   # Training data generation
├── model_architecture.py  # Neural network architecture
├── train_model.py          # Training pipeline
├── ml_api.py              # Flask API server
├── saved_models/          # Trained model files
├── logs/                  # Training logs
├── models/               # 3D model files
└── textures/            # Texture files
```

## Troubleshooting

### Common Issues

1. **Memory Issues**: Reduce batch size or use smaller model
2. **Training Slow**: Use GPU acceleration if available
3. **API Connection**: Ensure ML API is running on port 5000
4. **Model Loading**: Check if model files exist in `saved_models/`

### Performance Optimization

1. **GPU Training**: Install TensorFlow GPU version
2. **Model Quantization**: Use TensorFlow Lite for deployment
3. **Caching**: Implement model result caching
4. **Batch Processing**: Process multiple requests together

## Future Enhancements

1. **Real 3D Rendering**: Integrate with Three.js for actual 3D visualization
2. **More Training Data**: Collect real interior design data
3. **Advanced Architectures**: Implement GANs or VAEs for better generation
4. **Real-time Generation**: Optimize for faster inference
5. **User Feedback**: Implement learning from user preferences

## Contributing

To contribute to the ML system:

1. Add new features to the model architecture
2. Improve training data generation
3. Optimize the training pipeline
4. Enhance the API endpoints
5. Add better 3D visualization

## License

This ML system is part of the interior design application and follows the same license terms.



