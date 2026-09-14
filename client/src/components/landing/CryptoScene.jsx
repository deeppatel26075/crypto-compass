import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function CryptoScene({ className = '' }) {
  const containerRef = useRef(null);
  const [webGLError, setWebGLError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // On mobile, we use the optimized static visual fallback to preserve mobile performance
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    let scene, camera, renderer, animationFrameId;
    let btcMesh, ethMesh, solMesh;
    const orbitalRings = [];
    let particlesMesh;
    const texturesToDispose = [];

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX = (clientX / innerWidth - 0.5) * 2;
      mouseY = (clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    try {
      // 1. Initialize Three.js Scene & Camera
      scene = new THREE.Scene();

      const width = container.clientWidth || 600;
      const height = container.clientHeight || 550;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 14);

      // 2. Renderer with transparent background and antialiasing
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);

      // 3. Cinematic Lights
      const ambientLight = new THREE.AmbientLight(0x0f2035, 1.8);
      scene.add(ambientLight);

      // Key light (warm golden rim)
      const dirLight = new THREE.DirectionalLight(0xfff5dd, 2.5);
      dirLight.position.set(-6, 8, 8);
      scene.add(dirLight);

      // Cyan specular point light
      const cyanPoint = new THREE.PointLight(0x00d4ff, 3.5, 25);
      cyanPoint.position.set(6, -3, 5);
      scene.add(cyanPoint);

      // Neon green rim light
      const greenPoint = new THREE.PointLight(0x00f59b, 3.0, 20);
      greenPoint.position.set(-4, -5, 4);
      scene.add(greenPoint);

      // Purple bottom ambiance
      const purplePoint = new THREE.PointLight(0x8a2be2, 2.8, 22);
      purplePoint.position.set(2, 6, 3);
      scene.add(purplePoint);

      // 4. Texture Loader
      const textureLoader = new THREE.TextureLoader();

      const createCoinMesh = (texturePath, radius, thickness, rimColor, x, y, z) => {
        const coinGroup = new THREE.Group();
        coinGroup.position.set(x, y, z);

        const geom = new THREE.CylinderGeometry(radius, radius, thickness, 48);

        // Cylinder materials: [side, top, bottom]
        const sideMat = new THREE.MeshStandardMaterial({
          color: rimColor,
          metalness: 0.92,
          roughness: 0.22,
        });

        // Face decal texture
        const texture = textureLoader.load(texturePath);
        texturesToDispose.push(texture);

        const faceMat = new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 0.85,
          roughness: 0.25,
        });

        const materials = [sideMat, faceMat, faceMat];
        const mesh = new THREE.Mesh(geom, materials);
        // Rotate so flat faces point forward
        mesh.rotation.x = Math.PI / 2;
        coinGroup.add(mesh);

        // Outer bevel glowing halo
        const haloGeom = new THREE.TorusGeometry(radius * 1.03, 0.04, 16, 64);
        const haloMat = new THREE.MeshBasicMaterial({
          color: rimColor,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        });
        const haloMesh = new THREE.Mesh(haloGeom, haloMat);
        coinGroup.add(haloMesh);

        scene.add(coinGroup);
        return coinGroup;
      };

      // Create BTC (Center, Large)
      btcMesh = createCoinMesh('/assets/btc-texture.png', 2.2, 0.35, 0xf7931a, 0, 0, 0);

      // Create ETH (Upper Right, Medium)
      ethMesh = createCoinMesh('/assets/eth-texture.png', 1.35, 0.25, 0x627eea, 3.2, 2.2, -1.2);

      // Create SOL (Lower Right, Medium)
      solMesh = createCoinMesh('/assets/sol-texture.png', 1.25, 0.22, 0x14f195, 3.0, -2.4, -0.8);

      // 5. Glowing Orbital Rings
      const createOrbitalRing = (radius, tube, color, rotX, rotY, rotZ) => {
        const ringGeom = new THREE.TorusGeometry(radius, tube, 16, 120);
        const ringMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.set(rotX, rotY, rotZ);
        scene.add(ring);
        orbitalRings.push({ mesh: ring, speedX: 0.0012, speedY: 0.002, speedZ: -0.0015 });
      };

      createOrbitalRing(3.6, 0.025, 0x00d4ff, Math.PI / 3, Math.PI / 6, 0);
      createOrbitalRing(4.3, 0.02, 0x00f59b, -Math.PI / 4, Math.PI / 5, Math.PI / 8);
      createOrbitalRing(5.1, 0.028, 0x8a2be2, Math.PI / 5, -Math.PI / 4, Math.PI / 3);

      // 6. Cosmic Starfield Particles
      const particleCount = window.innerWidth > 1200 ? 250 : 120;
      const particleGeom = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 25;
        posArray[i + 1] = (Math.random() - 0.5) * 20;
        posArray[i + 2] = (Math.random() - 0.5) * 15;
      }

      particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0x9be8ff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });

      particlesMesh = new THREE.Points(particleGeom, particleMat);
      scene.add(particlesMesh);

      // 7. Responsive Resize Observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: newWidth, height: newHeight } = entry.contentRect;
          if (newWidth > 0 && newHeight > 0 && renderer && camera) {
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
          }
        }
      });
      resizeObserver.observe(container);

      // 8. Animation & Render Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        if (!prefersReducedMotion) {
          // Subtle floating & rotation of coins
          if (btcMesh) {
            btcMesh.rotation.y = elapsedTime * 0.35;
            btcMesh.position.y = Math.sin(elapsedTime * 0.9) * 0.18;
          }
          if (ethMesh) {
            ethMesh.rotation.y = -elapsedTime * 0.45;
            ethMesh.position.y = 2.2 + Math.cos(elapsedTime * 1.1) * 0.15;
          }
          if (solMesh) {
            solMesh.rotation.y = elapsedTime * 0.4;
            solMesh.position.y = -2.4 + Math.sin(elapsedTime * 1.2) * 0.14;
          }

          // Orbital rings rotation
          orbitalRings.forEach((r) => {
            r.mesh.rotation.x += r.speedX;
            r.mesh.rotation.y += r.speedY;
            r.mesh.rotation.z += r.speedZ;
          });

          // Particles slow drift
          if (particlesMesh) {
            particlesMesh.rotation.y = elapsedTime * 0.02;
          }

          // Parallax camera lerp
          targetCameraX = mouseX * 0.8;
          targetCameraY = -mouseY * 0.6;
          camera.position.x += (targetCameraX - camera.position.x) * 0.05;
          camera.position.y += (targetCameraY - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrameId);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }

        // Dispose textures
        texturesToDispose.forEach((t) => t.dispose());

        // Dispose geometries & materials
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      };
    } catch (err) {
      console.warn('WebGL Initialization failed, falling back to static composition:', err);
      setWebGLError(true);
    }
  }, [isMobile]);

  // Fallback view for mobile or WebGL disabled devices
  if (isMobile || webGLError) {
    return (
      <div className={`relative w-full h-[400px] sm:h-[480px] flex items-center justify-center overflow-hidden ${className}`}>
        {/* Crisp static composite fallback with subtle CSS float */}
        <div className="relative w-full max-w-[520px] aspect-[4/3] flex items-center justify-center">
          <img
            src="/assets/hero-artwork-perfect.png"
            alt="3D Bitcoin, Ethereum, and Solana visual"
            className="w-full h-auto object-contain animate-float drop-shadow-[0_15px_35px_rgba(0,245,155,0.25)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[450px] sm:h-[520px] lg:h-[620px] flex items-center justify-center overflow-hidden select-none pointer-events-auto ${className}`}
      aria-label="Interactive 3D Crypto Scene featuring Bitcoin, Ethereum, and Solana"
    />
  );
}
