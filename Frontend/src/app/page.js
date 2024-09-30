"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import celestialBodies from './celestialBodies.js'

export default function SolarSystemScene() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const bodiesRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());

  const speedRef = useRef(1);
  const orbitalSpeedMultiplierRef = useRef(16);
  const distanceScaleRef = useRef(0.01);
  const selectedBodyRef = useRef(null);
  const selectedBodySpeedRef = useRef(1);

  const [uiSpeed, setUiSpeed] = useState(1);
  const [uiOrbitalSpeedMultiplier, setUiOrbitalSpeedMultiplier] = useState(16);
  const [uiDistanceScale, setUiDistanceScale] = useState(0.01);
  const [uiSelectedBody, setUiSelectedBody] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50000;
    controls.maxPolarAngle = Math.PI;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    // Create celestial bodies
    createCelestialBodies();

    // Set initial camera position
    camera.position.set(0, 200, 200);
    controls.update();

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime() * speedRef.current * orbitalSpeedMultiplierRef.current;
      updateBodiesPositions(elapsedTime);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onMouseClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('click', onMouseClick);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  function createCelestialBodies() {
    const bodyMap = new Map();

    celestialBodies.forEach((data) => {
      if (data.name !== "Sun") {
        const parentBody = data.parent ? bodyMap.get(data.parent).body : null;
        const body = createCelestialBody(data, parentBody);
        bodiesRef.current.push(body);
        bodyMap.set(data.name, body);
      } else {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: data.color });
        const sun = new THREE.Mesh(geometry, material);
        sceneRef.current.add(sun);
        bodiesRef.current.push({ body: sun, ...data });
        bodyMap.set(data.name, { body: sun, ...data });
      }
    });
  }

  function createCelestialBody(data, parentBody = null) {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: data.color });
    const body = new THREE.Mesh(geometry, material);

    const orbitGeometry = new THREE.BufferGeometry();
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
    });
    const orbitPoints = [];
    for (let i = 0; i <= 360; i++) {
      const t = data.epoch + (i / 360) * data.period * 365.25;
      const position = calculateOrbitPosition(data, t);
      if (position && position instanceof THREE.Vector3) {
        orbitPoints.push(position);
      }
    }

    if (orbitPoints.length > 0) {
      orbitGeometry.setFromPoints(orbitPoints);
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

      if (parentBody) {
        parentBody.add(body);
        parentBody.add(orbit);
      } else {
        sceneRef.current.add(body);
        sceneRef.current.add(orbit);
      }

      return { body, orbit, ...data };
    } else {
      console.warn(`Failed to create orbit for ${data.name}`);
      if (parentBody) {
        parentBody.add(body);
      } else {
        sceneRef.current.add(body);
      }
      return { body, ...data };
    }
  }

  function updateBodiesPositions(elapsedTime) {
    bodiesRef.current.forEach((bodyData) => {
      if (bodyData.name === "Sun") return;

      const bodySpeed = bodyData.name === selectedBodyRef.current ? selectedBodySpeedRef.current : 1;
      const position = calculateOrbitPosition(
        bodyData,
        bodyData.epoch + elapsedTime * bodySpeed
      );

      if (position && position instanceof THREE.Vector3) {
        if (bodyData.parent) {
          bodyData.body.position.copy(position);
        } else {
          bodyData.body.position.copy(position);
        }
      }
    });
  }

  function calculateOrbitPosition(body, t) {
    const n = (2 * Math.PI) / (body.period * 365.25); // Mean motion
    const M = degToRad(body.M0) + n * (t - body.epoch);
    const E = solveKeplerEquation(M, body.e);
    const x = body.a * (Math.cos(E) - body.e);
    const y = body.a * Math.sqrt(1 - body.e * body.e) * Math.sin(E);

    // Convert to 3D coordinates
    const xEcl =
      x *
      (Math.cos(degToRad(body.omega)) * Math.cos(degToRad(body.w)) -
        Math.sin(degToRad(body.omega)) *
        Math.sin(degToRad(body.w)) *
        Math.cos(degToRad(body.i))) -
      y *
      (Math.cos(degToRad(body.omega)) * Math.sin(degToRad(body.w)) +
        Math.sin(degToRad(body.omega)) *
        Math.cos(degToRad(body.w)) *
        Math.cos(degToRad(body.i)));
    const yEcl =
      x *
      (Math.sin(degToRad(body.omega)) * Math.cos(degToRad(body.w)) +
        Math.cos(degToRad(body.omega)) *
        Math.sin(degToRad(body.w)) *
        Math.cos(degToRad(body.i))) +
      y *
      (Math.cos(degToRad(body.omega)) *
        Math.cos(degToRad(body.w)) *
        Math.cos(degToRad(body.i)) -
        Math.sin(degToRad(body.omega)) * Math.sin(degToRad(body.w)));
    const zEcl =
      x * Math.sin(degToRad(body.w)) * Math.sin(degToRad(body.i)) +
      y * Math.cos(degToRad(body.w)) * Math.sin(degToRad(body.i));

    return new THREE.Vector3(xEcl, yEcl, zEcl);
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function solveKeplerEquation(M, e, tolerance = 1e-8, maxIterations = 1000) {
    let E = M;
    for (let i = 0; i < maxIterations; i++) {
      const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < tolerance) {
        return E;
      }
    }
    console.warn("Kepler equation did not converge");
    return E;
  }

  function onWindowResize() {
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseClick(event) {
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clickedBody = findBodyByObject(intersects[0].object);
      if (clickedBody) {
        selectedBodyRef.current = clickedBody.name;
        setUiSelectedBody(clickedBody.name);
        centerCameraOnBody(clickedBody);
        // selectedBodySpeedRef.current = 1;
        updateOrbitVisibility(clickedBody);
      }
    } else {
      selectedBodyRef.current = null;
      setUiSelectedBody(null);
      // selectedBodySpeedRef.current = 1;
      resetOrbitVisibility();
    }
  }

  function findBodyByObject(object) {
    for (const body of bodiesRef.current) {
      if (body.body === object || (body.orbit && body.orbit === object)) {
        return body;
      }
      if (body.body.children.find((child) => child === object || child.children.includes(object))) {
        return body;
      }
    }
    return null;
  }

  function centerCameraOnBody(body) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const target = new THREE.Vector3();
    body.body.getWorldPosition(target);

    const distance = body.radius * 2;
    const endPosition = target.clone().add(new THREE.Vector3(distance, distance / 2, distance));

    gsap.to(camera.position, {
      duration: 1,
      x: endPosition.x,
      y: endPosition.y,
      z: endPosition.z,
      onUpdate: () => controls.update(),
    });

    gsap.to(controls.target, {
      duration: 1,
      x: target.x,
      y: target.y,
      z: target.z,
      onUpdate: () => controls.update(),
    });
  }

  function updateOrbitVisibility(selectedBody) {
    bodiesRef.current.forEach((b) => {
      if (b.orbit) {
        if (b.name === selectedBody.name) {
          b.orbit.material.opacity = 1;
        } else if (b.parent === selectedBody.name) {
          b.orbit.material.opacity = 0.5;
        } else {
          b.orbit.material.opacity = 0.1;
        }
      }
    });
  }

  function resetOrbitVisibility() {
    bodiesRef.current.forEach((b) => {
      if (b.orbit) {
        b.orbit.material.opacity = 0.1;
      }
    });
  }

  const handleSpeedChange = (e) => {
    const value = parseFloat(e.target.value);
    speedRef.current = value;
    setUiSpeed(value);
  };

  const handleOrbitalSpeedMultiplierChange = (e) => {
    const value = parseFloat(e.target.value);
    orbitalSpeedMultiplierRef.current = value;
    setUiOrbitalSpeedMultiplier(value);
  };

  const handleDistanceScaleChange = (e) => {
    const value = parseFloat(e.target.value);
    distanceScaleRef.current = value;
    setUiDistanceScale(value);
    // You may want to update the positions of the bodies here based on the new distance scale
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        background: "rgba(0,0,0,0.5)",
        padding: "10px",
        borderRadius: "5px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <label htmlFor="speed-slider">Animation Speed: {uiSpeed.toFixed(1)}x</label>
        <input
          id="speed-slider"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={uiSpeed}
          onChange={handleSpeedChange}
          style={{ width: "200px" }}
        />
        <label htmlFor="orbital-speed-slider">Orbital Speed: {uiOrbitalSpeedMultiplier.toFixed(1)}x</label>
        <input
          id="orbital-speed-slider"
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={uiOrbitalSpeedMultiplier}
          onChange={handleOrbitalSpeedMultiplierChange}
          style={{ width: "200px" }}
        />
        <label htmlFor="distance-scale-slider">Distance Scale: {(uiDistanceScale * 100).toFixed(2)}%</label>
        <input
          id="distance-scale-slider"
          type="range"
          min="0.0002"
          max="0.01"
          step="0.0002"
          value={uiDistanceScale}
          onChange={handleDistanceScaleChange}
          style={{ width: "200px" }}
        />
      </div>
      {uiSelectedBody && (
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(0,0,0,0.5)",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
        }}>
          Selected: {uiSelectedBody}
        </div>
      )}
    </div>
  );
} 