"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const Home = () => {
  const [orbitalSpeedMultiplier, setOrbitalSpeedMultiplier] = useState(16);
  const mountRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [selectedBody, setSelectedBody] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    const texture = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
      "/img/stars.jpg",
      "/img/stars.jpg",
      "/img/stars.jpg",
      "/img/stars.jpg",
      "/img/stars.jpg",
      "/img/stars.jpg", 
    ]);

    // Updated Solar System Data with Keplerian elements
    const celestialBodies = [
      { name: "Sun", radius: 15, color: 0xffff00, mass: 1.989e30 },
      {
        name: "Mercury",
        radius: 3,
        color: 0x8c7853,
        a: 20,
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
        radius: 5,
        color: 0xffd700,
        a: 30,
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
        radius: 5,
        color: 0x0000ff,
        a: 40,
        e: 0.017,
        i: 0.0,
        omega: 348.7,
        w: 114.2,
        M0: 357.5,
        epoch: 2451545.0,
        period: 1.0,
      },
      {
        name: "Mars",
        radius: 4,
        color: 0xff4500,
        a: 50,
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
        radius: 10,
        color: 0xffa500,
        a: 70,
        e: 0.048,
        i: 1.3,
        omega: 100.5,
        w: 273.9,
        M0: 20.0,
        epoch: 2451545.0,
        period: 11.86,
      },
      {
        name: "Saturn",
        radius: 9,
        color: 0xffd700,
        a: 90,
        e: 0.054,
        i: 2.5,
        omega: 113.7,
        w: 339.4,
        M0: 317.0,
        epoch: 2451545.0,
        period: 29.46,
      },
      {
        name: "Uranus",
        radius: 7,
        color: 0x40e0d0,
        a: 110,
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
        radius: 7,
        color: 0x4169e1,
        a: 130,
        e: 0.009,
        i: 1.8,
        omega: 131.7,
        w: 273.2,
        M0: 256.2,
        epoch: 2451545.0,
        period: 164.79,
      },
      // Moons
      {
        name: "Moon",
        radius: 1.5,
        color: 0xcccccc,
        a: 8,
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
        name: "Io",
        radius: 2,
        color: 0xffff00,
        a: 15,
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
        a: 18,
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
        name: "Ganymede",
        radius: 2.2,
        color: 0x8b7d82,
        a: 21,
        e: 0.0013,
        i: 0.2,
        omega: 63.552,
        w: 192.417,
        M0: 317.54,
        epoch: 2451545.0,
        period: 0.01962,
        parent: "Jupiter",
      },
      {
        name: "Callisto",
        radius: 2,
        color: 0x7c6a5f,
        a: 24,
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
        name: "Titan",
        radius: 2.4,
        color: 0xe3dac9,
        a: 20,
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
        name: "Rhea",
        radius: 1.2,
        color: 0xd6c2ac,
        a: 16,
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
        a: 24,
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
        name: "Triton",
        radius: 1.8,
        color: 0x8e9ca1,
        a: 15,
        e: 0.0001,
        i: 156.865,
        omega: 61.257,
        w: 83.31,
        M0: 92.762,
        epoch: 2451545.0,
        period: 0.01992,
        parent: "Neptune",
      },
      {
        name: "Oberon",
        radius: 1.4,
        color: 0xa3a4a6,
        a: 18,
        e: 0.0014,
        i: 0.07,
        omega: 95.363,
        w: 10.075,
        M0: 299.872,
        epoch: 2451545.0,
        period: 0.08352,
        parent: "Uranus",
      },
    ];

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

    function calculateOrbitPosition(
      body,
      t,
      parentPosition = new THREE.Vector3()
    ) {
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

      // Scale the position for visualization
      const scaleFactor = body.parent ? 1 : 5; // Smaller scale for moons, relative to their parent
      const position = new THREE.Vector3(
        xEcl * scaleFactor,
        yEcl * scaleFactor,
        zEcl * scaleFactor
      );

      // Add parent position for moons
      return position.add(parentPosition);
    }
    // Create celestial bodies and their orbits
    function createCelestialBody(data, parentBody = null) {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        // color: data.color,
        map: texture.load(`/img/${String(data.name).toLowerCase()}.jpg`),
      });
      const body = new THREE.Mesh(geometry, material);
      scene.add(body);

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
        const parentPosition = parentBody
          ? parentBody.body.position
          : new THREE.Vector3();
        orbitPoints.push(calculateOrbitPosition(data, t, parentPosition));
      }
      orbitGeometry.setFromPoints(orbitPoints);
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbit);

      return { body, orbit, ...data };
    }

    // Create bodies

    const bodyMap = new Map();

    celestialBodies.forEach((data) => {
      if (data.name !== "Sun") {
        const parentBody = data.parent ? bodyMap.get(data.parent) : null;
        const body = createCelestialBody(data, parentBody);
        bodies.push(body);
        bodyMap.set(data.name, body);
      } else {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: data.color,
          map: texture.load(`/img/${String(data.name).toLowerCase()}.jpg`),
        });
        const sun = new THREE.Mesh(geometry, material);
        scene.add(sun);
        bodies.push({ body: sun, ...data });
        bodyMap.set(data.name, { body: sun, ...data });
      }
    });

    // Increase render distance
    camera.position.z = 200;
    camera.far = 10000;
    camera.updateProjectionMatrix();

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime =
        clock.getElapsedTime() * speed * orbitalSpeedMultiplier;

      bodies.forEach((bodyData) => {
        if (bodyData.name === "Sun") return; // Skip the Sun

        let position;
        if (bodyData.parent) {
          const parentBody = bodies.find((b) => b.name === bodyData.parent);
          const parentPosition = parentBody.body.position;
          position = calculateOrbitPosition(
            bodyData,
            bodyData.epoch + elapsedTime
          );
          position.add(parentPosition);
        } else {
          position = calculateOrbitPosition(
            bodyData,
            bodyData.epoch + elapsedTime
          );
        }
        bodyData.body.position.copy(position);
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    function centerCameraOnBody(body) {
      const target = new THREE.Vector3();
      body.body.getWorldPosition(target);
      camera.position.copy(target);
      camera.position.z += 20;
      controls.target.copy(target);
    }

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const clickedBody = bodies.find((b) => b.body === intersects[0].object);
        if (clickedBody) {
          setSelectedBody(clickedBody.name);
          centerCameraOnBody(clickedBody);
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

    window.addEventListener("click", onMouseClick);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onMouseClick);
      currentMount.removeChild(renderer.domElement);
    };
  }, [speed]);

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
};

export default Home;
