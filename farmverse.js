// ======================================================
// UYIRMANN FARMVERSE
// Tamil Nadu 3D Farming Simulator - Version 2
// ======================================================

import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ------------------------------------------------------
// 1. FARM DATA
// ------------------------------------------------------

const crops = {
  rice: {
    tamil: "நெல்",
    english: "Paddy",
    stages: ["விதை", "நாற்று", "வளர்ச்சி", "கதிர்", "முதிர்ச்சி"],
    water: 4,
    color: "#75b83f",
    matureColor: "#e5c34f",
    time: 45
  },

  maize: {
    tamil: "மக்காச்சோளம்",
    english: "Maize",
    stages: ["விதை", "முளை", "வளர்ச்சி", "கதிர்", "முதிர்ச்சி"],
    water: 3,
    color: "#5ca83b",
    matureColor: "#e6c34e",
    time: 35
  },

  millet: {
    tamil: "கம்பு",
    english: "Pearl Millet",
    stages: ["விதை", "முளை", "வளர்ச்சி", "கதிர்", "முதிர்ச்சி"],
    water: 2,
    color: "#75a83a",
    matureColor: "#d7b75b",
    time: 30
  },

  groundnut: {
    tamil: "நிலக்கடலை",
    english: "Groundnut",
    stages: ["விதை", "முளை", "வளர்ச்சி", "பூ", "காய்"],
    water: 2,
    color: "#5b9d36",
    matureColor: "#b88b48",
    time: 35
  },

  tomato: {
    tamil: "தக்காளி",
    english: "Tomato",
    stages: ["விதை", "முளை", "செடி", "பூ", "பழம்"],
    water: 3,
    color: "#398d38",
    matureColor: "#e34236",
    time: 25
  },

  brinjal: {
    tamil: "கத்திரிக்காய்",
    english: "Brinjal",
    stages: ["விதை", "முளை", "செடி", "பூ", "காய்"],
    water: 3,
    color: "#368a38",
    matureColor: "#7650a5",
    time: 30
  },

  chilli: {
    tamil: "மிளகாய்",
    english: "Chilli",
    stages: ["விதை", "முளை", "செடி", "பூ", "காய்"],
    water: 2,
    color: "#428e35",
    matureColor: "#d84232",
    time: 30
  },

  banana: {
    tamil: "வாழை",
    english: "Banana",
    stages: ["கன்று", "இலை", "வளர்ச்சி", "குலை", "முதிர்ச்சி"],
    water: 4,
    color: "#409b43",
    matureColor: "#e6cf4b",
    time: 60
  },

  sugarcane: {
    tamil: "கரும்பு",
    english: "Sugarcane",
    stages: ["கரணை", "முளை", "தண்டு", "வளர்ச்சி", "முதிர்ச்சி"],
    water: 4,
    color: "#3c9138",
    matureColor: "#b9c45c",
    time: 60
  },

  sesame: {
    tamil: "எள்",
    english: "Sesame",
    stages: ["விதை", "முளை", "செடி", "பூ", "காய்"],
    water: 2,
    color: "#5e9d3d",
    matureColor: "#c5aa68",
    time: 30
  },

  turmeric: {
    tamil: "மஞ்சள்",
    english: "Turmeric",
    stages: ["விதைத் துண்டு", "முளை", "இலை", "வளர்ச்சி", "கிழங்கு"],
    water: 3,
    color: "#45923b",
    matureColor: "#e6a82c",
    time: 45
  },

  coconut: {
    tamil: "தென்னை",
    english: "Coconut",
    stages: ["கன்று", "இளம் மரம்", "வளர்ச்சி", "காய்", "முதிர்ச்சி"],
    water: 3,
    color: "#328747",
    matureColor: "#a4a35a",
    time: 90
  }
};

// These timers are game-time approximations, not real
// agricultural crop durations.

// ------------------------------------------------------
// 2. GAME STATE
// ------------------------------------------------------

const state = {
  selectedCrop: "rice",
  selectedPlot: 0,
  coins: 100,
  harvests: 0,
  planted: 0,
  watered: 0,
  plots: []
};

// ------------------------------------------------------
// 3. CREATE GAME INTERFACE
// ------------------------------------------------------

