"""
3D Model Generator for Interior Design
Creates actual 3D models with meshes, geometry, and materials
"""
import numpy as np
import json
import os
from typing import Dict, List, Tuple
import trimesh
import open3d as o3d

class Furniture3DGenerator:
    """Generate 3D furniture models"""
    
    def __init__(self):
        self.furniture_templates = {
            'sofa': {
                'geometry': 'box',
                'dimensions': [2.0, 0.8, 0.9],
                'materials': ['fabric', 'wood'],
                'colors': ['brown', 'gray', 'blue']
            },
            'bed': {
                'geometry': 'box',
                'dimensions': [2.0, 1.5, 0.6],
                'materials': ['wood', 'fabric'],
                'colors': ['white', 'brown', 'gray']
            },
            'dining_table': {
                'geometry': 'box',
                'dimensions': [1.5, 0.8, 0.75],
                'materials': ['wood', 'metal'],
                'colors': ['brown', 'black', 'white']
            },
            'desk': {
                'geometry': 'box',
                'dimensions': [1.2, 0.6, 0.75],
                'materials': ['wood', 'metal'],
                'colors': ['brown', 'black', 'white']
            },
            'chair': {
                'geometry': 'box',
                'dimensions': [0.5, 0.5, 1.0],
                'materials': ['wood', 'fabric'],
                'colors': ['brown', 'black', 'gray']
            },
            'bookshelf': {
                'geometry': 'box',
                'dimensions': [0.3, 0.6, 1.8],
                'materials': ['wood'],
                'colors': ['brown', 'white', 'black']
            },
            'tv_stand': {
                'geometry': 'box',
                'dimensions': [1.5, 0.4, 0.6],
                'materials': ['wood', 'metal'],
                'colors': ['black', 'brown', 'white']
            },
            'coffee_table': {
                'geometry': 'box',
                'dimensions': [1.2, 0.6, 0.4],
                'materials': ['wood', 'glass'],
                'colors': ['brown', 'black', 'white']
            },
            'nightstand': {
                'geometry': 'box',
                'dimensions': [0.5, 0.4, 0.6],
                'materials': ['wood'],
                'colors': ['brown', 'white', 'black']
            },
            'dresser': {
                'geometry': 'box',
                'dimensions': [1.2, 0.6, 0.8],
                'materials': ['wood'],
                'colors': ['brown', 'white', 'black']
            }
        }
    
    def create_furniture_mesh(self, furniture_type: str, position: Tuple[float, float, float], 
                            material: str = 'wood', color: str = 'brown') -> trimesh.Trimesh:
        """Create a 3D mesh for a furniture piece"""
        if furniture_type not in self.furniture_templates:
            furniture_type = 'chair'  # Default fallback
        
        template = self.furniture_templates[furniture_type]
        dimensions = template['dimensions']
        
        # Create basic box geometry
        if template['geometry'] == 'box':
            mesh = trimesh.creation.box(extents=dimensions)
        
        # Apply material properties
        mesh.visual.face_colors = self._get_color_rgb(color)
        
        # Position the mesh
        mesh.apply_translation(position)
        
        return mesh
    
    def _get_color_rgb(self, color: str) -> Tuple[int, int, int]:
        """Convert color name to RGB values"""
        color_map = {
            'white': (255, 255, 255),
            'black': (0, 0, 0),
            'brown': (139, 69, 19),
            'gray': (128, 128, 128),
            'blue': (0, 0, 255),
            'green': (0, 128, 0),
            'red': (255, 0, 0),
            'yellow': (255, 255, 0)
        }
        return color_map.get(color, (128, 128, 128))

