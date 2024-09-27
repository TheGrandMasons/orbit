"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import celestialBodies from './celestialBodies.js'

export default function SolarSystemScene() {
  const [orbitalSpeedMultiplier, setOrbitalSpeedMultiplier] = useState(16);
  const mountRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [selectedBody, setSelectedBody] = useState(null);
  const [distanceScale, setDistanceScale] = useState(0.01);
  const [selectedBodySpeed, setSelectedBodySpeed] = useState(1);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const bodies = [];

    // Keplerian orbit calculation functions
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

    // Create celestial bodies and their orbits
    function createCelestialBody(data, parentBody = null) {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: data.color });
      const body = new THREE.Mesh(geometry, material);

      // Create orbit
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
        orbitPoints.push(position);
      }
      orbitGeometry.setFromPoints(orbitPoints);
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

      if (parentBody) {
        // For moons, add the body and orbit to the parent
        parentBody.add(body);
        parentBody.add(orbit);
      } else {
        // For planets, add directly to the scene
        scene.add(body);
        scene.add(orbit);
      }

      return { body, orbit, ...data };
    }

    // Body creation loop
    const bodyMap = new Map();

    celestialBodies.forEach((data) => {
      if (data.name !== "Sun") {
        const parentBody = data.parent ? bodyMap.get(data.parent).body : null;
        const body = createCelestialBody(data, parentBody);
        bodies.push(body);
        bodyMap.set(data.name, body);
      } else {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: data.color });
        const sun = new THREE.Mesh(geometry, material);
        scene.add(sun);
        bodies.push({ body: sun, ...data });
        bodyMap.set(data.name, { body: sun, ...data });
      }
    });

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime =
        clock.getElapsedTime() * speed * orbitalSpeedMultiplier;

      bodies.forEach((bodyData) => {
        if (bodyData.name === "Sun") return; // Skip the Sun

        const bodySpeed =
          bodyData.name === selectedBody ? selectedBodySpeed : 1;
        const position = calculateOrbitPosition(
          bodyData,
          bodyData.epoch + elapsedTime * bodySpeed,
        );

        if (bodyData.parent) {
          // For moons, set position relative to parent
          bodyData.body.position.copy(position);
        } else {
          // For planets, set position in world space
          bodyData.body.position.copy(position);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    function centerCameraOnBody(body) {
      const target = new THREE.Vector3();
      body.body.getWorldPosition(target);

      // Calculate a suitable distance based on the body's radius
      const distance = body.radius * 2;

      // Get the current camera position
      const startPosition = camera.position.clone();

      // Calculate the end position
      const endPosition = target
        .clone()
        .add(new THREE.Vector3(distance, distance / 2, distance));

      // Animate the camera position and controls target
      gsap.to(camera.position, {
        duration: 1,
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z,
        onUpdate: () => {
          controls.update();
        },
      });

      gsap.to(controls.target, {
        duration: 1,
        x: target.x,
        y: target.y,
        z: target.z,
        onUpdate: () => {
          controls.update();
        },
      });
      
    }

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function findBodyByObject(object) {
      for (const body of bodies) {
        if (body.body === object || (body.orbit && body.orbit === object)) {
          return body;
        }
        // Check if the object is a child of the body (for moons)
        if (
          body.body.children.find(
            (child) => child === object || child.children.includes(object),
          )
        ) {
          return body;
        }
      }
      return null;
    }

    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedBody = findBodyByObject(intersects[0].object);
        if (clickedBody) {
          setSelectedBody(clickedBody.name);
          centerCameraOnBody(clickedBody);
          setSelectedBodySpeed(0.01); // Slow down the selected body
          bodies.forEach((b) => {
            if (b.orbit) {
              if (b.name === clickedBody.name) {
                b.orbit.material.opacity = 1;
              } else if (b.parent === clickedBody.name) {
                b.orbit.material.opacity = 0.5;
              } else {
                b.orbit.material.opacity = 0.1;
              }
            }
          });
        }
      } else {
        setSelectedBody(null);
        setSelectedBodySpeed(1); // Reset speed when deselecting
        bodies.forEach((b) => {
          if (b.orbit) {
            b.orbit.material.opacity = 0.1;
          }
        });
      }
    }

    // Modify the OrbitControls setup (add this after creating the controls)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50000;
    controls.maxPolarAngle = Math.PI;

    window.addEventListener("click", onMouseClick);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    // Set initial camera position
    camera.position.set(0, 200, 200);
    controls.update();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onMouseClick);
      currentMount.removeChild(renderer.domElement);
    };
  }, [speed, distanceScale]);

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
          Animation Speed: {speed.toFixed(1)}x
        </label>
        <input
          id="speed-slider"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ width: "200px" }}
        />
        <label htmlFor="orbital-speed-slider">
          Orbital Speed: {orbitalSpeedMultiplier.toFixed(1)}x
        </label>
        <input
          id="orbital-speed-slider"
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={orbitalSpeedMultiplier}
          onChange={(e) =>
            setOrbitalSpeedMultiplier(parseFloat(e.target.value))
          }
          style={{ width: "200px" }}
        />
        <label htmlFor="distance-scale-slider">
          Distance Scale: {(distanceScale * 100).toFixed(2)}%
        </label>
        <input
          id="distance-scale-slider"
          type="range"
          min="0.0002" // 1/50th of 0.01
          max="0.01"
          step="0.0002"
          value={distanceScale}
          onChange={(e) => setDistanceScale(parseFloat(e.target.value))}
          style={{ width: "200px" }}
        />
      </div>
      {selectedBody && (
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
          Selected: {selectedBody}
        </div>
      )}
    </div>
  );
}