const gameRoot = document.getElementById("farm3d");

if (!gameRoot) {
  throw new Error(
    "Farm container #farm3d was not found."
  );
}

gameRoot.style.position = "relative";
gameRoot.style.overflow = "hidden";

const interfacePanel = document.createElement("div");

interfacePanel.style.cssText = `
  padding: 16px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: #102b20;
  color: white;
  font-family: Arial, sans-serif;
`;

interfacePanel.innerHTML = `
  <h2 style="color:#8dffad;margin-top:0">
    🌾 தமிழ் பயிர்கள் | Tamil Crops
  </h2>

  <label for="cropSelect">
    Choose a crop / பயிரைத் தேர்ந்தெடுக்கவும்
  </label>

  <select id="cropSelect" style="
    display:block;
    width:100%;
    padding:12px;
    margin-top:8px;
    border-radius:8px;
    font-size:16px;
  "></select>

  <p id="cropInfo" style="line-height:1.7"></p>

  <div style="
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:8px;
  ">
    <button id="plantButton">🌱 விதை நடு</button>
    <button id="waterButton">💧 தண்ணீர் ஊற்று</button>
    <button id="harvestButton">🌾 அறுவடை</button>
    <button id="nextPlotButton">➡️ அடுத்த நிலம்</button>
  </div>

  <p id="farmStatus" aria-live="polite">
    உங்கள் விவசாயப் பயணம் தொடங்கட்டும்!
  </p>

  <div id="farmStats" style="
    padding:12px;
    border-radius:10px;
    background:#071b13;
    line-height:1.8;
  "></div>
`;

gameRoot.parentNode.insertBefore(
  interfacePanel,
  gameRoot
);

const cropSelect =
  interfacePanel.querySelector("#cropSelect");

const cropInfo =
  interfacePanel.querySelector("#cropInfo");

const farmStatus =
  interfacePanel.querySelector("#farmStatus");

const farmStats =
  interfacePanel.querySelector("#farmStats");

const plantButton =
  interfacePanel.querySelector("#plantButton");

const waterButton =
  interfacePanel.querySelector("#waterButton");

const harvestButton =
  interfacePanel.querySelector("#harvestButton");

const nextPlotButton =
  interfacePanel.querySelector("#nextPlotButton");

// ------------------------------------------------------
// 4. POPULATE TAMIL CROP MENU
// ------------------------------------------------------

for (const [id, crop] of Object.entries(crops)) {
  const option = document.createElement("option");

  option.value = id;
  option.textContent =
    `${crop.tamil} — ${crop.english}`;

  cropSelect.appendChild(option);
}

cropSelect.addEventListener("change", () => {
  state.selectedCrop = cropSelect.value;
  updateCropInfo();
});

function updateCropInfo() {
  const crop = crops[state.selectedCrop];

  cropInfo.innerHTML = `
    <strong>${crop.tamil} — ${crop.english}</strong><br>
    வளர்ச்சி நிலைகள்: ${crop.stages.join(" → ")}<br>
    தேவையான நீர்: ${crop.water}/4<br>
    விளையாட்டு வளர்ச்சி நேரம்: சுமார் ${crop.time} விநாடிகள்
  `;
}

// ------------------------------------------------------
// 5. THREE.JS WORLD
// ------------------------------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color("#b8e8ff");

scene.fog = new THREE.Fog(
  "#b8e8ff",
  35,
  100
);

const camera = new THREE.PerspectiveCamera(
  55,
  1,
  0.1,
  200
);

camera.position.set(0, 12, 20);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 1.5)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

gameRoot.appendChild(renderer.domElement);

const skyLight = new THREE.HemisphereLight(
  "#e5f5ff",
  "#6d583b",
  2
);

scene.add(skyLight);

const sunlight = new THREE.DirectionalLight(
  "#fff0c2",
  2.5
);

sunlight.position.set(12, 20, 10);
sunlight.castShadow = true;

scene.add(sunlight);

// ------------------------------------------------------
// 6. SOIL AND FIELD
// ------------------------------------------------------

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    color: "#63964a",
    roughness: 1
  })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.15;
ground.receiveShadow = true;

scene.add(ground);

