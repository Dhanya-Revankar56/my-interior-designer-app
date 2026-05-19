"""
Startup script to run both the ML API and the main Node.js application
"""
import subprocess
import sys
import os
import time
import signal
import threading

class MLAppManager:
    def __init__(self):
        self.ml_process = None
        self.node_process = None
        self.running = True
    
    def start_ml_api(self):
        """Start the ML API server"""
        print("Starting ML API server...")
        try:
            # Change to ml_models directory
            ml_dir = os.path.join(os.getcwd(), 'ml_models')
            self.ml_process = subprocess.Popen(
                [sys.executable, 'ml_api.py'],
                cwd=ml_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            print("ML API server started on http://localhost:5000")
            return True
        except Exception as e:
            print(f"Error starting ML API: {e}")
            return False
    
    def start_node_app(self):
        """Start the Node.js application"""
        print("Starting Node.js application...")
        try:
            # Wait a bit for ML API to start
            time.sleep(3)
            
            self.node_process = subprocess.Popen(
                ['npm', 'run', 'dev:full'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            print("Node.js application started")
            return True
        except Exception as e:
            print(f"Error starting Node.js app: {e}")
            return False
    
    def check_ml_api(self):
        """Check if ML API is responding"""
        import requests
        try:
            response = requests.get('http://localhost:5000/api/health', timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def wait_for_ml_api(self, timeout=30):
        """Wait for ML API to be ready"""
        print("Waiting for ML API to be ready...")
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if self.check_ml_api():
                print("ML API is ready!")
                return True
            time.sleep(1)
        
        print("ML API failed to start within timeout")
        return False
    
    def monitor_processes(self):
        """Monitor both processes"""
        while self.running:
            if self.ml_process and self.ml_process.poll() is not None:
                print("ML API process stopped unexpectedly")
                break
            
            if self.node_process and self.node_process.poll() is not None:
                print("Node.js process stopped unexpectedly")
                break
            
            time.sleep(1)
    
    def stop_all(self):
        """Stop all processes"""
        print("\nStopping all processes...")
        self.running = False
        
        if self.ml_process:
            self.ml_process.terminate()
            try:
                self.ml_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.ml_process.kill()
        
        if self.node_process:
            self.node_process.terminate()
            try:
                self.node_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.node_process.kill()
        
        print("All processes stopped")
    
    def run(self):
        """Run the complete application"""
        print("Starting Custom ML 3D Interior Design Application")
        print("=" * 60)
        
        # Start ML API
        if not self.start_ml_api():
            print("Failed to start ML API. Exiting.")
            return
        
        # Wait for ML API to be ready
        if not self.wait_for_ml_api():
            print("ML API not ready. Exiting.")
            return
        
        # Start Node.js app
        if not self.start_node_app():
            print("Failed to start Node.js app. Exiting.")
            return
        
        print("\n" + "=" * 60)
        print("Application is running!")
        print("ML API: http://localhost:5000")
        print("Main App: http://localhost:5175")
        print("Press Ctrl+C to stop")
        print("=" * 60)
        
        # Set up signal handler for graceful shutdown
        def signal_handler(sig, frame):
            print("\nReceived interrupt signal. Shutting down...")
            self.stop_all()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        # Monitor processes
        try:
            self.monitor_processes()
        except KeyboardInterrupt:
            pass
        finally:
            self.stop_all()

def main():
    """Main function"""
    # Check if we're in the right directory
    if not os.path.exists('package.json'):
        print("Error: Please run this script from the project root directory")
        sys.exit(1)
    
    # Check if ml_models directory exists
    if not os.path.exists('ml_models'):
        print("Error: ml_models directory not found. Please run setup first.")
        sys.exit(1)
    
    # Check if Python dependencies are installed
    try:
        import tensorflow
        import flask
        import numpy
    except ImportError:
        print("Error: Python dependencies not installed. Please run:")
        print("cd ml_models && python setup_ml.py")
        sys.exit(1)
    
    # Start the application manager
    manager = MLAppManager()
    manager.run()

if __name__ == "__main__":
    main()



