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

    const pointLight = new THREE.PointLight(0xFFF5E1, 10, 0, 0.5);
    scene.add(pointLight);

    const Ambient = new THREE.AmbientLight(0xFFF5E1, 0.01);
    scene.add(Ambient);

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
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
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
          color: ${data.color || '#ffffff'};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 12px;
          pointer-events: auto;
          white-space: nowrap;
          user-select: none;
          transition: color 0.3s ease;
          cursor: pointer;
          opacity: 1.0;
        `;
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, data.radius * 1.69, 0);
        sun.add(label);
        
        sceneRef.current.add(sun);
        bodiesRef.current.push({ body: sun, label: labelDiv, ...data });
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

    if (data.name === "Earth") {
      const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(`${texturePath}${data.mat}`),
      });
      const earthMesh = new THREE.Mesh(geometry, earthMaterial);
      planet.add(earthMesh);

      const nightMaterial = new THREE.ShaderMaterial({
        uniforms: {
          nightTexture: { type: 't', value: textureLoader.load(data.night) },
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
      const earthLightMesh = new THREE.Mesh(geometry, nightMaterial);
      earthLightMesh.scale.setScalar(1.001);
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
        opacity: 0.1,
      });
      const atmosMesh = new THREE.Mesh(geometry, atmosMaterial);
      atmosMesh.scale.setScalar(1.02);
      planet.add(atmosMesh);

      planet.rotation.x = (1*data.rotation_axes) * Math.PI / 180;
      planet.rotation.y = (1*-data.rotation_axes) * Math.PI / 180;
    } else {
      const geometry = new THREE.SphereGeometry(data.radius, 50, 50);
      const material = data.mat
        ? new THREE.MeshPhongMaterial({
            map: textureLoader.load(`${texturePath}${data.mat}`),
          })
        : new THREE.MeshStandardMaterial({
            color: data.color,
          });
      const body = new THREE.Mesh(geometry, material);
      body.userData.type = 'selectable';
      body.userData.name = data.name;
      planet.add(body);
      planet.rotation.x = (1*data.rotation_axes) * Math.PI / 180;
      planet.rotation.y = (1*-data.rotation_axes) * Math.PI / 180;

      if (data.ring == true) {
        const innerRadius = data.radius * 1.4;
        const outerRadius = data.radius * 2.2;
        const segments = 64;

        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
        const ring_material = data.mat
        ? new THREE.MeshPhongMaterial({
            map: textureLoader.load(
              `${texturePath}${data.ringMat}`
            ),
            side:THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
          })
        : new THREE.MeshStandardMaterial({
            color: data.color,
          });
        ring_material.wrapS = THREE.RepeatWrapping;
        ring_material.wrapT = THREE.RepeatWrapping;
        const ring = new THREE.Mesh(geometry, ring_material);
        ring.rotation.x = (Math.PI / 2)-data.rotation_axes;
        planet.add(ring);
      
        console.log(data.name);
    }
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
      color: ${data.color || '#ffffff'};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: ${data.parent ? '9px' : '12px'};
      pointer-events: auto;
      white-space: nowrap;
      user-select: none;
      transition: color 0.3s ease;
      cursor: pointer;
      opacity: ${data.parent ? '0.35' : '1.0'};
    `;
    labelDiv.textContent = data.name;

    const label = new CSS2DObject(labelDiv);
    label.position.set(0, data.radius * 1.69, 0);
    planet.add(label);

    if (parentBody) {
      parentBody.add(planet);
    } else {
      sceneRef.current.add(planet);
    }

    return { body: planet, orbit: data.orbit, label: labelDiv, ...data };
  }

  function findBodyByObject(object) {
    for (const body of bodiesRef.current) {
      // Check if the clicked object is the body mesh
      if (body.body === object) {
        return body;
      }
      
      // Check if the clicked object is a child of the body (like labels)
      if (body.body && body.body.children) {
        for (const child of body.body.children) {
          if (child === object || (child.element && child.element === object)) {
            return body;
          }
        }
      }
      
      // Check if the clicked object is the orbit line
      if (body.orbit && body.orbit === object) {
        return body;
      }
      
      // Check nested children (for complex bodies like Earth with multiple meshes)
      if (body.body && body.body.children) {
        const foundInChildren = body.body.children.find(
          child => child === object || child.children?.includes(object)
        );
        if (foundInChildren) {
          return body;
        }
      }
    }
    return null;
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
          bodyData.label.style.color = bodyData.color || 'rgba(255, 255, 255, 0.7)';
          if (bodyData.orbit && bodyData.name !== selectedBodyRef.current?.name) {
            bodyData.orbit.material.opacity = 0.3;
          }
          document.body.style.cursor = 'auto';
        }
      }
    });
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
      if (clickedBody && !clickedBody.parent) {
        handleBodySelect(clickedBody);
      }
    } else {
      // Check if we clicked on a label
      const labelElements = document.getElementsByClassName('celestial-label');
      for (const labelElement of labelElements) {
        const rect = labelElement.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          const bodyName = labelElement.textContent;
          const clickedBody = bodiesRef.current.find(body => body.name === bodyName);
          if (clickedBody && !clickedBody.parent) {
            handleBodySelect(clickedBody);
            return;
          }
        }
      }
      
      // If we didn't click on a body or label, deselect
      selectedBodyRef.current = null;
      setUiSelectedBody(null);
      resetOrbitVisibility();
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

  function centerCameraOnBody(body) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const target = new THREE.Vector3();
    body.body.getWorldPosition(target);
  
    const distance = body.radius * 4;
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
        b.orbit.material.opacity = 0.3;
      }
    });
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
    selectedBodyRef.current = null;
    mainObjRef.current = null;
    setUiSelectedBody(null);
    resetOrbitVisibility();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseDescription();
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