const field = new THREE.Mesh(
  new THREE.BoxGeometry(16, 0.15, 12),
  new THREE.MeshStandardMaterial({
    color: "#80552f",
    roughness: 1
  })
);

field.position.y = -0.02;
field.receiveShadow = true;

scene.add(field);

// Soil lines.
const soilLines = new THREE.Group();

for (let z = -5; z <= 5; z += 1.5) {
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.025, 0.045),
    new THREE.MeshStandardMaterial({
      color: "#59371f"
    })
  );

  line.position.set(0, 0.065, z);

  soilLines.add(line);
}

scene.add(soilLines);

// ------------------------------------------------------
// 7. TREES
// ------------------------------------------------------

function createTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.2,
      0.3,
      2,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: "#79502e"
    })
  );

  trunk.position.set(x, 1, z);
  trunk.castShadow = true;

  scene.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 10, 8),
    new THREE.MeshStandardMaterial({
      color: "#347c39",
      roughness: 1
    })
  );

  crown.position.set(x, 2.5, z);
  crown.scale.y = 1.1;
  crown.castShadow = true;

  scene.add(crown);
}

createTree(-12, -8);
createTree(12, -8);
createTree(-12, 9);
createTree(12, 9);

// ------------------------------------------------------
// 8. FARM PLOTS
// ------------------------------------------------------

const plotGroup = new THREE.Group();

scene.add(plotGroup);

const plotGeometry = new THREE.BoxGeometry(
  3.4,
  0.12,
  2.6
);

const plotMaterial = new THREE.MeshStandardMaterial({
  color: "#98683e",
  roughness: 1
});

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    const index = row * 4 + col;

    const plot = new THREE.Mesh(
      plotGeometry,
      plotMaterial.clone()
    );

    plot.position.set(
      -5.4 + col * 3.6,
      0.12,
      -3.8 + row * 3.8
    );

    plot.castShadow = true;
    plot.receiveShadow = true;

    plot.userData.plotIndex = index;

    plotGroup.add(plot);

    state.plots.push({
      crop: null,
      stage: 0,
      water: 0,
      plantedAt: 0,
      mesh: plot,
      plantGroup: null,
      ripe: false
    });
  }
}

// Highlight selected plot.
const selection = new THREE.Mesh(
  new THREE.BoxGeometry(3.55, 0.035, 2.75),
  new THREE.MeshBasicMaterial({
    color: "#f6ff78",
    wireframe: true
  })
);

scene.add(selection);

function updateSelection() {
  const plot = state.plots[state.selectedPlot];

  selection.position.set(
    plot.mesh.position.x,
    0.24,
    plot.mesh.position.z
  );
}

updateSelection();

// ------------------------------------------------------
// 9. PLANT MODELS
// ------------------------------------------------------

function createPlant(cropId, stage) {
  const crop = crops[cropId];

  const group = new THREE.Group();

  const scale = 0.2 + stage * 0.2;

  const stemHeight = 0.35 + scale;

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.035,
      0.06,
      stemHeight,
      7
    ),
    new THREE.MeshStandardMaterial({
      color: "#347b32"
    })
  );

  stem.position.y = stemHeight / 2;
  stem.castShadow = true;

  group.add(stem);

  for (let i = 0; i < 4; i++) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.2 + stage * 0.06,
        8,
        6
      ),
      new THREE.MeshStandardMaterial({
        color: crop.color,
        roughness: 0.9
      })
    );

    leaf.scale.set(1.5, 0.3, 0.65);

    leaf.position.set(
      Math.sin(i * Math.PI / 2) * 0.23,
      0.2 + i * 0.12,
      Math.cos(i * Math.PI / 2) * 0.23
    );

    leaf.rotation.z = i % 2 === 0 ? 0.35 : -0.35;

    leaf.castShadow = true;

    group.add(leaf);
  }

  // Tomato and chilli fruits.
  if (
    stage >= 3 &&
    ["tomato", "chilli"].includes(cropId)
  ) {
    for (let i = 0; i < 3; i++) {
      const fruit = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 8, 8),
        new THREE.MeshStandardMaterial({
          color: crop.matureColor
        })
      );

      fruit.position.set(
        Math.sin(i * 2.1) * 0.3,
        stemHeight * 0.7 - i * 0.15,
        Math.cos(i * 2.1) * 0.3
      );

      group.add(fruit);
    }
  }

  // Banana bunch approximation.
  if (cropId === "banana" && stage >= 3) {
    for (let i = 0; i < 4; i++) {
      const banana = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.07, 0.35, 3, 6),
        new THREE.MeshStandardMaterial({
          color: crop.matureColor
        })
      );

      banana.position.set(
        (i % 2) * 0.16,
        stemHeight * 0.85 - Math.floor(i / 2) * 0.15,
        0
      );

      group.add(banana);
    }
  }

  return group;
}

