import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const CONFIG = {
  HER_NAME: "Alien",
  NICKNAME: "Alien",
  ANIME_MUSE: "Sanemi and Ace",
  TEASE_SECONDS: 65,
  MAX_BUTTON_DODGES: 14,
  YOUR_MESSAGE: [
    "This was only for you, Alien.",
    "Okay okay... I'll stop teasing you",
    "I just wanted to make you smile first...",
    "Because...",
    "you matter to me more than I say.",
    "I don't just like you...",
    "I genuinely care about you.",
    "You mean more to me than words can explain.",
    "I love you."
  ],
  LOVE_CHAPTERS: [
    "There are things I notice quietly...",
    "the way one thought of you can fix my whole mood.",
    "",
    "I love the parts of you you probably don't even think about.",
    "your reactions, your little moods, your softness, your chaos.",
    "",
    "If love had a map,",
    "mine would keep finding its way back to you.",
    "",
    "I don't want to be just another person in your day.",
    "I want to be the calm place your heart remembers.",
    "",
    "So if this website feels extra...",
    "it's because normal words felt too small for you."
  ],
  ANIME_LOVE_LINES: [
    "I know you are a die-hard anime lover.",
    "So I made this part feel like your own tiny episode.",
    "Sanemi has that storm kind of strength.",
    "Ace has that fire that refuses to disappear.",
    "And you, Alien...",
    "you somehow became both comfort and chaos to me.",
    "my soft place, my favorite trouble, my whole universe."
  ],
  REASSURANCE_LINES: [
    "If your mind ever gets loud,",
    "you don't have to explain every feeling perfectly.",
    "",
    "If you overthink, I'll slow down with you.",
    "If you feel insecure, I'll remind you gently.",
    "",
    "If something breaks inside you,",
    "I won't love you less for needing time.",
    "",
    "You are not too much, Alien.",
    "You are someone I want to understand."
  ],
  EXTRA_MESSAGE: "Every moment with you feels different... better.",
  EYES_REVEAL: [
    "To the right eyes, you are art.",
    "And I wrote this only for you.",
    "I love your eyes so much...",
    "people say they see the world with two eyes,",
    "but why does my whole world exist in yours?",
    "",
    "Maybe that's why I stare in my thoughts sometimes.",
    "Because your eyes don't just look beautiful...",
    "they make everything else disappear for a second.",
    "",
    "When I look at you, everything loud becomes quiet.",
    "Like the universe finally found the place it was trying to reach.",
    "Alien, your eyes are not just beautiful to me...",
    "they feel like home.",
    "",
    "And if one day you forget how special you are,",
    "come back here.",
    "I'll let this universe remind you again."
  ],
  MUSIC_URL: "./assets/shiddat-title-track.mp3",
  MUSIC_VOLUME: 0.28,
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
  gallery: document.querySelector("#photoGallery"),
  finalBtn: document.querySelector("#finalBtn"),
  voiceBtn: document.querySelector("#voiceBtn"),
  animeGate: document.querySelector("#animeGate"),
  gateLine: document.querySelector("#gateLine"),
  gateCount: document.querySelector("#gateCount"),
  gateProgress: document.querySelector("#gateProgress"),
  eyesPanel: document.querySelector("#eyesPanel"),
  eyesQuote: document.querySelector("#eyesQuote"),
  reassurancePanel: document.querySelector("#reassurancePanel"),
  reassuranceText: document.querySelector("#reassuranceText"),
  finalLine: document.querySelector("#finalLine")
};

let sceneMode = "tease";
let mouse = new THREE.Vector2();
let audioCtx;
let music;
let ambientGain;
let heartbeatTimer;
let finalBloom = 0;
let heartbeatPulse = 0;
let worldFrozen = false;

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
const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.46, 0.54, 0.18);
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
const animeAura = createAnimeAura();
const alienGuardian = createAlienGuardian();
const eyePortal = createEyePortal();
const nameCloud = createNameParticles(CONFIG.HER_NAME);
const burst = createBurst();
scene.add(nebula, stars, glitchShapes, heartField, animeAura, alienGuardian, heart, eyePortal, nameCloud, burst);