class Room3DGenerator:
    """Generate complete 3D room models"""
    
    def __init__(self):
        self.furniture_generator = Furniture3DGenerator()
    
    def create_room_mesh(self, room_type: str, dimensions: Dict, style: str, 
                        furniture_layout: List[Dict]) -> trimesh.Scene:
        """Create a complete 3D room model"""
        scene = trimesh.Scene()
        
        # Create room walls
        room_mesh = self._create_room_walls(dimensions)
        scene.add_geometry(room_mesh, node_name='room_walls')
        
        # Create floor
        floor_mesh = self._create_floor(dimensions)
        scene.add_geometry(floor_mesh, node_name='floor')
        
        # Create ceiling
        ceiling_mesh = self._create_ceiling(dimensions)
        scene.add_geometry(ceiling_mesh, node_name='ceiling')
        
        # Add furniture
        for furniture in furniture_layout:
            furniture_mesh = self.furniture_generator.create_furniture_mesh(
                furniture['type'],
                furniture['position'],
                furniture.get('material', 'wood'),
                furniture.get('color', 'brown')
            )
            scene.add_geometry(furniture_mesh, node_name=f"furniture_{furniture['type']}")
        
        return scene
    
    def _create_room_walls(self, dimensions: Dict) -> trimesh.Trimesh:
        """Create room walls"""
        length = dimensions['length']
        width = dimensions['width']
        height = dimensions['height']
        
        # Create walls as separate meshes
        walls = []
        
        # Front wall (with door opening)
        front_wall = trimesh.creation.box(extents=[length, 0.2, height])
        front_wall.apply_translation([0, width/2, height/2])
        walls.append(front_wall)
        
        # Back wall
        back_wall = trimesh.creation.box(extents=[length, 0.2, height])
        back_wall.apply_translation([0, -width/2, height/2])
        walls.append(back_wall)
        
        # Left wall
        left_wall = trimesh.creation.box(extents=[0.2, width, height])
        left_wall.apply_translation([-length/2, 0, height/2])
        walls.append(left_wall)
        
        # Right wall
        right_wall = trimesh.creation.box(extents=[0.2, width, height])
        right_wall.apply_translation([length/2, 0, height/2])
        walls.append(right_wall)
        
        # Combine all walls
        combined_walls = trimesh.util.concatenate(walls)
        combined_walls.visual.face_colors = (240, 240, 240)  # Light gray
        
        return combined_walls
    
    def _create_floor(self, dimensions: Dict) -> trimesh.Trimesh:
        """Create room floor"""
        length = dimensions['length']
        width = dimensions['width']
        
        floor = trimesh.creation.box(extents=[length, width, 0.1])
        floor.visual.face_colors = (139, 69, 19)  # Brown wood color
        
        return floor
    
    def _create_ceiling(self, dimensions: Dict) -> trimesh.Trimesh:
        """Create room ceiling"""
        length = dimensions['length']
        width = dimensions['width']
        height = dimensions['height']
        
        ceiling = trimesh.creation.box(extents=[length, width, 0.1])
        ceiling.apply_translation([0, 0, height])
        ceiling.visual.face_colors = (255, 255, 255)  # White
        
        return ceiling
    
    def export_3d_model(self, scene: trimesh.Scene, filepath: str, format: str = 'obj'):
        """Export 3D model to file"""
        if format.lower() == 'obj':
            scene.export(filepath)
        elif format.lower() == 'gltf':
            # Convert to GLTF format
            gltf_data = scene.export('gltf')
            with open(filepath, 'wb') as f:
                f.write(gltf_data)
        elif format.lower() == 'ply':
            scene.export(filepath)
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        print(f"3D model exported to {filepath}")