// ------------------------------------------------------
// 10. SELECT AND PLANT CROPS
// ------------------------------------------------------

function setStatus(text) {
  farmStatus.textContent = text;
}

function plantCrop() {
  const plot = state.plots[state.selectedPlot];

  if (plot.crop) {
    setStatus(
      "இந்த நிலத்தில் ஏற்கனவே பயிர் உள்ளது. முதலில் அறுவடை செய்யவும்."
    );
    return;
  }

  if (state.coins < 5) {
    setStatus(
      "விதை வாங்க போதுமான விளையாட்டு நாணயங்கள் இல்லை."
    );
    return;
  }

  state.coins -= 5;
  state.planted++;

  plot.crop = state.selectedCrop;
  plot.stage = 0;
  plot.water = 0;
  plot.plantedAt = Date.now();
  plot.ripe = false;

  plot.plantGroup = createPlant(
    plot.crop,
    plot.stage
  );

  plot.plantGroup.position.set(
    plot.mesh.position.x,
    0.2,
    plot.mesh.position.z
  );

  scene.add(plot.plantGroup);

  setStatus(
    `${crops[plot.crop].tamil} விதைக்கப்பட்டது! இப்போது நீர் ஊற்றவும்.`
  );

  updateStats();
}

plantButton.addEventListener(
  "click",
  plantCrop
);

// ------------------------------------------------------
// 11. WATER CROPS
// ------------------------------------------------------

function waterCrop() {
  const plot = state.plots[state.selectedPlot];

  if (!plot.crop) {
    setStatus(
      "முதலில் ஒரு பயிரை நடவு செய்யவும்."
    );
    return;
  }

  if (plot.ripe) {
    setStatus(
      "இந்தப் பயிர் அறுவடைக்குத் தயாராக உள்ளது!"
    );
    return;
  }

  plot.water = Math.min(
    4,
    plot.water + 1
  );

  state.watered++;

  setStatus(
    `${crops[plot.crop].tamil}: நீர் அளவு ${plot.water}/4.`
  );

  updateStats();
}

waterButton.addEventListener(
  "click",
  waterCrop
);

// ------------------------------------------------------
// 12. CROP GROWTH
// ------------------------------------------------------

function updateGrowth() {
  const now = Date.now();

  for (const plot of state.plots) {
    if (!plot.crop || plot.ripe) {
      continue;
    }

    const crop = crops[plot.crop];

    const elapsed =
      (now - plot.plantedAt) / 1000;

    const waterFactor =
      plot.water >= 1 ? 1 : 0.45;

    const progress = Math.min(
      1,
      elapsed * waterFactor / crop.time
    );

    const newStage = Math.min(
      crop.stages.length - 1,
      Math.floor(
        progress * crop.stages.length
      )
    );

    if (newStage !== plot.stage) {
      plot.stage = newStage;

      if (plot.plantGroup) {
        scene.remove(plot.plantGroup);

        plot.plantGroup.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(
                material => material.dispose()
              );
            } else {
              object.material.dispose();
            }
          }
        });
      }

      plot.plantGroup = createPlant(
        plot.crop,
        plot.stage
      );

      plot.plantGroup.position.set(
        plot.mesh.position.x,
        0.2,
        plot.mesh.position.z
      );

      scene.add(plot.plantGroup);

      if (plot.stage === crop.stages.length - 1) {
        plot.ripe = true;
      }
    }
  }
}

// ------------------------------------------------------
// 13. HARVEST
// ------------------------------------------------------

