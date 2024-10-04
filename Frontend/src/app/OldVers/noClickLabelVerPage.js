"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { gsap } from "gsap";
import celestialBodies from "../celestialBodies.js";
import PlanetDescription from '../LeftPanel.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const SCALE_FACTORS = {
  SUN: 1,      
  PLANET: 1,    
  MOON: 1,       
  DISTANCE: 1
};

const useTexturePath = () => {
  const [texturePath, setTexturePath] = useState(() => {
    return window.location.hostname === "thegrandmasons.github.io" ? "/orbit" : "";
  });

  useEffect(() => {
    setTexturePath(window.location.hostname === "thegrandmasons.github.io" ? "/orbit" : "");
  }, []);

  return texturePath;
};

export default function SolarSystemScene() {
  const texturePath = useTexturePath();
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const controlsRef = useRef(null);
  const bodiesRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());
  const mainObjRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    currentMount.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 21;
    controls.maxDistance = 50000;

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 2;
    bloomPass.radius = 1;

    const pointLight = new THREE.PointLight(0x222222, 1000000, 999);
    scene.add(pointLight);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    labelRendererRef.current = labelRenderer;
    controlsRef.current = controls;
    composerRef.current = composer;

    addSkybox();
    createCelestialBodies();

    camera.position.set(0, 200, 200);
    controls.update();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime() * speedRef.current * orbitalSpeedMultiplierRef.current;
      updateBodiesPositions(elapsedTime);
      
      if (mainObjRef.current) {
        controlsRef.current.target.copy(mainObjRef.current.body.position);
      }

      controlsRef.current.update();
      composerRef.current.render();
      labelRenderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("click", onMouseClick);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onMouseClick);
      window.removeEventListener("mousemove", onMouseMove);
      currentMount.removeChild(renderer.domElement);
      currentMount.removeChild(labelRenderer.domElement);
    };
  }, []);

  function getScaledRadius(data) {
    let scaleFactor = SCALE_FACTORS.PLANET;
    if (data.name === "Sun") {
      scaleFactor = SCALE_FACTORS.SUN;
    } else if (data.parent) {
      scaleFactor = SCALE_FACTORS.MOON;
    }
    return Math.max(data.radius * scaleFactor, 0.1);
  }

  function addSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      `${texturePath}/imgs/stars.jpg`,
      `${texturePath}/imgs/stars.jpg`,
      `${texturePath}/imgs/stars.jpg`,
      `${texturePath}/imgs/stars.jpg`,
      `${texturePath}/imgs/stars.jpg`,
      `${texturePath}/imgs/stars.jpg`,
    ]);
    sceneRef.current.background = texture;
  }

  function createCelestialBodies() {
    const bodyMap = new Map();
    celestialBodies.forEach((data) => {
      if (data.name === "Sun") {
        const geometry = new THREE.SphereGeometry(getScaledRadius(data), 64, 64);
        const material = new THREE.MeshBasicMaterial({
          color: 0xfff5e1,
          emissive: 0xffd700,
          emissiveIntensity: 1,
        });
        const sun = new THREE.Mesh(geometry, material);
        sun.userData.type = 'selectable';
        sun.userData.name = data.name;
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'celestial-label';
        labelDiv.textContent = data.name;
        labelDiv.style.cssText = `
          color: ${data.color};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 12px;
          pointer-events: auto;
          white-space: nowrap;
          user-select: none;
          transition: color 0.3s ease;
          cursor: pointer;
          opacity: 1.0;
        `;
        labelDiv.addEventListener('click', () => handleBodySelect(data));
        
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, getScaledRadius(data) * 1.2, 0);
        sun.add(label);
        
        sceneRef.current.add(sun);
        bodiesRef.current.push({ body: sun, ...data });
        bodyMap.set(data.name, { body: sun, ...data });
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
    const scaledRadius = getScaledRadius(data);

    if (data.name === "Earth") {
        const geometry = new THREE.SphereGeometry(scaledRadius, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load(`${texturePath}${data.mat}`),
        });
        const earthMesh = new THREE.Mesh(geometry, earthMaterial);
        planet.add(earthMesh);

        const earthLightMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load(`${texturePath}${data.night}`),
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.SrcAlphaFactor,
        });
        const earthLightMesh = new THREE.Mesh(geometry, earthLightMaterial);
        planet.add(earthLightMesh);

        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load(`${texturePath}${data.clouds}`),
            transparent: true,
            opacity: 0.8,
        });
        const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
        cloudMesh.scale.setScalar(1.0075);
        planet.add(cloudMesh);

        const atmosMaterial = new THREE.MeshLambertMaterial({
            color: 0x1f9fff,
            transparent: true,
            opacity: 0.3,
        });
        const atmosMesh = new THREE.Mesh(geometry, atmosMaterial);
        atmosMesh.scale.setScalar(1.02);
        planet.add(atmosMesh);
    } else {
        const geometry = new THREE.SphereGeometry(scaledRadius, 50, 50);
        const material = data.mat
            ? new THREE.MeshPhongMaterial({
                map: textureLoader.load(`${texturePath}${data.mat}`),
                emissive: new THREE.Color(0x111111),
            })
            : new THREE.MeshStandardMaterial({
                color: data.color,
                emissive: new THREE.Color(0x111111),
            });
        const body = new THREE.Mesh(geometry, material);
        body.userData.type = 'selectable';
        body.userData.name = data.name;
        planet.add(body);
    }

    const orbitPoints = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
        const t = data.epoch + (i / segments) * data.period * 365.25;
        const position = calculateOrbitPosition(data, t);
        if (position) orbitPoints.push(position);
    }

    if (orbitPoints.length > 0) {
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.369,
        });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

        if (parentBody) {
            parentBody.add(orbit);
        } else {
            sceneRef.current.add(orbit);
        }
        data.orbit = orbit;
    }

    const labelDiv = document.createElement('div');
    labelDiv.className = 'celestial-label';
    labelDiv.style.cssText = `
        color: ${data.color};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        font-size: ${data.parent ? '9px' : '12px'};
        pointer-events: ${data.parent ? 'none' : 'auto'};
        white-space: nowrap;
        user-select: none;
        transition: color 0.3s ease;
        cursor: ${data.parent ? 'default' : 'pointer'};
        opacity: ${data.parent ? '0.35' : '1.0'};
    `;
    labelDiv.textContent = data.name;

    if (!data.parent) {
        labelDiv.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleBodySelect(data);
        });
    }

    const label = new CSS2DObject(labelDiv);
    label.position.set(0, scaledRadius * 1.69, 0);
    planet.add(label);

    if (parentBody) {
        parentBody.add(planet);
    } else {
        sceneRef.current.add(planet);
    }

    return { body: planet, orbit: data.orbit, label: labelDiv, ...data };
  }

  function handleBodySelect(bodyData) {
    selectedBodyRef.current = bodyData.name;
    mainObjRef.current = bodyData;
    setUiSelectedBody(bodyData.name);
    updateOrbitVisibility(bodyData);
    centerCameraOnBody(bodyData);
  }

  function onMouseMove(event) {
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    let hoveredBody = null;
    if (intersects.length > 0) {
      hoveredBody = findBodyByObject(intersects[0].object);
    }

    bodiesRef.current.forEach((bodyData) => {
      if (bodyData.label) {
        if (hoveredBody && hoveredBody.name === bodyData.name) {
          bodyData.label.style.color = 'rgba(255, 255, 255, 1)';
          if (bodyData.orbit) bodyData.orbit.material.opacity = 0.6;
          document.body.style.cursor = 'pointer';
        } else {
          bodyData.label.style.color = 'rgba(255, 255, 255, 0.7)';
          if (bodyData.orbit && bodyData.name !== selectedBodyRef.current?.name) {
            bodyData.orbit.material.opacity = 0.3;
        }
        document.body.style.cursor = 'auto';
      }
    }
  });
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
  const n = (2 * Math.PI) / (body.period * 365.25);
  const M = degToRad(body.M0) + n * (t - body.epoch);
  const E = solveKeplerEquation(M, body.e);
  const x = body.a * (Math.cos(E) - body.e);
  const y = body.a * Math.sqrt(1 - body.e * body.e) * Math.sin(E);

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

  return new THREE.Vector3(xEcl * distanceScaleRef.current, zEcl * distanceScaleRef.current, yEcl * distanceScaleRef.current);
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
  const labelRenderer = labelRendererRef.current;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
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
    if (clickedBody && !clickedBody.parent && intersects[0].object.type === "Mesh") {
      handleBodySelect(clickedBody);
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

  const distance = getScaledRadius(body) * 4;
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
};

const handleCloseDescription = () => {
  setUiSelectedBody(null);
  mainObjRef.current = null;
  resetOrbitVisibility();
};

useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setUiSelectedBody(null);
      mainObjRef.current = null;
      resetOrbitVisibility();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []);

return (
  <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
    <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
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
      <PlanetDescription 
        selectedBody={uiSelectedBody} 
        onClose={handleCloseDescription} 
        path={texturePath}
      />
    )}
  </div>
);
}