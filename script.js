import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const CONFIG = {
  HER_NAME: "Her Name",
  MEETING_DATE: "2024-01-01T00:00:00",
  YOUR_MESSAGE: [
    "Okay okay... I'll stop teasing you",
    "I just wanted to make you smile first...",
    "Because...",
    "you matter to me more than I say.",
    "I don't just like you...",
    "I genuinely care about you.",
    "You mean more to me than words can explain.",
    "I love you."
  ],
  EXTRA_MESSAGE: "Every moment with you feels different... better.",
  MUSIC_URL: "",
  VOICE_URL: "",
  PHOTO_URLS: []
};

const isLowPower = matchMedia("(max-width: 720px), (prefers-reduced-motion: reduce)").matches;
const QUALITY = {
  stars: isLowPower ? 3200 : 7600,
  nameParticles: isLowPower ? 1200 : 2600,
  pixelRatio: Math.min(devicePixelRatio, isLowPower ? 1.35 : 1.85)
};

const dom = {
  canvas: document.querySelector("#webgl"),
  tease: document.querySelector("#tease"),
  love: document.querySelector("#love"),
  blackout: document.querySelector("#blackout"),
  progressBar: document.querySelector("#progressBar"),
  progressText: document.querySelector("#progressText"),
  teaseStatus: document.querySelector("#teaseStatus"),
  scanTitle: document.querySelector("#scanTitle"),
  scanLine: document.querySelector("#scanLine"),
  continueBtn: document.querySelector("#continueBtn"),
  messagePanel: document.querySelector("#messagePanel"),
  typewriter: document.querySelector("#typewriter"),
  nameGlow: document.querySelector("#nameGlow"),
  countup: document.querySelector("#countup"),
  gallery: document.querySelector("#photoGallery"),
  finalBtn: document.querySelector("#finalBtn"),
  voiceBtn: document.querySelector("#voiceBtn"),
  finalLine: document.querySelector("#finalLine")
};

let sceneMode = "tease";
let mouse = new THREE.Vector2();
let audioCtx;
let music;
let heartbeatTimer;
let finalBloom = 0;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080617, 0.018);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 260);
camera.position.set(0, 1.1, 18);

const renderer = new THREE.WebGLRenderer({
  canvas: dom.canvas,
  antialias: !isLowPower,
  alpha: false,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(QUALITY.pixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const composer = new EffectComposer(renderer);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.75, 0.62, 0.12);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);
composer.addPass(new FilmPass(0.16, false));
composer.addPass(new OutputPass());

const clock = new THREE.Clock();

const nebula = createNebula();
const stars = createStars();
const glitchShapes = createGlitchShapes();
const heart = createHeart();
const heartField = createHeartField();
const nameCloud = createNameParticles(CONFIG.HER_NAME);
const burst = createBurst();
scene.add(nebula, stars, glitchShapes, heartField, heart, nameCloud, burst);

heart.visible = false;
heartField.visible = false;
nameCloud.visible = false;
burst.visible = false;

const ambient = new THREE.AmbientLight(0x8fb7ff, 0.26);
const point = new THREE.PointLight(0xff73c7, 3.2, 60);
point.position.set(0, 0, 8);
scene.add(ambient, point);

function createNebula() {
  const geometry = new THREE.PlaneGeometry(220, 130, 1, 1);
  const material = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy / 110.0, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.52;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.05;
          a *= 0.48;
        }
        return v;
      }
      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= 1.8;
        float cloud = fbm(uv * 3.0 + vec2(uTime * 0.018, -uTime * 0.012));
        float core = smoothstep(0.78, 0.12, length(uv + vec2(0.05, -0.03)));
        vec3 deep = vec3(0.02, 0.02, 0.035);
        vec3 violet = vec3(0.30, 0.0, 0.72);
        vec3 cyan = vec3(0.0, 0.88, 1.0);
        vec3 pink = vec3(1.0, 0.32, 0.76);
        vec3 color = deep + violet * cloud * 0.42 + cyan * pow(core, 2.2) * 0.22 + pink * pow(cloud * core, 1.6) * 0.36;
        float vignette = smoothstep(1.05, 0.22, length(uv));
        gl_FragColor = vec4(color, uOpacity * vignette * (0.48 + cloud * 0.45));
      }
    `,
    transparent: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -10;
  return mesh;
}

function createStars() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(QUALITY.stars * 3);
  const seeds = new Float32Array(QUALITY.stars);
  for (let i = 0; i < QUALITY.stars; i++) {
    const r = 24 + Math.random() * 98;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72;
    positions[i * 3 + 2] = -Math.random() * 165 + 28;
    seeds[i] = Math.random();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      uniform float uOpacity;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 p = position;
        p.z = mod(p.z + uTime * (2.0 + aSeed * 2.5), 170.0) - 135.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.0 + aSeed * 2.6) * uOpacity * (70.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying float vSeed;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float glow = smoothstep(0.5, 0.0, d);
        vec3 color = mix(vec3(0.75, 0.96, 1.0), vec3(1.0, 0.48, 0.82), vSeed);
        gl_FragColor = vec4(color, glow * glow);
      }
    `
  });
  return new THREE.Points(geometry, material);
}