heart.visible = false;
heartField.visible = false;
animeAura.visible = false;
alienGuardian.visible = false;
eyePortal.visible = false;
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
      uOpacity: { value: 0 },
      uBeat: { value: 0 }
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      uniform float uOpacity;
      uniform float uBeat;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 p = position;
        p.z = mod(p.z + uTime * (2.0 + aSeed * 2.5), 170.0) - 135.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.0 + aSeed * 2.6 + uBeat * 3.2) * uOpacity * (70.0 / -mv.z);
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
  const count = isLowPower ? 14 : 28;
  for (let i = 0; i < count; i++) {
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

function createEyePortal() {
  const group = new THREE.Group();
  const irisMaterial = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;
      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= 1.55;
        float d = length(uv);
        float ring = smoothstep(0.52, 0.22, d);
        float pupil = 1.0 - smoothstep(0.06, 0.18, d);
        float rays = 0.5 + 0.5 * sin(atan(uv.y, uv.x) * 18.0 + uTime * 1.4);
        vec3 cyan = vec3(0.0, 0.96, 1.0);
        vec3 violet = vec3(0.42, 0.0, 1.0);
        vec3 pink = vec3(1.0, 0.35, 0.78);
        vec3 color = mix(violet, cyan, rays) * ring + pink * pow(ring, 2.0);
        color *= 1.0 - pupil * 0.72;
        float alpha = smoothstep(0.58, 0.50, d) * smoothstep(0.02, 0.13, d) * uOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `
  });
  const iris = new THREE.Mesh(new THREE.CircleGeometry(3.2, 96), irisMaterial);
  group.add(iris);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.35 + i * 0.24, 0.01 + i * 0.005, 8, 160), ringMaterial.clone());
    ring.rotation.z = i * 0.6;
    ring.userData.spin = (i % 2 ? -1 : 1) * (0.05 + i * 0.025);
    group.add(ring);
  }
  group.position.set(0, 0.25, -7.2);
  group.scale.setScalar(0.12);
  return group;
}

function createAnimeAura() {
  const group = new THREE.Group();
  const makeRibbon = (side, colorA, colorB) => {
    const geometry = new THREE.PlaneGeometry(1.35, 7.8, 1, 72);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
        uSide: { value: side }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSide;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float wave = sin(uv.y * 11.0 + uTime * (1.6 + abs(uSide) * 0.2));
          p.x += wave * 0.42 + sin(uv.y * 4.0 + uTime) * 0.18;
          p.z += cos(uv.y * 9.0 + uTime * 1.2) * 0.36;
          p.y += sin(uTime * 0.8 + uv.y * 6.0) * 0.12;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uOpacity;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        void main() {
          float edge = smoothstep(0.0, 0.36, vUv.x) * smoothstep(1.0, 0.64, vUv.x);
          float tail = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.16, vUv.y);
          vec3 color = mix(uColorA, uColorB, vUv.y);
          gl_FragColor = vec4(color, edge * tail * uOpacity * 0.48);
        }
      `
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(side * 3.2, 0.35, -6.2);
    mesh.rotation.z = side * -0.34;
    mesh.rotation.y = side * 0.36;
    mesh.userData.baseX = mesh.position.x;
    return mesh;
  };

  const wind = makeRibbon(-1, 0x00f5ff, 0xdafcff);
  const fire = makeRibbon(1, 0xff7a2f, 0xff73c7);
  group.add(wind, fire);

  const sigilMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const windRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.018, 8, 96), sigilMaterial.clone());
  const fireRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.018, 8, 96), sigilMaterial.clone());
  windRing.position.set(-3.2, -2.75, -6.1);
  fireRing.position.set(3.2, -2.75, -6.1);
  windRing.userData.spin = -0.55;
  fireRing.userData.spin = 0.55;
  group.add(windRing, fireRing);

  group.userData.wind = wind;
  group.userData.fire = fire;
  return group;
}

