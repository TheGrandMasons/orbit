"use client";
import * as three from "three";
import { useRef, useEffect, useState, useCallback } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Range } from "react-range";

const Home = () => {
  const mainElementRef = useRef(null);
  const [clockTime, setClockTime] = useState(null);
  const [speed, setSpeed] = useState(1);
  const animationFrameId = useRef(null);
  const angleRef = useRef(0);
  const lastUpdateTime = useRef(Date.now());

  const stepEvaluation = (time) => {
    return (2 * Math.PI) / (60 * time);
  };

  const updateClock = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastUpdateTime.current;
    lastUpdateTime.current = now;

    setClockTime((prevTime) => {
      if (!prevTime) return null;
      const newTime = new Date(prevTime.getTime() + deltaTime * speed);
      return newTime;
    });
  }, [speed]);

  useEffect(() => {
    setClockTime(new Date());
    const scene = new three.Scene();
    const renderer = new three.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);

    const controls = new OrbitControls(camera, renderer.domElement);

    const planet = new three.Mesh(
      new three.SphereGeometry(2, 100, 100),
      new three.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    scene.add(planet);

    const line = new three.Line(
      new three.BufferGeometry().setFromPoints([
        new three.Vector3(-15, 0, 0),
        new three.Vector3(15, 0, 0),
      ]),
      new three.LineBasicMaterial({ color: 0x0000ff })
    );
    scene.add(line);

    const animate = () => {
      angleRef.current += stepEvaluation(30) * speed;
      planet.position.x = 15 * Math.cos(angleRef.current);
      planet.position.y = 15 * Math.sin(angleRef.current);

      updateClock();
      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    const mainElementRefCurrent = mainElementRef.current;
    if (mainElementRefCurrent) {
      mainElementRefCurrent.appendChild(renderer.domElement);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (mainElementRefCurrent) {
        mainElementRefCurrent.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, [speed, updateClock]);

  const formatClockTime = (date) => {
    if (!date) return "Loading...";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={mainElementRef}></div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        Digital Clock: {formatClockTime(clockTime)}
      </div>

      {/* React-Range Slider */}
      <div className="slider">
        <label style={{ color: "white" }}>Speed: {speed.toFixed(1)}</label>
        <Range
          step={1}
          min={-10}
          max={10}
          values={[speed]}
          onChange={(values) => setSpeed(values[0])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ccc",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "20px",
                width: "20px",
                backgroundColor: "#999",
                borderRadius: "50%",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Home;
