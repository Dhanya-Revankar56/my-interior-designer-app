import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDViewer = ({ modelData, furnitureLayout, roomDimensions, enable360View = false }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Initialize Three.js scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 400;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      camera.position.set(10, 10, 10);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = enable360View;
      controls.autoRotateSpeed = 1.0;
      controls.minDistance = 5;
      controls.maxDistance = 40;
      controls.maxPolarAngle = Math.PI / 2; // Prevent going below the floor
      controlsRef.current = controls;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Create room
      createRoom(scene, roomDimensions);

      // Add furniture
      if (furnitureLayout && furnitureLayout.length > 0) {
        furnitureLayout.forEach((furniture, index) => {
          createFurniture(scene, furniture, index);
        });
      }

      // Mount renderer
      mountRef.current.appendChild(renderer.domElement);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (controlsRef.current) {
          controlsRef.current.autoRotate = enable360View;
          controlsRef.current.update();
        }
        renderer.render(scene, camera);
      };
      animate();

      setIsLoading(false);

      // Cleanup
      return () => {
        try {
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        } catch (cleanupError) {
          console.error('Error cleaning up 3D viewer:', cleanupError);
        }
      };
    } catch (e) {
      console.error('Error initializing 3D viewer:', e);
      setError(e.message || 'Failed to initialize 3D view');
      setIsLoading(false);
    }
  }, [furnitureLayout, roomDimensions, enable360View]);

  const createRoom = (scene, dimensions) => {
    const { length = 12, width = 10, height = 9 } = dimensions;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(length, width);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513, // Brown wood
      side: THREE.DoubleSide 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5F5 });

    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(length, height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, -width / 2, height / 2);
    scene.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(width, height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-length / 2, 0, height / 2);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(length / 2, 0, height / 2);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(length, width);
    const ceilingMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, 0, height);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);
  };

  const createFurniture = (scene, furniture, index) => {
    const { type, position, material = 'wood', color = 'brown' } = furniture;
    
    // Scale positions to room dimensions
    const scale = 2; // Adjust based on room size
    const x = (position.x - 0.5) * scale * 10;
    const y = (position.y - 0.5) * scale * 10;
    const z = position.z * scale * 5;

    let geometry, furnitureMesh;

    switch (type) {
      case 'sofa':
        geometry = new THREE.BoxGeometry(2, 0.8, 0.9);
        break;
      case 'bed':
        geometry = new THREE.BoxGeometry(2, 1.5, 0.6);
        break;
      case 'dining_table':
        geometry = new THREE.BoxGeometry(1.5, 0.8, 0.75);
        break;
      case 'desk':
        geometry = new THREE.BoxGeometry(1.2, 0.6, 0.75);
        break;
      case 'chair':
        geometry = new THREE.BoxGeometry(0.5, 0.5, 1.0);
        break;
      case 'bookshelf':
        geometry = new THREE.BoxGeometry(0.3, 0.6, 1.8);
        break;
      case 'tv_stand':
        geometry = new THREE.BoxGeometry(1.5, 0.4, 0.6);
        break;
      case 'coffee_table':
        geometry = new THREE.BoxGeometry(1.2, 0.6, 0.4);
        break;
      case 'nightstand':
        geometry = new THREE.BoxGeometry(0.5, 0.4, 0.6);
        break;
      case 'dresser':
        geometry = new THREE.BoxGeometry(1.2, 0.6, 0.8);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const materialColor = getColorHex(color);
    const furnitureMaterial = new THREE.MeshLambertMaterial({ color: materialColor });
    furnitureMesh = new THREE.Mesh(geometry, furnitureMaterial);
    
    furnitureMesh.position.set(x, y, z);
    furnitureMesh.castShadow = true;
    furnitureMesh.receiveShadow = true;
    
    // Add label
    const label = createFurnitureLabel(type, x, y, z + 1);
    scene.add(label);
    
    scene.add(furnitureMesh);
  };

  const createFurnitureLabel = (type, x, y, z) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, 256, 64);
    
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillText(type.replace('_', ' ').toUpperCase(), 128, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const label = new THREE.Sprite(labelMaterial);
    label.position.set(x, y, z);
    label.scale.set(2, 0.5, 1);
    
    return label;
  };

  const getColorHex = (colorName) => {
    const colors = {
      'white': 0xFFFFFF,
      'black': 0x000000,
      'brown': 0x8B4513,
      'gray': 0x808080,
      'blue': 0x0000FF,
      'green': 0x008000,
      'red': 0xFF0000,
      'yellow': 0xFFFF00
    };
    return colors[colorName] || 0x8B4513;
  };

  const handleResize = () => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
    
    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 400;
    
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(window.devicePixelRatio || 1);
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">Error loading 3D model: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 3D model...</p>
          </div>
        </div>
      )}
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default ThreeDViewer;
