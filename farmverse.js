// UYIRMANN FARMVERSE — 3D FARM WORLD
// This is the first playable 3D environment.

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const root = document.createElement("div");

root.id = "farm3d";
root.style.cssText = `
  position:relative;
  width:100%;
  height:65vh;
  min-height:380px;
  overflow:hidden;
  border-radius:18px;
  background:#b8e8ff;
`;

document.body.appendChild(root);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#b8e8ff");
scene.fog = new THREE.Fog("#b8e8ff", 35, 100);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  root.clientWidth / root.clientHeight,
  0.1,
  200
);

camera.position.set(0, 8, 15);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  root.clientWidth,
  root.clientHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

root.appendChild(renderer.domElement);

// Lighting
const skyLight = new THREE.HemisphereLight(
  0xdff4ff,
  0x65513a,
  2.2
);

scene.add(skyLight);

const sunlight = new THREE.DirectionalLight(
  0xfff1c4,
  3
);

sunlight.position.set(12, 20, 8);
sunlight.castShadow = true;
scene.add(sunlight);

// Materials
const grassMaterial = new THREE.MeshStandardMaterial({
  color: "#568d43",
  roughness: 1
});

const soilMaterial = new THREE.MeshStandardMaterial({
  color: "#79512f",
  roughness: 1
});

const cropMaterial = new THREE.MeshStandardMaterial({
  color: "#78b83f",
  roughness: 0.85
});

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  grassMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Farming plot
const plot = new THREE.Mesh(
  new THREE.BoxGeometry(15, 0.12, 12),
  soilMaterial
);

plot.position.set(0, 0.07, 0);
plot.receiveShadow = true;
scene.add(plot);

// Crop rows
function createCrop(x, z) {
  const group = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.045,
      0.065,
      0.8,
      7
    ),
    new THREE.MeshStandardMaterial({
      color: "#377b2c"
    })
  );

  stem.position.y = 0.42;
  stem.castShadow = true;
  group.add(stem);

  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.16,
        8,
        6
      ),
      cropMaterial
    );

    leaf.scale.set(1.6, 0.35, 0.6);

    leaf.position.set(
      i === 0 ? -0.13 : i === 1 ? 0.13 : 0,
      0.35 + i * 0.12,
      i === 2 ? -0.12 : 0
    );

    leaf.rotation.z = i % 2 === 0 ? 0.35 : -0.35;

    leaf.castShadow = true;
    group.add(leaf);
  }

  group.position.set(x, 0.15, z);
  scene.add(group);
}

// Plant a starter field.
for (let row = 0; row < 7; row++) {
  for (let column = 0; column < 9; column++) {
    createCrop(
      -6 + column * 1.5,
      -4.5 + row * 1.5
    );
  }
}

// Trees around the farm.
function createTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.25,
      0.35,
      2,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: "#68452b"
    })
  );

  trunk.position.set(x, 1, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 12, 10),
    new THREE.MeshStandardMaterial({
      color: "#2f793d",
      roughness: 1
    })
  );

  crown.position.set(x, 2.5, z);
  crown.castShadow = true;
  scene.add(crown);
}

createTree(-13, -8);
createTree(13, -9);
createTree(-12, 9);
createTree(13, 9);

// Basic exploration controls.
let angle = 0;
let distance = 15;

root.addEventListener("pointerdown", (event) => {
  root.setPointerCapture(event.pointerId);

  root.dataset.startX = event.clientX;
});

root.addEventListener("pointermove", (event) => {
  if (event.buttons === 0) return;

  const previousX = Number(root.dataset.startX || event.clientX);

  angle += (event.clientX - previousX) * 0.006;

  root.dataset.startX = event.clientX;
});

root.addEventListener("wheel", (event) => {
  distance += event.deltaY * 0.01;

  distance = THREE.MathUtils.clamp(
    distance,
    7,
    35
  );
});

function animate() {
  requestAnimationFrame(animate);

  camera.position.x = Math.sin(angle) * distance;
  camera.position.z = Math.cos(angle) * distance;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

// Responsive rendering.
window.addEventListener("resize", () => {
  if (!root.clientWidth || !root.clientHeight) return;

  camera.aspect = root.clientWidth / root.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    root.clientWidth,
    root.clientHeight
  );
});