function createAlienGuardian() {
  const group = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({
    color: 0xf7d8ff,
    emissive: 0x6c2bff,
    emissiveIntensity: 0.25,
    roughness: 0.42
  });
  const suit = new THREE.MeshStandardMaterial({
    color: 0x20103f,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.18,
    roughness: 0.36
  });
  const glowCyan = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending });
  const glowFire = new THREE.MeshBasicMaterial({ color: 0xff7a2f, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.1, 8, 18), suit);
  body.position.y = -0.25;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 20), skin);
  head.position.y = 0.8;
  head.scale.set(1, 1.08, 0.92);
  group.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), new THREE.MeshBasicMaterial({ color: 0x7f00ff }));
  hair.position.y = 1.05;
  hair.rotation.x = -0.24;
  group.add(hair);

  const eyeGeo = new THREE.SphereGeometry(0.075, 16, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0df7ff });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.2, 0.82, 0.52);
  rightEye.position.set(0.2, 0.82, 0.52);
  group.add(leftEye, rightEye);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.5, 8), glowCyan);
  antenna.position.y = 1.48;
  antenna.rotation.z = -0.18;
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 8), glowFire);
  antennaTip.position.set(-0.06, 1.73, 0);
  group.add(antenna, antennaTip);

  const armGeo = new THREE.CapsuleGeometry(0.08, 0.7, 6, 12);
  const leftArm = new THREE.Mesh(armGeo, skin);
  const rightArm = new THREE.Mesh(armGeo, skin);
  leftArm.position.set(-0.65, -0.15, 0);
  rightArm.position.set(0.65, -0.15, 0);
  leftArm.rotation.z = 0.38;
  rightArm.rotation.z = -0.38;
  group.add(leftArm, rightArm);

  const windOrb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 12), glowCyan);
  const fireOrb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 12), glowFire);
  windOrb.userData.kind = "wind";
  fireOrb.userData.kind = "fire";
  group.add(windOrb, fireOrb);

  const windTrail = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.012, 8, 80), glowCyan.clone());
  const fireTrail = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.014, 8, 80), glowFire.clone());
  windTrail.rotation.x = Math.PI / 2;
  fireTrail.rotation.x = Math.PI / 2;
  group.add(windTrail, fireTrail);

  group.position.set(0, -0.25, -5.2);
  group.scale.setScalar(0.01);
  group.userData = { head, leftArm, rightArm, windOrb, fireOrb, windTrail, fireTrail, leftEye, rightEye };
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
    "Checking if you deserve the message...",
    "Suspiciously cute behavior found",
    "Nope. One more scan.",
    "System says: wait nicely",
    "Your patience level is buffering",
    "Personal message locked for dramatic effect",
    "Do not fight the button. The button is shy.",
    "Okay fine, last emotional security check..."
  ];
  const titles = [
    "Analyzing your personality...",
    "Checking patience level...",
    "Scanning dramatic reactions...",
    "Verifying smile probability...",
    "Auditing attitude...",
    "Unlocking something important..."
  ];
  let dodges = 0;
  let clickAttempts = 0;
  let unlocked = false;
  const duration = CONFIG.TEASE_SECONDS * 1000;

  const dodgeButton = (force = false) => {
    if (!force && dodges >= CONFIG.MAX_BUTTON_DODGES) return;
    dodges += 1;
    const x = THREE.MathUtils.randFloat(-96, 96);
    const y = THREE.MathUtils.randFloat(-34, 34);
    const rotate = THREE.MathUtils.randFloat(-3, 3);
    dom.continueBtn.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    dom.teaseStatus.textContent = lines[dodges % lines.length];
  };

  dom.continueBtn.addEventListener("mouseenter", () => {
    if (unlocked) return;
    dodgeButton();
  });

  dom.continueBtn.addEventListener("click", () => {
    if (unlocked) {
      startBlackout();
      return;
    }
    clickAttempts += 1;
    dodgeButton(true);
    dom.scanTitle.textContent = clickAttempts % 2 ? "Access denied, obviously." : "Nice try.";
    dom.scanLine.textContent = clickAttempts < 4 ? "The message is personal. Earn the suspense." : "Okay, okay... you are committed.";
  });

  let start = performance.now();
  let resetCount = 0;
  let lastSecond = -1;
  const tick = (now) => {
    if (sceneMode !== "tease") return;
    const elapsed = now - start;
    const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
    const second = Math.floor(elapsed / 1000);

    let percent = Math.min(99, Math.floor((elapsed / duration) * 100));
    const shouldReset = (percent >= 96 && resetCount < 2) || (percent >= 72 && resetCount < 1);
    if (shouldReset) {
      resetCount += 1;
      start = now - duration * (resetCount === 1 ? 0.22 : 0.54);
      dom.scanTitle.textContent = resetCount === 1 ? "Wait... are you impatient?" : "Oops. Rechecking feelings.";
      dom.scanLine.textContent = resetCount === 1 ? "Progress looked too confident." : "This is very serious nonsense.";
      dom.teaseStatus.textContent = resetCount === 1 ? "Progress reset because you looked ready" : "Calibrating emotions... again";
      percent = resetCount === 1 ? 22 : 54;
    }

    if (second !== lastSecond) {
      lastSecond = second;
      if (second % 9 === 0 && second > 0) dodgeButton();
      dom.scanTitle.textContent = titles[second % titles.length];
      dom.scanLine.textContent = `Personal message unlocks in ${remaining}s`;
    }

    if (elapsed >= duration) percent = 100;
    dom.progressBar.style.width = `${percent}%`;
    dom.progressText.textContent = `${percent}%`;
    if (second % 2 === 0) dom.teaseStatus.textContent = lines[Math.floor(now / 1450) % lines.length];
    if (percent >= 100) {
      unlocked = true;
      dom.scanTitle.textContent = "Fine. You passed.";
      dom.scanLine.textContent = "Opening the real message...";
      dom.teaseStatus.textContent = "Silence in 3... 2... 1...";
      dom.continueBtn.textContent = "Open it";
      dom.continueBtn.style.transform = "translate(0, 0)";
      setTimeout(startBlackout, 1300);
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
  ambientGain = gain;
  pad.type = "sine";
  pad.frequency.value = 164.81;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.012, audioCtx.currentTime + 3);
  pad.connect(gain).connect(audioCtx.destination);
  pad.start();

  if (CONFIG.MUSIC_URL) {
    music = new Audio(CONFIG.MUSIC_URL);
    music.loop = true;
    music.volume = CONFIG.MUSIC_VOLUME;
    music.play().catch(() => {});
  }
}

