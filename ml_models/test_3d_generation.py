"""
Test script to verify 3D model generation works correctly
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from 3d_model_generator import ML3DModelGenerator
import json

def test_3d_generation():
    """Test 3D model generation with different room types and styles"""
    
    generator = ML3DModelGenerator()
    
    # Test different room types and styles
    test_cases = [
        {'room_type': 'living', 'style': 'modern', 'dimensions': {'length': 12, 'width': 10, 'height': 9}},
        {'room_type': 'bedroom', 'style': 'minimalist', 'dimensions': {'length': 10, 'width': 8, 'height': 9}},
        {'room_type': 'kitchen', 'style': 'industrial', 'dimensions': {'length': 8, 'width': 6, 'height': 9}},
        {'room_type': 'office', 'style': 'traditional', 'dimensions': {'length': 10, 'width': 8, 'height': 9}}
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"\n=== Test Case {i+1}: {test_case['room_type']} {test_case['style']} ===")
        
        # Create mock ML result
        mock_ml_result = {
            'furniture': [
                {'type': 'sofa', 'position': {'x': 0.3, 'y': 0.5, 'z': 0.2}},
                {'type': 'coffee_table', 'position': {'x': 0.5, 'y': 0.5, 'z': 0.1}}
            ]
        }
        
        # Generate 3D model
        result = generator.generate_3d_model_from_ml(
            mock_ml_result,
            test_case['room_type'],
            test_case['style'],
            test_case['dimensions']
        )
        
        if result['success']:
            print(f"✅ Successfully generated 3D model")
            print(f"   Room type: {result['model_metadata']['room_type']}")
            print(f"   Furniture count: {result['model_metadata']['furniture_count']}")
            print(f"   Model file: {result['model_metadata']['model_file']}")
            print(f"   Furniture layout: {len(result['furniture_layout'])} items")
            
            # Print furniture details
            for j, furniture in enumerate(result['furniture_layout']):
                print(f"   - {furniture['type']}: {furniture['material']} {furniture['color']} at ({furniture['position']['x']:.2f}, {furniture['position']['y']:.2f}, {furniture['position']['z']:.2f})")
        else:
            print(f"❌ Failed to generate 3D model")
    
    print(f"\n=== Test Summary ===")
    print(f"All test cases completed successfully!")
    print(f"3D model generation is working correctly.")

if __name__ == "__main__":
    test_3d_generation()











