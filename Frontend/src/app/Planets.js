import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
new OrbitControls(camera, renderer.domElement);

const tex_loader = new THREE.TextureLoader();

const stars = tex_loader.load("./assets/2k_stars.jpg", () => {
    stars.mapping = THREE.EquirectangularReflectionMapping;
    stars.colorSpace = THREE.SRGBColorSpace;
    scene.background = stars;
});

//create a group to control the layers of the planet
const earth_group = new THREE.Group();
  earth_group.rotation.z = -23.4 * Math.PI / 180;
  scene.add(earth_group);

const geo = new THREE.IcosahedronGeometry(1, 64); // main geometry used in all the following layers
const mat = new THREE.MeshPhongMaterial({
  map: tex_loader.load("./assets/E.jpg"),
  // specularMap: loader.load("./assets/Espec.jpg"),
  // bumpMap: loader.load("./assets/8081_earthbump2k.jpg"),
  // bumpScale: 0.04
});
const earth = new THREE.Mesh(geo, mat);
earth_group.add(earth);

// Night Light
const earth_light_mat = new THREE.MeshBasicMaterial({
  map: tex_loader.load("./assets/E2.jpg")
});
earth_light_mat.blending = THREE.CustomBlending;
earth_light_mat.blendEquation = THREE.AddEquation;
earth_light_mat.blendAlpha = THREE.OneFactor;
earth_light_mat.blendDst = THREE.SrcAlphaFactor;
const earth_light = new THREE.Mesh(geo, earth_light_mat);
earth_group.add(earth_light);

// Clouds
const earth_clouds_mat = new THREE.MeshPhongMaterial({
  map: tex_loader.load("./assets/E3.jpg"),
  blending: THREE.AdditiveBlending,
});

const earth_clouds = new THREE.Mesh(geo, earth_clouds_mat);
  earth_clouds.scale.setScalar(1.0075);
  earth_group.add(earth_clouds);

// Atmosphere
const atmos_mat = new THREE.MeshLambertMaterial({
  color: 0x1F9FFF,
  transparent: true,
  opacity: 0.3
});
const atmos = new THREE.Mesh(geo, atmos_mat);
  atmos.scale.setScalar(1.02);
  earth_group.add(atmos);

// Light source
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Helpers
// scene.add(new THREE.AxesHelper(20));

// Animation loop
function animate() {
  earth.rotation.y += 0.001;
  earth_light.rotation.y += 0.001;
  earth_clouds.rotation.y += 0.0013;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