function playHeartbeat() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.value = 0.42;
  master.connect(audioCtx.destination);
  [0, 0.18].forEach((offset, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    osc.type = "sine";
    osc.frequency.setValueAtTime(index === 0 ? 54 : 47, now + offset);
    osc.frequency.exponentialRampToValueAtTime(index === 0 ? 32 : 29, now + offset + 0.18);
    filter.type = "lowpass";
    filter.frequency.value = 118;
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.26 : 0.16, now + offset + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.23);
    osc.connect(filter).connect(gain).connect(master);
    osc.start(now + offset);
    osc.stop(now + offset + 0.25);
  });
  heartbeatPulse = 1;
  finalBloom = Math.max(finalBloom, 0.46);
  stars.material.uniforms.uBeat.value = 1;
  if (nameCloud.visible) nameCloud.material.uniforms.uPulse.value = Math.max(nameCloud.material.uniforms.uPulse.value, 1.25);
}

async function revealLoveWorld() {
  dom.messagePanel.classList.remove("hidden");
  requestAnimationFrame(() => dom.messagePanel.classList.add("visible"));
  dom.nameGlow.textContent = `${CONFIG.HER_NAME} ❤️`;
  setupGallery();
  setupVoice();

  heart.visible = true;
  heartField.visible = true;

  await timeFreezeMoment();
  nameCloud.visible = true;
  animateUniform(nameCloud.material.uniforms.uProgress, 1, 5200, 350);
  playHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (sceneMode === "love") {
      playHeartbeat();
    }
  }, 1450);

  await typeLines([
    "Out of everything moving in this world...",
    "you're the one that makes mine stop.",
    "",
    "Okay okay... I'll stop teasing you ❤️",
    "I just wanted to make you smile first...",
    "",
    ...CONFIG.YOUR_MESSAGE,
    "",
    ...CONFIG.LOVE_CHAPTERS,
    "",
    ...CONFIG.ANIME_LOVE_LINES,
    "",
    CONFIG.EXTRA_MESSAGE
  ]);
  nameCloud.material.uniforms.uPulse.value = 1;
  dom.finalBtn.classList.remove("hidden");
  if (CONFIG.VOICE_URL) dom.voiceBtn.classList.remove("hidden");
}

