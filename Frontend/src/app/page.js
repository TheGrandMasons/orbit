"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { gsap } from "gsap";
import celestialBodies from "./celestialBodies.js";

export default function SolarSystemScene() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const bodiesRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());
  const mainObjRef = useRef(null);

  const speedRef = useRef(1);
  const orbitalSpeedMultiplierRef = useRef(16);
  const distanceScaleRef = useRef(0.01);
  const selectedBodyRef = useRef(null);
  const selectedBodySpeedRef = useRef(1);

  const [uiSpeed, setUiSpeed] = useState(1);
  const [uiOrbitalSpeedMultiplier, setUiOrbitalSpeedMultiplier] = useState(16);
  const [uiDistanceScale, setUiDistanceScale] = useState(0.01);
  const [uiSelectedBody, setUiSelectedBody] = useState(null);

  const composerRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Enable damping for smoothness
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Optional: Set the zoom restrictions
    controls.minDistance = 21; // Minimum zoom distance
    controls.maxDistance = 50000; // Maximum zoom distance

    // Set up bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 2; // Increased for stronger bloom
    bloomPass.radius = 1;

    const pointLight = new THREE.PointLight(0xfff5e1, 10000, 999999999999999);
    scene.add(pointLight);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;
    composerRef.current = composer;

    // Add skybox
    addSkybox();

    // Create celestial bodies
    createCelestialBodies();

    // Set initial camera position
    camera.position.set(0, 200, 200);
    controls.update();

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime =
        clockRef.current.getElapsedTime() *
        speedRef.current *
        orbitalSpeedMultiplierRef.current;
      updateBodiesPositions(elapsedTime);
      controls.update();
      composer.render(); // Use composer instead of renderer
      if (mainObjRef.current) {
        // controls.autoRotate = true;
        controls.enableRotate = true;
        controls.target.copy(mainObjRef.current.position);
      }
    }

    animate();

    // Event listeners
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("click", onMouseClick);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onMouseClick);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  function addSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "/orbit/imgs/stars.jpg",
      "/orbit/imgs/stars.jpg",
      "/orbit/imgs/stars.jpg",
      "/orbit/imgs/stars.jpg",
      "/orbit/imgs/stars.jpg",
      "/orbit/imgs/stars.jpg",
    ]);
    sceneRef.current.background = texture;
  }

  function createCelestialBodies() {
    const bodyMap = new Map();

    celestialBodies.forEach((data) => {
      if (data.name === "Sun") {
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const material = new THREE.MeshBasicMaterial({
          color: 0xfff5e1,
          // color: 0xFFD700,
          emissive: 0xffd700,
          emissiveIntensity: 1,
        });
        const sun = new THREE.Mesh(geometry, material);
        sceneRef.current.add(sun);

        bodiesRef.current.push({ body: sun, ...data });
        bodyMap.set(data.name, { body: sun, ...data });
      } else if (data.name === "Earth") {
        const parentBody = data.parent ? bodyMap.get(data.parent).body : null;
        const body = createCelestialBody(data, parentBody, true);
        bodiesRef.current.push(body);
        bodyMap.set(data.name, body);
      } else {
        const parentBody = data.parent ? bodyMap.get(data.parent).body : null;
        const body = createCelestialBody(data, parentBody);
        bodiesRef.current.push(body);
        bodyMap.set(data.name, body);
      }
    });
  }

  function createCelestialBody(data, parentBody = null) {
    const planet = new THREE.Group();
    
    if (data.name === "Earth") {
      // Create main Earth sphere
      const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
      const textureLoader = new THREE.TextureLoader();

      const material = data.mat
        ? new THREE.MeshPhongMaterial({ map: textureLoader.load(data.mat) })
        : new THREE.MeshStandardMaterial({ color: data.color });
        const body = new THREE.Mesh(geometry, material);
      
      // Base Earth material
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(data.mat),
      });
      const earthMesh = new THREE.Mesh(geometry, earthMaterial);
      planet.add(earthMesh);
  
      // Night lights layer
      const earthLightMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(data.night),
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.SrcAlphaFactor,
      });
      const earthLightMesh = new THREE.Mesh(geometry, earthLightMaterial);
      planet.add(earthLightMesh);
  
      // Cloud layer
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(data.clouds),
        transparent: true,
        opacity: 0.8,
      });
      const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
      cloudMesh.scale.setScalar(1.0075); // Slightly larger than Earth
      planet.add(cloudMesh);
  
      // Atmosphere layer
      const atmosMaterial = new THREE.MeshLambertMaterial({
        color: 0x1F9FFF,
        transparent: true,
        opacity: 0.3,
      });
      const atmosMesh = new THREE.Mesh(geometry, atmosMaterial);
      atmosMesh.scale.setScalar(1.02); // Larger than clouds
      planet.add(atmosMesh);
  
    } else {
      // Create other celestial bodies as before
      const geometry = new THREE.SphereGeometry(data.radius, 50, 50);
      const material = new THREE.MeshStandardMaterial({ color: data.color });
      const body = new THREE.Mesh(geometry, material);
      planet.add(body);
    }
  
    // Create orbit
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x606060,
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
        parentBody.add(planet);
        parentBody.add(orbit);
      } else {
        sceneRef.current.add(planet);
        sceneRef.current.add(orbit);
      }
  
      return { body: planet, orbit, ...data };
    } else {
      console.warn(`Failed to create orbit for ${data.name}`);
      if (parentBody) {
        parentBody.add(planet);
      } else {
        sceneRef.current.add(planet);
      }
      return { body: planet, ...data };
    }
  }
  function updateBodiesPositions(elapsedTime) {
    bodiesRef.current.forEach((bodyData) => {
      if (bodyData.name === "Sun") return;

      const bodySpeed =
        bodyData.name === selectedBodyRef.current
          ? selectedBodySpeedRef.current
          : 1;
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

    return new THREE.Vector3(xEcl, zEcl, yEcl);
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
    composerRef.current.setSize(window.innerWidth, window.innerHeight);
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
      if (clickedBody && intersects[0].object.type == "Mesh") {
        selectedBodyRef.current = clickedBody.name;
        mainObjRef.current = intersects[0].object;
        setUiSelectedBody(clickedBody.name);
        centerCameraOnBody(clickedBody);
        updateOrbitVisibility(clickedBody);
      }
    } else {
      selectedBodyRef.current = null;
      setUiSelectedBody(null);
      resetOrbitVisibility();
    }
  }

  function findBodyByObject(object) {
    for (const body of bodiesRef.current) {
      if (body.body === object || (body.orbit && body.orbit === object)) {
        return body;
      }
      if (
        body.body.children.find(
          (child) => child === object || child.children.includes(object)
        )
      ) {
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
    const endPosition = target
      .clone()
      .add(new THREE.Vector3(distance, distance / 2, distance));

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
      <div
        style={{
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
        }}
      >
        <label htmlFor="speed-slider">
          Animation Speed: {uiSpeed.toFixed(1)}x
        </label>
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
        <label htmlFor="orbital-speed-slider">
          Orbital Speed: {uiOrbitalSpeedMultiplier.toFixed(1)}x
        </label>
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
        <label htmlFor="distance-scale-slider">
          Distance Scale: {(uiDistanceScale * 100).toFixed(2)}%
        </label>
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
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "rgba(0,0,0,0.5)",
            padding: "10px",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Selected: {uiSelectedBody}
        </div>
      )}
    </div>
  );
}
