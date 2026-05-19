"""
Training data structure for 3D interior design generation
"""
import json
import os
from typing import Dict, List, Tuple
import numpy as np

class InteriorDesignDataset:
    def __init__(self, data_dir: str = "training_data"):
        self.data_dir = data_dir
        self.room_types = [
            'living', 'bedroom', 'kitchen', 'office', 'bathroom', 
            'dining', 'nursery', 'laundry', 'entryway', 'guest'
        ]
        self.furniture_categories = [
            'sofa', 'bed', 'dining_table', 'desk', 'chair', 'bookshelf',
            'tv_stand', 'coffee_table', 'nightstand', 'dresser', 'wardrobe'
        ]
        self.materials = [
            'wood', 'metal', 'fabric', 'glass', 'leather', 'plastic', 'stone'
        ]
        self.colors = [
            'white', 'black', 'brown', 'gray', 'blue', 'green', 'red', 'yellow'
        ]
        
    def create_sample_training_data(self):
        """Create sample training data structure"""
        training_data = []
        
        for room_type in self.room_types:
            for i in range(10):  # 10 samples per room type
                sample = {
                    "id": f"{room_type}_{i}",
                    "room_type": room_type,
                    "dimensions": {
                        "length": np.random.uniform(8, 20),
                        "width": np.random.uniform(8, 16),
                        "height": np.random.uniform(8, 12)
                    },
                    "furniture": self._generate_furniture_layout(room_type),
                    "materials": np.random.choice(self.materials, 3, replace=False).tolist(),
                    "color_scheme": np.random.choice(self.colors, 3, replace=False).tolist(),
                    "lighting": {
                        "natural_light": np.random.uniform(0.3, 1.0),
                        "artificial_light": np.random.uniform(0.2, 0.8)
                    },
                    "style": np.random.choice(['modern', 'traditional', 'minimalist', 'industrial']),
                    "3d_model_path": f"models/{room_type}_{i}.obj",
                    "texture_path": f"textures/{room_type}_{i}.jpg",
                    "metadata": {
                        "created_at": "2024-01-01",
                        "quality_score": np.random.uniform(0.7, 1.0),
                        "complexity": np.random.uniform(0.3, 0.9)
                    }
                }
                training_data.append(sample)
        
        return training_data
    
    def _generate_furniture_layout(self, room_type: str) -> List[Dict]:
        """Generate furniture layout for specific room type"""
        furniture_templates = {
            'living': [
                {'type': 'sofa', 'position': [0.3, 0.5, 0.2], 'size': [2.0, 0.8, 0.9]},
                {'type': 'coffee_table', 'position': [0.5, 0.5, 0.1], 'size': [1.2, 0.6, 0.4]},
                {'type': 'tv_stand', 'position': [0.5, 0.1, 0.2], 'size': [1.5, 0.4, 0.6]}
            ],
            'bedroom': [
                {'type': 'bed', 'position': [0.3, 0.7, 0.2], 'size': [2.0, 1.5, 0.6]},
                {'type': 'nightstand', 'position': [0.1, 0.7, 0.2], 'size': [0.5, 0.4, 0.6]},
                {'type': 'dresser', 'position': [0.7, 0.3, 0.2], 'size': [1.2, 0.6, 0.8]}
            ],
            'kitchen': [
                {'type': 'kitchen_island', 'position': [0.5, 0.5, 0.1], 'size': [2.0, 1.0, 0.9]},
                {'type': 'dining_table', 'position': [0.3, 0.2, 0.1], 'size': [1.5, 0.8, 0.75]},
                {'type': 'cabinet', 'position': [0.1, 0.3, 0.2], 'size': [0.6, 0.6, 0.8]}
            ]
        }
        
        return furniture_templates.get(room_type, [])
    
    def save_training_data(self, data: List[Dict], filename: str = "training_data.json"):
        """Save training data to JSON file"""
        os.makedirs(self.data_dir, exist_ok=True)
        filepath = os.path.join(self.data_dir, filename)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Training data saved to {filepath}")
    
    def load_training_data(self, filename: str = "training_data.json") -> List[Dict]:
        """Load training data from JSON file"""
        filepath = os.path.join(self.data_dir, filename)
        with open(filepath, 'r') as f:
            return json.load(f)

if __name__ == "__main__":
    dataset = InteriorDesignDataset()
    training_data = dataset.create_sample_training_data()
    dataset.save_training_data(training_data)
    print(f"Created {len(training_data)} training samples")