function createGlitchShapes() {
  const group = new THREE.Group();
  const cube = new THREE.BoxGeometry(0.9, 0.9, 0.9);
  const knot = new THREE.TorusKnotGeometry(0.42, 0.12, 54, 8);
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.44 }),
    new THREE.MeshBasicMaterial({ color: 0x7f00ff, wireframe: true, transparent: true, opacity: 0.38 }),
    new THREE.MeshBasicMaterial({ color: 0xff73c7, wireframe: true, transparent: true, opacity: 0.34 })
  ];
  for (let i = 0; i < 16; i++) {
    const mesh = new THREE.Mesh(i % 3 === 0 ? knot : cube, materials[i % materials.length]);
    mesh.position.set(THREE.MathUtils.randFloatSpread(18), THREE.MathUtils.randFloatSpread(10), THREE.MathUtils.randFloat(-18, -5));
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData.speed = THREE.MathUtils.randFloat(0.45, 1.25);
    mesh.userData.origin = mesh.position.clone();
    group.add(mesh);
  }
  return group;
}

function createNameParticles(text) {
  const points = sampleText(text, QUALITY.nameParticles);
  const count = points.length;
  const starts = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 16 + Math.random() * 38;
    starts[i * 3] = Math.cos(angle) * radius;
    starts[i * 3 + 1] = Math.sin(angle) * radius * 0.48 + THREE.MathUtils.randFloatSpread(10);
    starts[i * 3 + 2] = THREE.MathUtils.randFloat(-26, -7);
    targets[i * 3] = points[i].x;
    targets[i * 3 + 1] = points[i].y + 2.3;
    targets[i * 3 + 2] = -8 + THREE.MathUtils.randFloatSpread(0.18);
    seeds[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(starts, 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPulse: { value: 0 }
    },
    vertexShader: `
      attribute vec3 aTarget;
      attribute float aSeed;
      uniform float uTime;
      uniform float uProgress;
      uniform float uPulse;
      varying float vSeed;
      float easeOutCubic(float x){ return 1.0 - pow(1.0 - x, 3.0); }
      void main() {
        vSeed = aSeed;
        float stagger = clamp((uProgress - aSeed * 0.28) / 0.72, 0.0, 1.0);
        float eased = easeOutCubic(stagger);
        vec3 p = mix(position, aTarget, eased);
        p.x += sin(uTime * 1.5 + aSeed * 9.0) * (1.0 - eased) * 0.7;
        p.y += cos(uTime * 1.2 + aSeed * 7.0) * (1.0 - eased) * 0.45;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (2.2 + uPulse * 2.6 + aSeed * 1.6) * (75.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uPulse;
      varying float vSeed;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float glow = smoothstep(0.5, 0.0, length(uv));
        vec3 color = mix(vec3(0.1, 0.95, 1.0), vec3(1.0, 0.46, 0.82), vSeed);
        gl_FragColor = vec4(color, glow * (0.75 + uPulse));
      }
    `
  });
  return new THREE.Points(geometry, material);
}

function sampleText(text, maxPoints) {
  const canvas = document.createElement("canvas");
  const size = 640;
  canvas.width = size;
  canvas.height = 220;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "800 116px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, size / 2, 112);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const candidates = [];
  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      if (data[(y * canvas.width + x) * 4] > 80) {
        candidates.push({ x: (x - size / 2) / 34, y: -(y - 112) / 34 });
      }
    }
  }
  candidates.sort(() => Math.random() - 0.5);
  return candidates.slice(0, Math.min(maxPoints, candidates.length));
}