function harvestCrop() {
  const plot = state.plots[state.selectedPlot];

  if (!plot.crop) {
    setStatus(
      "இந்த நிலத்தில் பயிர் இல்லை."
    );
    return;
  }

  if (!plot.ripe) {
    const crop = crops[plot.crop];

    setStatus(
      `${crop.tamil} இன்னும் வளர்ந்து கொண்டிருக்கிறது. சிறிது நேரம் காத்திருக்கவும்.`
    );
    return;
  }

  const crop = crops[plot.crop];

  const reward = 10 + plot.water * 5;

  state.coins += reward;
  state.harvests++;

  scene.remove(plot.plantGroup);

  plot.plantGroup = null;
  plot.crop = null;
  plot.stage = 0;
  plot.water = 0;
  plot.plantedAt = 0;
  plot.ripe = false;

  setStatus(
    `${crop.tamil} அறுவடை வெற்றி! +${reward} விளையாட்டு நாணயங்கள்.`
  );

  updateStats();
}

harvestButton.addEventListener(
  "click",
  harvestCrop
);

// ------------------------------------------------------
// 14. SELECT NEXT PLOT
// ------------------------------------------------------

nextPlotButton.addEventListener(
  "click",
  () => {
    state.selectedPlot =
      (state.selectedPlot + 1) %
      state.plots.length;

    updateSelection();

    const plot = state.plots[state.selectedPlot];

    if (plot.crop) {
      setStatus(
        `தேர்ந்தெடுக்கப்பட்ட நிலம்: ${crops[plot.crop].tamil}`
      );
    } else {
      setStatus(
        `நிலம் ${state.selectedPlot + 1} தேர்ந்தெடுக்கப்பட்டது.`
      );
    }
  }
);

// ------------------------------------------------------
// 15. GAME STATS
// ------------------------------------------------------

function updateStats() {
  farmStats.innerHTML = `
    💰 விளையாட்டு நாணயங்கள்: ${state.coins}<br>
    🌱 நடவு செய்தவை: ${state.planted}<br>
    💧 நீர் ஊற்றியவை: ${state.watered}<br>
    🌾 அறுவடைகள்: ${state.harvests}<br>
    🟫 தேர்ந்தெடுக்கப்பட்ட நிலம்: ${state.selectedPlot + 1}
  `;
}

updateCropInfo();
updateStats();

// ------------------------------------------------------
// 16. CAMERA CONTROLS
// ------------------------------------------------------

let angle = 0;
let distance = 20;
let dragging = false;
let previousX = 0;
let previousY = 0;

renderer.domElement.style.touchAction = "none";

renderer.domElement.addEventListener(
  "pointerdown",
  (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;

    renderer.domElement.setPointerCapture(
      event.pointerId
    );
  }
);

renderer.domElement.addEventListener(
  "pointermove",
  (event) => {
    if (!dragging) return;

    angle +=
      (event.clientX - previousX) * 0.006;

    camera.position.y = THREE.MathUtils.clamp(
      camera.position.y +
      (previousY - event.clientY) * 0.025,
      5,
      25
    );

    previousX = event.clientX;
    previousY = event.clientY;
  }
);

renderer.domElement.addEventListener(
  "pointerup",
  () => {
    dragging = false;
  }
);

renderer.domElement.addEventListener(
  "pointercancel",
  () => {
    dragging = false;
  }
);

renderer.domElement.addEventListener(
  "wheel",
  (event) => {
    distance = THREE.MathUtils.clamp(
      distance + event.deltaY * 0.015,
      10,
      35
    );
  },
  { passive: true }
);

// ------------------------------------------------------
// 17. RESPONSIVE RENDERING
// ------------------------------------------------------

function resizeGame() {
  const width = gameRoot.clientWidth;
  const height = gameRoot.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

const resizeObserver = new ResizeObserver(
  resizeGame
);

resizeObserver.observe(gameRoot);

resizeGame();

// ------------------------------------------------------
// 18. ANIMATION LOOP
// ------------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  camera.position.x =
    Math.sin(angle) * distance;

  camera.position.z =
    Math.cos(angle) * distance;

  camera.lookAt(0, 0, 0);

  updateGrowth();

  renderer.render(scene, camera);
}

animate();

setStatus(
  "வணக்கம் விவசாயி! ஒரு நிலத்தைத் தேர்ந்தெடுத்து பயிரிடத் தொடங்குங்கள்."
);