async function timeFreezeMoment() {
  worldFrozen = true;
  dom.love.classList.add("frozen");
  dom.typewriter.textContent = "";
  dom.nameGlow.classList.remove("visible");
  const oldMusicVolume = music ? music.volume : 0;
  const oldAmbientVolume = ambientGain ? ambientGain.gain.value : 0;
  if (music) music.volume = 0;
  if (ambientGain) ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
  await wait(500);
  dom.nameGlow.classList.add("visible");
  await wait(1550);
  if (music) music.volume = oldMusicVolume;
  if (ambientGain) ambientGain.gain.linearRampToValueAtTime(oldAmbientVolume || 0.012, audioCtx.currentTime + 0.8);
  dom.love.classList.remove("frozen");
  worldFrozen = false;
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
  let visibleLines = 0;
  for (const line of lines) {
    if (line === "") {
      await wait(760);
      dom.typewriter.textContent = "";
      visibleLines = 0;
      continue;
    }
    if (visibleLines >= 2) {
      dom.typewriter.textContent = "";
      visibleLines = 0;
    }
    if (visibleLines > 0) dom.typewriter.textContent += "\n";
    await typeText(line);
    visibleLines += 1;
    await wait(line.length < 12 ? 620 : 960);
  }
}

async function runEyesReveal() {
  const lines = CONFIG.EYES_REVEAL;
  dom.eyesQuote.textContent = "";
  dom.eyesPanel.classList.remove("hidden");
  requestAnimationFrame(() => dom.eyesPanel.classList.add("visible"));
  let visibleLines = 0;
  for (const line of lines) {
    if (line === "") {
      await wait(700);
      dom.eyesQuote.textContent = "";
      visibleLines = 0;
      continue;
    }
    if (visibleLines >= 3) {
      await wait(700);
      dom.eyesQuote.textContent = "";
      visibleLines = 0;
    }
    if (visibleLines > 0) dom.eyesQuote.textContent += "\n";
    await typeTextTo(dom.eyesQuote, line);
    visibleLines += 1;
    await wait(line.length > 40 ? 1050 : 780);
  }
  await wait(900);
  dom.finalLine.classList.remove("hidden");
  requestAnimationFrame(() => dom.finalLine.classList.add("visible"));
}

async function runReassuranceReveal() {
  dom.reassuranceText.textContent = "";
  dom.reassurancePanel.classList.remove("hidden");
  requestAnimationFrame(() => dom.reassurancePanel.classList.add("visible"));
  let visibleLines = 0;
  for (const line of CONFIG.REASSURANCE_LINES) {
    if (line === "") {
      await wait(720);
      dom.reassuranceText.textContent = "";
      visibleLines = 0;
      continue;
    }
    if (visibleLines >= 2) {
      await wait(650);
      dom.reassuranceText.textContent = "";
      visibleLines = 0;
    }
    if (visibleLines > 0) dom.reassuranceText.textContent += "\n";
    await typeTextTo(dom.reassuranceText, line);
    visibleLines += 1;
    await wait(line.length > 42 ? 1100 : 820);
  }
  await wait(900);
  dom.reassurancePanel.classList.remove("visible");
  await wait(900);
  dom.reassurancePanel.classList.add("hidden");
}

function typeText(text) {
  return typeTextTo(dom.typewriter, text);
}

function typeTextTo(target, text) {
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      target.textContent += text[i] || "";
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
  burst.visible = true;
  burst.material.uniforms.uTime.value = 0;
  burst.material.uniforms.uActive.value = 1;
  finalBloom = 1.1;
  startAnimeGate();
});