function createHeart() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.8);
  shape.bezierCurveTo(0, 1.45, -1.2, 1.45, -1.2, 0.55);
  shape.bezierCurveTo(-1.2, -0.18, -0.42, -0.72, 0, -1.2);
  shape.bezierCurveTo(0.42, -0.72, 1.2, -0.18, 1.2, 0.55);
  shape.bezierCurveTo(1.2, 1.45, 0, 1.45, 0, 0.8);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.52,
    bevelEnabled: true,
    bevelSize: 0.16,
    bevelThickness: 0.12,
    bevelSegments: 12
  });
  geometry.center();
  const material = new THREE.MeshStandardMaterial({
    color: 0xff73c7,
    emissive: 0xff2ea6,
    emissiveIntensity: 1.8,
    roughness: 0.28,
    metalness: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, -0.55, -5.5);
  mesh.scale.setScalar(0.01);
  return mesh;
}

function createHeartField() {
  const group = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0, 0.95, -0.75, 0.95, -0.75, 0.3);
  shape.bezierCurveTo(-0.75, -0.15, -0.25, -0.45, 0, -0.76);
  shape.bezierCurveTo(0.25, -0.45, 0.75, -0.15, 0.75, 0.3);
  shape.bezierCurveTo(0.75, 0.95, 0, 0.95, 0, 0.5);
  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff73c7,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  for (let i = 0; i < (isLowPower ? 10 : 18); i++) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set(THREE.MathUtils.randFloatSpread(19), THREE.MathUtils.randFloat(-4.7, 5.2), THREE.MathUtils.randFloat(-24, -8));
    mesh.scale.setScalar(THREE.MathUtils.randFloat(0.16, 0.48));
    mesh.rotation.z = THREE.MathUtils.randFloatSpread(0.8);
    mesh.userData.seed = Math.random() * 100;
    group.add(mesh);
  }
  return group;
}

function createBurst() {
  const count = isLowPower ? 1100 : 2400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const directions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const dir = new THREE.Vector3(THREE.MathUtils.randFloatSpread(2), THREE.MathUtils.randFloatSpread(2), THREE.MathUtils.randFloatSpread(1)).normalize();
    positions.set([0, -0.35, -5.2], i * 3);
    directions.set([dir.x, dir.y, dir.z], i * 3);
    seeds[i] = Math.random();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aDirection", new THREE.BufferAttribute(directions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uActive: { value: 0 }
    },
    vertexShader: `
      attribute vec3 aDirection;
      attribute float aSeed;
      uniform float uTime;
      uniform float uActive;
      varying float vAlpha;
      void main() {
        float life = clamp(uTime - aSeed * 0.18, 0.0, 1.0);
        vec3 p = position + aDirection * life * (5.0 + aSeed * 8.0);
        p.z -= life * 2.0;
        vAlpha = uActive * (1.0 - life);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (2.0 + aSeed * 5.0) * vAlpha * (72.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float glow = smoothstep(0.5, 0.0, length(uv));
        gl_FragColor = vec4(vec3(1.0, 0.55, 0.86), glow * vAlpha);
      }
    `
  });
  return new THREE.Points(geometry, material);
}

