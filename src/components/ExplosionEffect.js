// src/components/ExplosionEffect.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ExplosionEffect = ({ position }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const particles = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particles; i++) {
      positions.push(Math.random() * 2 - 1);
      positions.push(Math.random() * 2 - 1);
      positions.push(Math.random() * 2 - 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.x += 0.01;
      points.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: position.top, left: position.left, width: '200px', height: '200px' }}></div>;
};

export default ExplosionEffect;