class ML3DModelGenerator:
    """Generate 3D models from ML predictions"""
    
    def __init__(self):
        self.room_generator = Room3DGenerator()
    
    def generate_3d_model_from_ml(self, ml_result: Dict, room_type: str, style: str, 
                                dimensions: Dict) -> Dict:
        """Generate 3D model from ML predictions"""
        
        # Create varied furniture layout based on room type and style
        furniture_layout = self._create_room_specific_layout(room_type, style, dimensions)
        
        # If ML result has furniture data, use it to enhance the layout
        if 'furniture' in ml_result and ml_result['furniture']:
            for furniture in ml_result['furniture']:
                furniture_item = {
                    'type': furniture['type'],
                    'position': {
                        'x': furniture['position']['x'],
                        'y': furniture['position']['y'], 
                        'z': furniture['position']['z']
                    },
                    'material': furniture.get('material', 'wood'),
                    'color': furniture.get('color', 'brown')
                }
                furniture_layout.append(furniture_item)
        
        # Create 3D room model
        room_scene = self.room_generator.create_room_mesh(
            room_type, dimensions, style, furniture_layout
        )
        
        # Export to temporary file
        temp_file = f"temp_3d_model_{room_type}_{style}.obj"
        self.room_generator.export_3d_model(room_scene, temp_file, 'obj')
        
        # Generate model metadata
        model_metadata = {
            'room_type': room_type,
            'style': style,
            'dimensions': dimensions,
            'furniture_count': len(furniture_layout),
            'model_file': temp_file,
            'format': 'obj',
            'created_at': str(np.datetime64('now'))
        }
        
        return {
            'success': True,
            'model_metadata': model_metadata,
            'scene': room_scene,
            'furniture_layout': furniture_layout
        }
    
    def _create_room_specific_layout(self, room_type: str, style: str, dimensions: Dict) -> List[Dict]:
        """Create furniture layout specific to room type and style"""
        import random
        
        furniture_layout = []
        
        # Room-specific furniture templates
        room_templates = {
            'living': [
                {'type': 'sofa', 'position': {'x': 0.3, 'y': 0.5, 'z': 0.2}, 'material': 'fabric', 'color': 'brown'},
                {'type': 'coffee_table', 'position': {'x': 0.5, 'y': 0.5, 'z': 0.1}, 'material': 'wood', 'color': 'brown'},
                {'type': 'tv_stand', 'position': {'x': 0.5, 'y': 0.1, 'z': 0.2}, 'material': 'wood', 'color': 'black'},
                {'type': 'bookshelf', 'position': {'x': 0.1, 'y': 0.3, 'z': 0.2}, 'material': 'wood', 'color': 'brown'},
                {'type': 'chair', 'position': {'x': 0.7, 'y': 0.6, 'z': 0.2}, 'material': 'fabric', 'color': 'gray'}
            ],
            'bedroom': [
                {'type': 'bed', 'position': {'x': 0.3, 'y': 0.7, 'z': 0.2}, 'material': 'wood', 'color': 'brown'},
                {'type': 'nightstand', 'position': {'x': 0.1, 'y': 0.7, 'z': 0.2}, 'material': 'wood', 'color': 'brown'},
                {'type': 'dresser', 'position': {'x': 0.7, 'y': 0.3, 'z': 0.2}, 'material': 'wood', 'color': 'white'},
                {'type': 'chair', 'position': {'x': 0.5, 'y': 0.2, 'z': 0.2}, 'material': 'fabric', 'color': 'gray'}
            ],
            'kitchen': [
                {'type': 'kitchen_island', 'position': {'x': 0.5, 'y': 0.5, 'z': 0.1}, 'material': 'wood', 'color': 'brown'},
                {'type': 'dining_table', 'position': {'x': 0.3, 'y': 0.2, 'z': 0.1}, 'material': 'wood', 'color': 'brown'},
                {'type': 'chair', 'position': {'x': 0.2, 'y': 0.2, 'z': 0.1}, 'material': 'wood', 'color': 'brown'},
                {'type': 'chair', 'position': {'x': 0.4, 'y': 0.2, 'z': 0.1}, 'material': 'wood', 'color': 'brown'}
            ],
            'office': [
                {'type': 'desk', 'position': {'x': 0.5, 'y': 0.5, 'z': 0.1}, 'material': 'wood', 'color': 'brown'},
                {'type': 'chair', 'position': {'x': 0.5, 'y': 0.3, 'z': 0.1}, 'material': 'fabric', 'color': 'black'},
                {'type': 'bookshelf', 'position': {'x': 0.1, 'y': 0.3, 'z': 0.2}, 'material': 'wood', 'color': 'brown'},
                {'type': 'chair', 'position': {'x': 0.7, 'y': 0.6, 'z': 0.2}, 'material': 'fabric', 'color': 'gray'}
            ]
        }
        
        # Get base furniture for room type
        base_furniture = room_templates.get(room_type, room_templates['living'])
        
        # Apply style variations
        style_variations = {
            'modern': {'color_shift': 0, 'material_preference': 'wood'},
            'traditional': {'color_shift': 1, 'material_preference': 'wood'},
            'minimalist': {'color_shift': 2, 'material_preference': 'wood'},
            'industrial': {'color_shift': 3, 'material_preference': 'metal'}
        }
        
        style_config = style_variations.get(style, style_variations['modern'])
        
        # Create varied furniture layout
        for furniture in base_furniture:
            # Add some randomness to positions
            furniture_item = {
                'type': furniture['type'],
                'position': {
                    'x': furniture['position']['x'] + random.uniform(-0.1, 0.1),
                    'y': furniture['position']['y'] + random.uniform(-0.1, 0.1),
                    'z': furniture['position']['z']
                },
                'material': furniture['material'],
                'color': furniture['color']
            }
            
            # Apply style variations
            if style_config['material_preference'] == 'metal' and furniture['material'] == 'wood':
                furniture_item['material'] = 'metal'
                furniture_item['color'] = 'gray'
            
            furniture_layout.append(furniture_item)
        
        return furniture_layout
    
    def create_3d_model_url(self, model_file: str) -> str:
        """Create a URL for the 3D model file"""
        # In a real implementation, you would upload to a file server
        # For now, return a placeholder URL
        return f"http://localhost:5000/models/{os.path.basename(model_file)}"
    
    def generate_3d_preview_image(self, scene: trimesh.Scene, output_path: str):
        """Generate a preview image of the 3D model"""
        try:
            # Create a preview image using trimesh
            scene.show()
            
            # Save screenshot (this would need proper setup)
            # For now, create a placeholder
            import matplotlib.pyplot as plt
            fig, ax = plt.subplots(figsize=(10, 8))
            ax.text(0.5, 0.5, f'3D {scene.metadata.get("room_type", "room")} Model', 
                   ha='center', va='center', fontsize=20)
            ax.set_xlim(0, 1)
            ax.set_ylim(0, 1)
            ax.axis('off')
            plt.savefig(output_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            return output_path
        except Exception as e:
            print(f"Error generating preview: {e}")
            return None

if __name__ == "__main__":
    # Test the 3D model generator
    generator = ML3DModelGenerator()
    
    # Sample ML result
    sample_ml_result = {
        'furniture': [
            {'type': 'sofa', 'position': {'x': 0.3, 'y': 0.5, 'z': 0.2}},
            {'type': 'coffee_table', 'position': {'x': 0.5, 'y': 0.5, 'z': 0.1}},
            {'type': 'tv_stand', 'position': {'x': 0.5, 'y': 0.1, 'z': 0.2}}
        ]
    }
    
    # Generate 3D model
    result = generator.generate_3d_model_from_ml(
        sample_ml_result,
        'living',
        'modern',
        {'length': 12, 'width': 10, 'height': 9}
    )
    
    print("3D Model Generation Test:")
    print(f"Success: {result['success']}")
    print(f"Furniture count: {result['model_metadata']['furniture_count']}")
    print(f"Model file: {result['model_metadata']['model_file']}")