function runTease() {
  const lines = [
    "Still loading your patience...",
    "Almost done... maybe",
    "You're still here?",
    "Impatient detected",
    "Okay fine, last check..."
  ];
  let dodges = 0;
  dom.continueBtn.addEventListener("mouseenter", () => {
    if (dodges >= 3) return;
    dodges += 1;
    dom.continueBtn.style.transform = `translate(${18 * dodges}px, ${dodges % 2 ? -7 : 8}px)`;
    dom.teaseStatus.textContent = lines[Math.min(dodges + 1, lines.length - 1)];
  });
  dom.continueBtn.addEventListener("click", () => {
    if (dodges < 2) {
      dodges += 1;
      dom.continueBtn.style.transform = `translate(${24 * dodges}px, ${dodges % 2 ? 8 : -8}px)`;
      dom.teaseStatus.textContent = "Just 2 more seconds...";
      return;
    }
    startBlackout();
  });

  let resetDone = false;
  let start = performance.now();
  const tick = (now) => {
    if (sceneMode !== "tease") return;
    let elapsed = now - start;
    let percent = Math.min(99, Math.floor(elapsed / 70));
    if (percent >= 95 && !resetDone) {
      resetDone = true;
      dom.scanTitle.textContent = "Wait... are you impatient?";
      dom.scanLine.textContent = "Calibrating emotions...";
      dom.teaseStatus.textContent = "Impatient detected";
      percent = 28;
      start = now - percent * 70;
    }
    if (elapsed > 11200) percent = 100;
    dom.progressBar.style.width = `${percent}%`;
    dom.progressText.textContent = `${percent}%`;
    dom.teaseStatus.textContent = lines[Math.floor(now / 1700) % lines.length];
    if (percent >= 100) {
      startBlackout();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function startBlackout() {
  if (sceneMode !== "tease") return;
  sceneMode = "blackout";
  dom.tease.classList.remove("active");
  dom.blackout.classList.add("active");
  stopAllMotionMomentarily();
  setTimeout(() => {
    beginAudio();
    dom.blackout.classList.remove("active");
    dom.love.classList.add("active");
    sceneMode = "love";
    revealLoveWorld();
  }, 1100);
}

function stopAllMotionMomentarily() {
  stars.material.uniforms.uOpacity.value = 0;
  nebula.material.uniforms.uOpacity.value = 0;
}

async function beginAudio() {
  audioCtx = audioCtx || new AudioContext();
  const pad = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  pad.type = "sine";
  pad.frequency.value = 164.81;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.035, audioCtx.currentTime + 3);
  pad.connect(gain).connect(audioCtx.destination);
  pad.start();

  if (CONFIG.MUSIC_URL) {
    music = new Audio(CONFIG.MUSIC_URL);
    music.loop = true;
    music.volume = 0.16;
    music.play().catch(() => {});
  }
}

function playHeartbeat() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(58, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.09, audioCtx.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.24);
}

function revealLoveWorld() {
  dom.messagePanel.classList.remove("hidden");
  requestAnimationFrame(() => dom.messagePanel.classList.add("visible"));
  dom.nameGlow.textContent = `${CONFIG.HER_NAME} ❤️`;
  setupGallery();
  setupVoice();
  typeLines([
    "Okay okay... I'll stop teasing you ❤️",
    "I just wanted to make you smile first...",
    "",
    ...CONFIG.YOUR_MESSAGE,
    CONFIG.EXTRA_MESSAGE
  ]);

  nameCloud.visible = true;
  heart.visible = true;
  heartField.visible = true;

  animateUniform(nameCloud.material.uniforms.uProgress, 1, 5200, 2100);
  setTimeout(() => {
    nameCloud.material.uniforms.uPulse.value = 1;
    dom.nameGlow.classList.add("visible");
  }, 7600);
  setTimeout(() => {
    dom.finalBtn.classList.remove("hidden");
    if (CONFIG.VOICE_URL) dom.voiceBtn.classList.remove("hidden");
  }, 14500);

  heartbeatTimer = setInterval(() => {
    if (sceneMode === "love") {
      finalBloom = Math.max(finalBloom, 0.55);
      playHeartbeat();
    }
  }, 1450);
}

function setupGallery() {
  CONFIG.PHOTO_URLS.slice(0, 5).forEach((url, index) => {
    const img = document.createElement("img");
    img.className = "memory-card";
    img.src = url;
    img.alt = "Memory";
    img.style.setProperty("--tilt", `${(index - 2) * 4}deg`);
    dom.gallery.appendChild(img);
    setTimeout(() => img.classList.add("visible"), 10000 + index * 700);
  });
}

function setupVoice() {
  if (!CONFIG.VOICE_URL) return;
  const voice = new Audio(CONFIG.VOICE_URL);
  voice.volume = 0.9;
  dom.voiceBtn.addEventListener("click", () => voice.play().catch(() => {}));
}

async function typeLines(lines) {
  dom.typewriter.textContent = "";
  for (const line of lines) {
    if (line === "") {
      await wait(760);
      continue;
    }
    await typeText(`${line}\n`);
    await wait(line.length < 12 ? 620 : 960);
  }
}

function typeText(text) {
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      dom.typewriter.textContent += text[i] || "";
      i += 1;
      if (i < text.length) setTimeout(tick, text[i - 1] === "." ? 92 : 46);
      else resolve();
    };
    tick();
  });
}

