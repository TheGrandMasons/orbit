"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function SolarSystem() {
  const [orbitalSpeedMultiplier, setOrbitalSpeedMultiplier] = useState(16);
  const mountRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [selectedBody, setSelectedBody] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeout = useRef(null);


  useEffect(() => {
    let scene, camera, renderer, controls = [];

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;


    // Updated Solar System Data with Keplerian elements
    const celestialBodies = [
      { name: "Sun", radius: 20, color: 0xffff00, mass: 1.989e30 },
      {
        name: "Mercury",
        radius: 3,
        color: 0x8c7853,
        a: 38.7,
        e: 0.206,
        i: 7.0,
        omega: 48.3,
        w: 29.1,
        M0: 174.8,
        epoch: 2451545.0,
        period: 0.241,
      },
      {
        name: "Venus",
        radius: 4,
        color: 0xffd700,
        a: 72.3,
        e: 0.007,
        i: 3.4,
        omega: 76.7,
        w: 54.9,
        M0: 50.4,
        epoch: 2451545.0,
        period: 0.615,
      },
      {
        name: "Earth",
        radius: 4,
        color: 0x0000ff,
        a: 100,
        e: 0.017,
        i: 0.0,
        omega: 348.7,
        w: 114.2,
        M0: 357.5,
        epoch: 2451545.0,
        period: 1.0,
      },
      {
        name: "Moon",
        radius: 1.5,
        color: 0xcccccc,
        a: 10,
        e: 0.0549,
        i: 5.145,
        omega: 125.08,
        w: 318.15,
        M0: 135.27,
        epoch: 2451545.0,
        period: 0.0748,
        parent: "Earth",
      },
      {
        name: "Mars",
        radius: 3.5,
        color: 0xff4500,
        a: 152,
        e: 0.093,
        i: 1.8,
        omega: 49.6,
        w: 286.5,
        M0: 19.4,
        epoch: 2451545.0,
        period: 1.881,
      },
      {
        name: "Jupiter",
        radius: 11,
        color: 0xffa500,
        a: 520,
        e: 0.048,
        i: 1.3,
        omega: 100.5,
        w: 273.9,
        M0: 20.0,
        epoch: 2451545.0,
        period: 11.86,
      },
      {
        name: "Io",
        radius: 2,
        color: 0xffff00,
        a: 30,
        e: 0.0041,
        i: 0.04,
        omega: 43.977,
        w: 84.129,
        M0: 342.021,
        epoch: 2451545.0,
        period: 0.00485,
        parent: "Jupiter",
      },
      {
        name: "Europa",
        radius: 1.8,
        color: 0xa57c1b,
        a: 48,
        e: 0.009,
        i: 0.47,
        omega: 219.106,
        w: 88.97,
        M0: 171.016,
        epoch: 2451545.0,
        period: 0.00972,
        parent: "Jupiter",
      },
      {
        name: "Saturn",
        radius: 9,
        color: 0xffd700,
        a: 953,
        e: 0.054,
        i: 2.5,
        omega: 113.7,
        w: 339.4,
        M0: 317.0,
        epoch: 2451545.0,
        period: 29.46,
      },
      {
        name: "Titan",
        radius: 2.4,
        color: 0xe3dac9,
        a: 80,
        e: 0.0288,
        i: 0.34,
        omega: 28.06,
        w: 180.532,
        M0: 120.589,
        epoch: 2451545.0,
        period: 0.0437,
        parent: "Saturn",
      },
      {
        name: "Uranus",
        radius: 6,
        color: 0x40e0d0,
        a: 1920,
        e: 0.047,
        i: 0.8,
        omega: 74.0,
        w: 96.7,
        M0: 142.2,
        epoch: 2451545.0,
        period: 84.01,
      },
      {
        name: "Neptune",
        radius: 5.8,
        color: 0x4169e1,
        a: 3007,
        e: 0.009,
        i: 1.8,
        omega: 131.7,
        w: 273.2,
        M0: 256.2,
        epoch: 2451545.0,
        period: 164.79,
      },
      {
        name: "Ganymede",
        radius: 2.2,
        color: 0x8b7d82,
        a: 76,
        e: 0.0013,
        i: 0.20,
        omega: 63.552,
        w: 192.417,
        M0: 317.540,
        epoch: 2451545.0,
        period: 0.01962,
        parent: "Jupiter",
      },
      {
        name: "Callisto",
        radius: 2,
        color: 0x7c6a5f,
        a: 134,
        e: 0.0074,
        i: 0.192,
        omega: 298.848,
        w: 52.643,
        M0: 181.408,
        epoch: 2451545.0,
        period: 0.04551,
        parent: "Jupiter",
      },
      {
        name: "Triton",
        radius: 1.8,
        color: 0x8e9ca1,
        a: 30,
        e: 0.0001,
        i: 156.865,
        omega: 61.257,
        w: 83.310,
        M0: 92.762,
        epoch: 2451545.0,
        period: 0.01992,
        parent: "Neptune",
      },
      {
        name: "Rhea",
        radius: 1.2,
        color: 0xd6c2ac,
        a: 44,
        e: 0.001258,
        i: 0.331,
        omega: 249.928,
        w: 77.339,
        M0: 52.123,
        epoch: 2451545.0,
        period: 0.02852,
        parent: "Saturn",
      },
      {
        name: "Iapetus",
        radius: 1.4,
        color: 0x6b4e31,
        a: 240,
        e: 0.028612,
        i: 15.47,
        omega: 117.543,
        w: 227.403,
        M0: 14.275,
        epoch: 2451545.0,
        period: 0.07952,
        parent: "Saturn",
      },
      {
        name: "Phobos",
        radius: 0.8,
        color: 0x8b8378,
        a: 6,
        e: 0.0151,
        i: 1.093,
        omega: 200.193,
        w: 112.091,
        M0: 255.234,
        epoch: 2451545.0,
        period: 0.00031,
        parent: "Mars",
      },
      {
        name: "Deimos",
        radius: 0.6,
        color: 0x6d6050,
        a: 10,
        e: 0.0002,
        i: 0.931,
        omega: 53.202,
        w: 45.235,
        M0: 150.234,
        epoch: 2451545.0,
        period: 0.00126,
        parent: "Mars",
      },
      {
        name: "Oberon",
        radius: 1.4,
        color: 0xa3a4a6,
        a: 60,
        e: 0.0014,
        i: 0.070,
        omega: 95.363,
        w: 10.075,
        M0: 299.872,
        epoch: 2451545.0,
        period: 0.08352,
        parent: "Uranus",
      },
      {
        name: "Titania",
        radius: 1.4,
        color: 0xa7a9a5,
        a: 44,
        e: 0.0011,
        i: 0.340,
        omega: 356.689,
        w: 227.257,
        M0: 149.582,
        epoch: 2451545.0,
        period: 0.05043,
        parent: "Uranus",
      },
      {
        name: "Miranda",
        radius: 1,
        color: 0xbfbfbe,
        a: 14,
        e: 0.0012,
        i: 4.232,
        omega: 69.391,
        w: 98.142,
        M0: 294.231,
        epoch: 2451545.0,
        period: 0.01214,
        parent: "Uranus",
      },
      {
        name: "Dione",
        radius: 1,
        color: 0xc7b8a8,
        a: 32,
        e: 0.0022,
        i: 0.028,
        omega: 321.138,
        w: 302.651,
        M0: 33.928,
        epoch: 2451545.0,
        period: 0.02812,
        parent: "Saturn",
      },
      {
        name: "Ariel",
        radius: 1.2,
        color: 0xbbbdbc,
        a: 20,
        e: 0.0011,
        i: 0.260,
        omega: 134.984,
        w: 124.504,
        M0: 90.413,
        epoch: 2451545.0,
        period: 0.02577,
        parent: "Uranus",
      },
      {
        name: "Enceladus",
        radius: 0.8,
        color: 0xf2f3f4,
        a: 20,
        e: 0.0047,
        i: 0.009,
        omega: 185.978,
        w: 301.450,
        M0: 16.038,
        epoch: 2451545.0,
        period: 0.01296,
        parent: "Saturn",
      },
      {
        name: "Mimas",
        radius: 0.6,
        color: 0xd1ccc9,
        a: 16,
        e: 0.0196,
        i: 1.574,
        omega: 110.393,
        w: 307.979,
        M0: 219.263,
        epoch: 2451545.0,
        period: 0.00985,
        parent: "Saturn",
      },
      {
        name: "Umbriel",
        radius: 1.2,
        color: 0x9b9c98,
        a: 28,
        e: 0.0039,
        i: 0.128,
        omega: 184.143,
        w: 120.897,
        M0: 125.765,
        epoch: 2451545.0,
        period: 0.04642,
        parent: "Uranus",
      },
      {
        name: "Proteus",
        radius: 1,
        color: 0x7d6b67,
        a: 10,
        e: 0.00053,
        i: 0.782,
        omega: 38.165,
        w: 213.326,
        M0: 275.614,
        epoch: 2451545.0,
        period: 0.00109,
        parent: "Neptune",
      },
      {
        name: "Nereid",
        radius: 1.2,
        color: 0x909d98,
        a: 440,
        e: 0.751,
        i: 7.232,
        omega: 324.465,
        w: 23.524,
        M0: 123.984,
        epoch: 2451545.0,
        period: 0.36149,
        parent: "Neptune",
      },
    ];

    const bodies = [];

    // Keplerian orbit calculation functions
    function degToRad(deg) {
      return deg * Math.PI / 180;
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

    function calculateOrbitPosition(body, t, parentPosition = new THREE.Vector3()) {
      const n = 2 * Math.PI / (body.period * 365.25); // Mean motion
      const M = degToRad(body.M0) + n * (t - body.epoch);
      const E = solveKeplerEquation(M, body.e);
      const x = body.a * (Math.cos(E) - body.e);
      const y = body.a * Math.sqrt(1 - body.e * body.e) * Math.sin(E);

      // Convert to 3D coordinates
      const xEcl = x * (Math.cos(degToRad(body.omega)) * Math.cos(degToRad(body.w)) -
        Math.sin(degToRad(body.omega)) * Math.sin(degToRad(body.w)) * Math.cos(degToRad(body.i))) -
        y * (Math.cos(degToRad(body.omega)) * Math.sin(degToRad(body.w)) +
          Math.sin(degToRad(body.omega)) * Math.cos(degToRad(body.w)) * Math.cos(degToRad(body.i)));
      const yEcl = x * (Math.sin(degToRad(body.omega)) * Math.cos(degToRad(body.w)) +
        Math.cos(degToRad(body.omega)) * Math.sin(degToRad(body.w)) * Math.cos(degToRad(body.i))) +
        y * (Math.cos(degToRad(body.omega)) * Math.cos(degToRad(body.w)) * Math.cos(degToRad(body.i)) -
          Math.sin(degToRad(body.omega)) * Math.sin(degToRad(body.w)));
      const zEcl = x * Math.sin(degToRad(body.w)) * Math.sin(degToRad(body.i)) +
        y * Math.cos(degToRad(body.w)) * Math.sin(degToRad(body.i));

      // Scale the position for visualization
      const scaleFactor = body.parent ? 1 : 5; // Smaller scale for moons, relative to their parent
      const position = new THREE.Vector3(xEcl * scaleFactor, yEcl * scaleFactor, zEcl * scaleFactor);

      // For moons, return the position relative to the parent
      return body.parent ? position : position.add(parentPosition);
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
        parentBody.body.add(body);
        parentBody.body.add(orbit);
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
        const parentBody = data.parent ? bodyMap.get(data.parent) : null;
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

    // Increase render distance
    camera.position.z = 200;
    camera.far = 10000000;
    camera.updateProjectionMatrix();

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime() * speed * orbitalSpeedMultiplier;

      bodies.forEach((bodyData) => {
        if (bodyData.name === "Sun") return; // Skip the Sun

        let position;
        if (bodyData.parent) {
          const parentBody = bodies.find(b => b.name === bodyData.parent);
          const parentPosition = parentBody.body.position;
          position = calculateOrbitPosition(bodyData, bodyData.epoch + elapsedTime);
          bodyData.body.position.copy(position);
        } else {
          position = calculateOrbitPosition(bodyData, bodyData.epoch + elapsedTime);
          bodyData.body.position.copy(position);
        }
      });

      if (selectedBody) {
        const selectedBodyObject = bodies.find(b => b.name === selectedBody);
        if (selectedBodyObject) {
          const target = new THREE.Vector3();
          selectedBodyObject.body.getWorldPosition(target);
          camera.position.lerp(target.add(new THREE.Vector3(0, 0, 20)), 0.1);
          controls.target.lerp(target, 0.1);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedBody = bodies.find((b) => b.body === intersects[0].object || b.body.isAncestorOf(intersects[0].object));
        if (clickedBody) {
          setSelectedBody(clickedBody.name);
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
        bodies.forEach((b) => {
          if (b.orbit) {
            b.orbit.material.opacity = 0.1;
          }
        });
      }
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("click", onMouseClick);
    window.addEventListener("resize", onWindowResize, false);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onMouseClick);
      mountRef.current.removeChild(renderer.domElement);
      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [speed, orbitalSpeedMultiplier, selectedBody]);

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
          onChange={(e) => setOrbitalSpeedMultiplier(parseFloat(e.target.value))}
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