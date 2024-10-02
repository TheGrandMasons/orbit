"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
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

  const speedRef = useRef(1);
  const orbitalSpeedMultiplierRef = useRef(16);
  const distanceScaleRef = useRef(0.01);
  const selectedBodyRef = useRef(null);
  const selectedBodySpeedRef = useRef(1);

  const [uiSpeed, setUiSpeed] = useState(1);
  const [uiOrbitalSpeedMultiplier, setUiOrbitalSpeedMultiplier] = useState(16);
  const [uiDistanceScale, setUiDistanceScale] = useState(0.01);
  const [uiSelectedBody, setUiSelectedBody] = useState(null);
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 200, z: 200 });
  const [cameraOwner, setCameraOwner] = useState("sun");

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
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50000;
    controls.maxPolarAngle = Math.PI;

    // Set up bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 2;  // Increased for stronger bloom
    bloomPass.radius = 1;

    const pointLight = new THREE.PointLight(0xffffff, 10000, 100000000000000);
    scene.add(pointLight);

    const ambient = new THREE.AmbientLight(0xffffff,0.1);
    // scene.add(ambient);

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
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
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
      composer.render();  // Use composer instead of renderer
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
      "/assets/2k_stars.jpg",
      "/assets/2k_stars.jpg",
      "/assets/2k_stars.jpg",
      "/assets/2k_stars.jpg",
      "/assets/2k_stars.jpg",
      "/assets/2k_stars.jpg"
    ]);
    sceneRef.current.background = texture;
  }

  function createCelestialBodies() {
    const bodyMap = new Map();

    celestialBodies.forEach((data) => {
      if (data.name === "Sun") {
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const material = new THREE.MeshBasicMaterial({
          color: 0xFFF5E1,
          // color: 0xFFD700,
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
    const textureLoader = new THREE.TextureLoader();
    if (data.name === "Earth") {
      const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
      
      
      // Base Earth material
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(data.mat),
      });
      const earthMesh = new THREE.Mesh(geometry, earthMaterial);
      planet.add(earthMesh);
      
      // Create a custom shader material for night lights
      const nightMaterial = new THREE.ShaderMaterial({
        uniforms: {
          nightTexture: { type: 't', value: textureLoader.load('/assets/E2.jpg') },
          opacity: { type: 'f', value: 1.0 },
          emissiveStrength: { type: 'f', value: 5.0 }
      },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D nightTexture;
          uniform float opacity;
          uniform float emissiveStrength;  // New uniform to control emissive brightness
          varying vec2 vUv;

          void main() {
              // Sample the texture
              vec4 nightColor = texture2D(nightTexture, vUv);
              
              // Calculate brightness (luminance) of the texture color
              float brightness = dot(nightColor.rgb, vec3(0.299, 0.587, 0.114));
              
              // Adjust brightness with emissive strength to simulate emission (glow)
              vec3 emissiveColor = nightColor.rgb * emissiveStrength;
              
              // Final color with increased brightness and opacity control
              vec4 finalColor = vec4(emissiveColor, brightness * opacity);
              
              // Set the final fragment color
              gl_FragColor = finalColor;
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        
      });
      
      const nightMesh = new THREE.Mesh(geometry, nightMaterial);
      nightMesh.scale.setScalar(1.001);
      planet.add(nightMesh);
  
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(data.clouds),
        transparent: true,
        opacity: 0.7,
      });
      const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
      cloudMesh.scale.setScalar(1.01);
      planet.add(cloudMesh);

      const atmos_mat = new THREE.MeshLambertMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.1
      });
      const atmos = new THREE.Mesh(geometry, atmos_mat);
      atmos.scale.setScalar(1.02);
      planet.add(atmos);
    }else {
      // Create other celestial bodies as before
      const geometry = new THREE.SphereGeometry(data.radius, 50, 50);
      // const material = new THREE.MeshStandardMaterial({ color: data.color });
      const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load(data.mat),
      });
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

      if (bodyData.name === "Earth") {
        const earthGroup = bodyData.body;
        earthGroup.children.forEach((child, index) => {
          switch (index) {
            case 0:
              child.rotation.y += 0.001;
              break;
            case 1:
              child.rotation.y += 0.001;
              break;
            case 2:
              child.rotation.y += 0.0013;
              break;
          }
        });
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
      if (clickedBody) {
        setCameraOwner(clickedBody.name);
        selectedBodyRef.current = clickedBody.name;
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