function animateUniform(uniform, target, duration, delay = 0) {
  const from = uniform.value;
  const started = performance.now() + delay;
  const step = (now) => {
    const t = THREE.MathUtils.clamp((now - started) / duration, 0, 1);
    uniform.value = THREE.MathUtils.lerp(from, target, 1 - Math.pow(1 - t, 3));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

dom.finalBtn.addEventListener("click", () => {
  dom.finalBtn.classList.add("hidden");
  dom.voiceBtn.classList.add("hidden");
  dom.finalLine.classList.remove("hidden");
  requestAnimationFrame(() => dom.finalLine.classList.add("visible"));
  burst.visible = true;
  burst.material.uniforms.uTime.value = 0;
  burst.material.uniforms.uActive.value = 1;
  finalBloom = 2.2;
  camera.userData.zooming = true;
});

addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / innerWidth - 0.5) * 2;
  mouse.y = (event.clientY / innerHeight - 0.5) * 2;
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  nebula.material.uniforms.uResolution.value.set(innerWidth, innerHeight);
});

function updateCountup() {
  const from = new Date(CONFIG.MEETING_DATE).getTime();
  if (!Number.isFinite(from)) return;
  const diff = Math.max(0, Date.now() - from);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  dom.countup.textContent = `${days.toLocaleString()} days and ${hours} hours since this story began`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  nebula.material.uniforms.uTime.value = elapsed;
  stars.material.uniforms.uTime.value = elapsed;
  nameCloud.material.uniforms.uTime.value = elapsed;

  glitchShapes.children.forEach((mesh, index) => {
    const speed = mesh.userData.speed;
    mesh.rotation.x += delta * speed * 0.9;
    mesh.rotation.y += delta * speed * 1.15;
    mesh.position.y = mesh.userData.origin.y + Math.sin(elapsed * speed + index) * 0.28;
    mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, sceneMode === "tease" ? mesh.material.opacity : 0, 0.045);
  });

  if (sceneMode === "love") {
    stars.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(stars.material.uniforms.uOpacity.value, 1, 0.018);
    nebula.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(nebula.material.uniforms.uOpacity.value, 1, 0.014);
    const breath = 1 + Math.sin(elapsed * 4.35) * 0.035 + Math.max(0, finalBloom) * 0.025;
    heart.scale.setScalar(THREE.MathUtils.lerp(heart.scale.x, 1.28 * breath, 0.045));
    heart.rotation.y = Math.sin(elapsed * 0.42) * 0.32;
    heart.rotation.x = Math.sin(elapsed * 0.31) * 0.11;
    heart.material.emissiveIntensity = 1.65 + Math.max(0, finalBloom) * 1.2 + Math.sin(elapsed * 4.35) * 0.18;
    heartField.children.forEach((mesh) => {
      const seed = mesh.userData.seed;
      mesh.position.y += delta * (0.08 + (seed % 5) * 0.012);
      if (mesh.position.y > 6) mesh.position.y = -5.2;
      mesh.rotation.z += delta * 0.08;
      mesh.material.opacity = 0.18 + Math.sin(elapsed * 0.8 + seed) * 0.08;
    });
  }

  const driftZ = sceneMode === "love" ? -Math.min(4, elapsed * 0.035) : 0;
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.7, 0.025);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.1 + -mouse.y * 0.35, 0.025);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, camera.userData.zooming ? 13.2 : 18 + driftZ, 0.012);
  camera.lookAt(mouse.x * 0.55, -0.05 - mouse.y * 0.18, -8);

  if (burst.visible) {
    burst.material.uniforms.uTime.value += delta * 0.46;
    if (burst.material.uniforms.uTime.value > 1.25) {
      burst.material.uniforms.uActive.value = 0;
    }
  }

  finalBloom = Math.max(0, finalBloom - delta * 1.4);
  bloomPass.strength = 0.75 + finalBloom;
  nameCloud.material.uniforms.uPulse.value = THREE.MathUtils.lerp(nameCloud.material.uniforms.uPulse.value, 0, 0.035);
  updateCountup();
  composer.render();
  requestAnimationFrame(animate);
}

runTease();
animate();