function startAnimeGate() {
  const lines = [
    `Wait, ${CONFIG.NICKNAME}. Secret route detected.`,
    "You clicked genuinely love me way too confidently.",
    "Tiny anime AI is opening the forbidden feelings file.",
    "Die-hard anime lover mode: activated.",
    "Sanemi wind check: courage level unlocked.",
    "Ace fire check: warmth level dangerous.",
    "Combining wind + fire into one Alien-only reveal.",
    "Imagine counting to seven... slowly.",
    "7... 6... 5...",
    "4... 3...",
    "2...",
    "1.",
    "Okay. This next part is only for her eyes."
  ];
  dom.messagePanel.classList.add("hidden");
  animeAura.visible = true;
  alienGuardian.visible = true;
  finalBloom = Math.max(finalBloom, 0.7);
  dom.animeGate.classList.remove("hidden");
  requestAnimationFrame(() => dom.animeGate.classList.add("visible"));
  let start = performance.now();
  const duration = 12500;
  const tick = (now) => {
    const t = THREE.MathUtils.clamp((now - start) / duration, 0, 1);
    dom.gateProgress.style.width = `${Math.floor(t * 100)}%`;
    dom.gateLine.textContent = lines[Math.min(lines.length - 1, Math.floor(t * lines.length))];
    const secondsLeft = Math.max(0, Math.ceil((duration - (now - start)) / 1000));
    dom.gateCount.textContent = secondsLeft > 0 ? `Imagine counting... ${secondsLeft}` : "Opening the eye universe...";
    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }
    dom.animeGate.classList.remove("visible");
    setTimeout(() => {
      dom.animeGate.classList.add("hidden");
      eyePortal.visible = true;
      animeAura.userData.fadeAfterGate = true;
      camera.userData.zooming = true;
      finalBloom = 0.9;
      runReassuranceReveal().then(runEyesReveal);
    }, 720);
  };
  requestAnimationFrame(tick);
}

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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  if (!worldFrozen) {
    nebula.material.uniforms.uTime.value = elapsed;
    stars.material.uniforms.uTime.value = elapsed;
    nameCloud.material.uniforms.uTime.value = elapsed;
    eyePortal.children[0].material.uniforms.uTime.value = elapsed;
    animeAura.children.forEach((mesh) => {
      if (mesh.material.uniforms?.uTime) mesh.material.uniforms.uTime.value = elapsed;
    });
  }

  glitchShapes.children.forEach((mesh, index) => {
    const speed = mesh.userData.speed;
    if (!worldFrozen) {
      mesh.rotation.x += delta * speed * 0.9;
      mesh.rotation.y += delta * speed * 1.15;
      mesh.position.y = mesh.userData.origin.y + Math.sin(elapsed * speed + index) * 0.28;
    }
    mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, sceneMode === "tease" ? mesh.material.opacity : 0, 0.045);
  });

  if (sceneMode === "love") {
    stars.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(stars.material.uniforms.uOpacity.value, 1, 0.018);
    nebula.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(nebula.material.uniforms.uOpacity.value, 1, 0.014);
    const breath = 1 + Math.sin(elapsed * 4.35) * 0.024 + heartbeatPulse * 0.12 + Math.max(0, finalBloom) * 0.018;
    heart.scale.setScalar(THREE.MathUtils.lerp(heart.scale.x, 1.28 * breath, 0.045));
    if (!worldFrozen) {
      heart.rotation.y = Math.sin(elapsed * 0.42) * 0.32;
      heart.rotation.x = Math.sin(elapsed * 0.31) * 0.11;
    }
    heart.material.emissiveIntensity = 1.65 + heartbeatPulse * 1.7 + Math.max(0, finalBloom) * 1.05 + Math.sin(elapsed * 4.35) * 0.12;
    heartField.children.forEach((mesh) => {
      const seed = mesh.userData.seed;
      if (!worldFrozen) {
        mesh.position.y += delta * (0.08 + (seed % 5) * 0.012);
        if (mesh.position.y > 6) mesh.position.y = -5.2;
        mesh.rotation.z += delta * 0.08;
      }
      mesh.material.opacity = 0.18 + Math.sin(elapsed * 0.8 + seed) * 0.08;
    });
    if (eyePortal.visible) {
      eyePortal.scale.setScalar(THREE.MathUtils.lerp(eyePortal.scale.x, 1, 0.035));
      eyePortal.children[0].material.uniforms.uOpacity.value = THREE.MathUtils.lerp(eyePortal.children[0].material.uniforms.uOpacity.value, 0.86, 0.035);
      eyePortal.children.slice(1).forEach((ring) => {
        ring.rotation.z += delta * ring.userData.spin;
        ring.material.opacity = THREE.MathUtils.lerp(ring.material.opacity, 0.28, 0.03);
      });
    }
    if (animeAura.visible) {
      const targetOpacity = animeAura.userData.fadeAfterGate ? 0.18 : 0.9;
      animeAura.children.forEach((mesh, index) => {
        mesh.rotation.z += delta * (mesh.userData.spin || (index === 0 ? -0.035 : 0.035));
        if (mesh.material.uniforms?.uOpacity) {
          mesh.material.uniforms.uOpacity.value = THREE.MathUtils.lerp(mesh.material.uniforms.uOpacity.value, targetOpacity, 0.035);
        } else {
          mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, targetOpacity * 0.22, 0.035);
        }
      });
    }
    if (alienGuardian.visible) {
      const gateFade = animeAura.userData.fadeAfterGate ? 0.72 : 1;
      alienGuardian.scale.setScalar(THREE.MathUtils.lerp(alienGuardian.scale.x, 1.05 * gateFade, 0.04));
      alienGuardian.position.y = -0.25 + Math.sin(elapsed * 2.2) * 0.16;
      alienGuardian.rotation.y = Math.sin(elapsed * 0.8) * 0.22 + mouse.x * 0.1;
      alienGuardian.userData.head.rotation.x = Math.sin(elapsed * 1.7) * 0.06;
      alienGuardian.userData.leftArm.rotation.z = 0.5 + Math.sin(elapsed * 2.7) * 0.24;
      alienGuardian.userData.rightArm.rotation.z = -0.5 + Math.cos(elapsed * 2.9) * 0.24;
      alienGuardian.userData.windOrb.position.set(Math.cos(elapsed * 2.2) * 1.05, 0.1 + Math.sin(elapsed * 2.2) * 0.34, Math.sin(elapsed * 2.2) * 0.55);
      alienGuardian.userData.fireOrb.position.set(Math.cos(-elapsed * 2.0) * 1.2, -0.05 + Math.sin(-elapsed * 2.0) * 0.3, Math.sin(-elapsed * 2.0) * 0.55);
      alienGuardian.userData.windTrail.rotation.z -= delta * 1.2;
      alienGuardian.userData.fireTrail.rotation.z += delta * 1.45;
      const blink = Math.sin(elapsed * 5.1) > 0.96 ? 0.18 : 1;
      alienGuardian.userData.leftEye.scale.y = THREE.MathUtils.lerp(alienGuardian.userData.leftEye.scale.y, blink, 0.35);
      alienGuardian.userData.rightEye.scale.y = THREE.MathUtils.lerp(alienGuardian.userData.rightEye.scale.y, blink, 0.35);
    }
  }

  const driftZ = sceneMode === "love" ? -Math.min(4, elapsed * 0.035) : 0;
  if (!worldFrozen) {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.7, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.1 + -mouse.y * 0.35, 0.025);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camera.userData.zooming ? 13.2 : 18 + driftZ, 0.012);
    camera.lookAt(mouse.x * 0.55, -0.05 - mouse.y * 0.18, -8);
  }

  if (burst.visible) {
    burst.material.uniforms.uTime.value += delta * 0.46;
    if (burst.material.uniforms.uTime.value > 1.25) {
      burst.material.uniforms.uActive.value = 0;
    }
  }

  finalBloom = Math.max(0, finalBloom - delta * 1.4);
  heartbeatPulse = Math.max(0, heartbeatPulse - delta * 3.2);
  stars.material.uniforms.uBeat.value = THREE.MathUtils.lerp(stars.material.uniforms.uBeat.value, 0, 0.08);
  bloomPass.strength = 0.46 + finalBloom;
  nameCloud.material.uniforms.uPulse.value = THREE.MathUtils.lerp(nameCloud.material.uniforms.uPulse.value, 0, 0.035);
  composer.render();
  requestAnimationFrame(animate);
}

runTease();
animate();
