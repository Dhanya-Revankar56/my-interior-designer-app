"""
Quick start script to test and run the 3D ML system
"""
import os
import sys
import subprocess
import time

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import tensorflow
        import numpy
        import flask
        import trimesh
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def test_3d_generation():
    """Test 3D model generation"""
    try:
        from test_3d_generation import test_3d_generation
        print("\n🧪 Testing 3D model generation...")
        test_3d_generation()
        print("✅ 3D model generation test passed")
        return True
    except Exception as e:
        print(f"❌ 3D model generation test failed: {e}")
        return False

def start_ml_api():
    """Start the ML API server"""
    try:
        print("\n🚀 Starting ML API server...")
        # Start the ML API in a subprocess
        process = subprocess.Popen([
            sys.executable, "ml_api.py"
        ], cwd=os.path.dirname(os.path.abspath(__file__)))
        
        # Wait a bit for the server to start
        time.sleep(3)
        
        # Check if server is running
        import requests
        try:
            response = requests.get('http://localhost:5000/api/health', timeout=5)
            if response.status_code == 200:
                print("✅ ML API server is running on http://localhost:5000")
                return process
            else:
                print("❌ ML API server not responding")
                return None
        except:
            print("❌ ML API server not accessible")
            return None
            
    except Exception as e:
        print(f"❌ Failed to start ML API: {e}")
        return None

def main():
    """Main function"""
    print("🎯 3D Interior Design ML System - Quick Start")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Test 3D generation
    if not test_3d_generation():
        return
    
    # Start ML API
    api_process = start_ml_api()
    if not api_process:
        return
    
    print("\n🎉 System is ready!")
    print("📋 Next steps:")
    print("1. Run the main Node.js app: npm run dev")
    print("2. Open http://localhost:5175 in your browser")
    print("3. Select '3D Model' generation type")
    print("4. Generate your first 3D interior design!")
    
    print(f"\n🔧 ML API is running on http://localhost:5000")
    print("Press Ctrl+C to stop the ML API server")
    
    try:
        # Keep the script running
        api_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping ML API server...")
        api_process.terminate()
        print("✅ ML API server stopped")

if __name__ == "__main__":
    main()











