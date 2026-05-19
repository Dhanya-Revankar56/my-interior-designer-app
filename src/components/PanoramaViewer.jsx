import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PanoramaViewer = ({ imageUrl, onSnapshotReady }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl || !mountRef.current) {
      return;
    }

    let animationId;

    try {
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 400;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 0.1); // Slight offset from center
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.maxDistance = 5;
      controls.minDistance = 0.1;
      controlsRef.current = controls;

      // Geometry: inside of a sphere
      const geometry = new THREE.SphereGeometry(50, 64, 64);
      geometry.scale(-1, 1, 1); // Invert the sphere so we are inside it

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      const SAMPLE_URL = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@main/equirect.jpg';

      const onLoad = (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        setIsLoading(false);

        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };

        animate();

        if (typeof onSnapshotReady === 'function') {
          const captureSnapshot = () => {
            if (!renderer || !scene || !camera) {
              throw new Error('Viewer not ready for snapshot');
            }
            try {
              controls.update();
              renderer.render(scene, camera);
              const dataUrl = renderer.domElement.toDataURL('image/png');
              return dataUrl;
            } catch (e) {
              throw new Error('Snapshot failed. Use a CORS-enabled image URL.');
            }
          };
          onSnapshotReady(captureSnapshot);
        }
      };

      loader.load(
        imageUrl,
        onLoad,
        undefined,
        (err) => {
          console.error('Error loading panorama texture:', err);
          // Fallback to a known-good sample URL
          if (imageUrl !== SAMPLE_URL) {
            loader.load(
              SAMPLE_URL,
              onLoad,
              undefined,
              (fallbackErr) => {
                console.error('Fallback panorama load failed:', fallbackErr);
                setError('Unable to load panorama image for 360° view. Try the sample or upload locally.');
                setIsLoading(false);
              }
            );
          } else {
            setError('Unable to load panorama image for 360° view.');
            setIsLoading(false);
          }
        }
      );

      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.error('Error initializing panorama viewer:', e);
      setError(e.message || 'Failed to initialize panorama view.');
      setIsLoading(false);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      try {
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        if (mountRef.current && rendererRef.current?.domElement) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up panorama viewer:', cleanupError);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 400;

      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(window.devicePixelRatio || 1);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!imageUrl) {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-100 rounded-xl">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading 360° panoramic view...</p>
          </div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default PanoramaViewer;
