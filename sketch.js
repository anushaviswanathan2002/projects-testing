/* ============================================================
   AETHERISM  —  galaxies remembered from a single number
   ------------------------------------------------------------
   An algorithmic art movement.

   Every cosmos is derived deterministically from one seed:
   the same seed always regrows the same galaxy. Structure is
   sculpted from Perlin noise fields; light is accreted by a
   particle system that never draws — only grows.
   ============================================================ */

// ---- global state ------------------------------------------------------
let seed;                 // the number that is a universe
let stars = [];           // the accreting particle system
let dust = [];            // slow background dust motes
let palette;              // seeded colour identity of this cosmos
let galaxy;               // structural parameters (arms, twist, size)

let camX = 0, camY = 0;   // drag offset ("shift the void")
let dragging = false;
let lastMX, lastMY;
let breath = 1;           // scroll zoom ("breathe")

let bgLayer;              // static starfield + core glow, drawn once

const STAR_COUNT = 2600;
const DUST_COUNT = 260;

// -----------------------------------------------------------------------
function setup() {
  const holder = document.getElementById("canvas-holder");
  const c = createCanvas(windowWidth, windowHeight);
  c.parent(holder);
  colorMode(HSB, 360, 100, 100, 1);

  // seed from URL (?seed=...) if present, else random
  const urlSeed = new URLSearchParams(location.search).get("seed");
  bornAsUniverse(urlSeed !== null ? parseInt(urlSeed, 10) : newSeed());

  wireControls();
}

// ---- create a fresh universe from a seed -------------------------------
function newSeed() {
  return Math.floor(Math.random() * 1_000_000);
}

function bornAsUniverse(s) {
  seed = (Number.isFinite(s) ? s : newSeed()) >>> 0;

  // seed BOTH random streams so everything is reproducible
  randomSeed(seed);
  noiseSeed(seed);

  palette = derivePalette();
  galaxy = deriveStructure();
  buildParticles();
  paintBackdrop();

  document.getElementById("seed-value").textContent = seed;
  const url = new URL(location.href);
  url.searchParams.set("seed", seed);
  history.replaceState(null, "", url);
}

// ---- seeded colour identity -------------------------------------------
function derivePalette() {
  const baseHue = random(360);
  const spread = random(20, 70);
  return {
    base: baseHue,
    // two accent hues drawn from the seed, kept near the base for harmony
    warm: (baseHue + random(-spread, spread) + 360) % 360,
    cool: (baseHue + 180 + random(-spread, spread) + 360) % 360,
    coreHue: (baseHue + random(-15, 15) + 360) % 360,
  };
}

// ---- seeded galaxy morphology -----------------------------------------
function deriveStructure() {
  return {
    arms: floor(random(2, 6)),          // number of spiral arms
    twist: random(3.5, 8.0),            // how tightly arms wind
    radius: min(width, height) * random(0.32, 0.42),
    thickness: random(0.05, 0.14),      // arm scatter
    coreSize: random(0.10, 0.20),       // bright bulge fraction
    swirl: random(0.0006, 0.0018),      // rotation speed
    noiseScale: random(0.0018, 0.004),  // turbulence field zoom
    flowStrength: random(18, 42),       // how hard noise bends orbits
    ellipticity: random(0.55, 1.0),     // 1 = round, <1 = flattened disk
  };
}

// ---- build the particle system ----------------------------------------
function buildParticles() {
  stars = [];
  dust = [];

  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < STAR_COUNT; i++) {
    // choose an arm, then a radius biased toward the core
    const arm = floor(random(galaxy.arms));
    const t = pow(random(), 0.65);          // radial distribution
    const r = t * galaxy.radius;

    // logarithmic-spiral base angle for this arm
    const armAngle = (TWO_PI / galaxy.arms) * arm;
    const spiral = armAngle + t * galaxy.twist;

    // scatter widens gently toward the rim
    const scatter = random(-1, 1) * galaxy.thickness * (0.4 + t) * galaxy.radius;
    const perp = spiral + HALF_PI;

    let x = cx + cos(spiral) * r + cos(perp) * scatter;
    let y = cy + sin(spiral) * r + sin(perp) * scatter * galaxy.ellipticity;

    // colour: hot bright core → cool dim rim, blended between accents
    const hue = lerpHue(palette.coreHue, lerp(palette.warm, palette.cool, t), t);
    const sat = lerp(35, 85, t) + random(-8, 8);
    const bri = lerp(100, 55, t) + random(-10, 12);

    stars.push({
      x, y,
      home: { x, y },
      angle: atan2(y - cy, x - cx),
      radius: r,
      hue,
      sat: constrain(sat, 0, 100),
      bri: constrain(bri, 0, 100),
      size: random(0.6, 2.4) * (1.3 - t * 0.6),
      twinkle: random(TWO_PI),
      twinkleSpeed: random(0.01, 0.05),
    });
  }

  // slow, large background dust
  for (let i = 0; i < DUST_COUNT; i++) {
    dust.push({
      x: random(width),
      y: random(height),
      r: random(40, 160),
      hue: random() < 0.5 ? palette.warm : palette.cool,
      a: random(0.008, 0.03),
      drift: random(0.05, 0.25),
      ph: random(TWO_PI),
    });
  }
}

// ---- static backdrop: deep-field stars + core glow ---------------------
function paintBackdrop() {
  bgLayer = createGraphics(width, height);
  bgLayer.colorMode(HSB, 360, 100, 100, 1);
  bgLayer.noStroke();

  // vignette-ish deep space
  bgLayer.background(palette.base, 40, 6);

  // distant field stars (also seeded — part of THIS cosmos)
  for (let i = 0; i < 900; i++) {
    const x = random(width);
    const y = random(height);
    const b = random(30, 100);
    const s = random(0.4, 1.6);
    bgLayer.fill(random(360), random(0, 25), b, random(0.3, 0.9));
    bgLayer.circle(x, y, s);
  }
}

// ---- main loop: accrete light ------------------------------------------
function draw() {
  // gentle trailing fade → light builds up over time (accretion)
  push();
  colorMode(RGB, 255, 255, 255, 255);
  fill(5, 4, 13, 26);
  noStroke();
  rect(0, 0, width, height);
  pop();

  // backdrop, panned + zoomed with the "void"
  push();
  translate(width / 2 + camX, height / 2 + camY);
  scale(breath);
  translate(-width / 2, -height / 2);
  image(bgLayer, 0, 0);
  pop();

  push();
  translate(width / 2 + camX, height / 2 + camY);
  scale(breath);
  translate(-width / 2, -height / 2);

  drawDust();
  drawCoreGlow();
  drawStars();

  pop();
}

function drawDust() {
  noStroke();
  for (const d of dust) {
    d.ph += 0.002 * d.drift;
    const x = d.x + cos(d.ph) * 20;
    const y = d.y + sin(d.ph * 1.3) * 20;
    fill(d.hue, 60, 40, d.a);
    circle(x, y, d.r);
  }
}

function drawCoreGlow() {
  const cx = width / 2;
  const cy = height / 2;
  const cr = galaxy.radius * galaxy.coreSize;
  noStroke();
  for (let i = 6; i > 0; i--) {
    const rad = cr * i * 0.9;
    fill(palette.coreHue, 40, 100, 0.05);
    circle(cx, cy, rad);
  }
  fill(palette.coreHue, 20, 100, 0.5);
  circle(cx, cy, cr * 0.6);
}

function drawStars() {
  const cx = width / 2;
  const cy = height / 2;
  const t = frameCount;

  noStroke();
  for (const st of stars) {
    // rotate the whole disk slowly (angular speed ~ 1/radius, like a galaxy)
    const angSpeed = galaxy.swirl * (1 + 60 / (st.radius + 40));
    st.angle += angSpeed;

    // noise-flow perturbation: the field bends each orbit uniquely
    const n = noise(
      st.home.x * galaxy.noiseScale,
      st.home.y * galaxy.noiseScale,
      t * 0.0009
    );
    const flow = (n - 0.5) * galaxy.flowStrength;

    const r = st.radius + flow;
    const x = cx + cos(st.angle) * r;
    const y = cy + sin(st.angle) * r * galaxy.ellipticity;

    // twinkle
    st.twinkle += st.twinkleSpeed;
    const tw = 0.55 + 0.45 * sin(st.twinkle);

    fill(st.hue, st.sat, st.bri, 0.85 * tw);
    circle(x, y, st.size);

    // occasional soft halo on the brightest stars
    if (st.bri > 88 && st.size > 1.6) {
      fill(st.hue, st.sat * 0.5, 100, 0.06 * tw);
      circle(x, y, st.size * 6);
    }
  }
}

// ---- interaction -------------------------------------------------------
function lerpHue(a, b, t) {
  // shortest-path hue interpolation on the colour wheel
  let d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
}

function mousePressed() {
  if (mouseY < 0 || mouseY > height) return;
  dragging = true;
  lastMX = mouseX;
  lastMY = mouseY;
}
function mouseDragged() {
  if (!dragging) return;
  camX += mouseX - lastMX;
  camY += mouseY - lastMY;
  lastMX = mouseX;
  lastMY = mouseY;
}
function mouseReleased() {
  dragging = false;
}

function mouseWheel(e) {
  breath = constrain(breath - e.delta * 0.0008, 0.4, 3.0);
  return false;
}

function keyPressed() {
  if (key === "n" || key === "N") regenerate();
  else if (key === "s" || key === "S") saveCosmos();
  else if (key === "m" || key === "M") toggleManifesto();
}

function regenerate() {
  camX = 0; camY = 0; breath = 1;
  bornAsUniverse(newSeed());
}

function saveCosmos() {
  saveCanvas(`aetherism-seed-${seed}`, "png");
}

function toggleManifesto() {
  document.getElementById("manifesto").classList.toggle("hidden");
}

function wireControls() {
  document.getElementById("new-btn").addEventListener("click", regenerate);
  document.getElementById("save-btn").addEventListener("click", saveCosmos);
  document.getElementById("manifesto-btn").addEventListener("click", toggleManifesto);
  document.getElementById("close-manifesto").addEventListener("click", toggleManifesto);

  const seedEl = document.getElementById("seed-value");
  seedEl.addEventListener("click", () => {
    navigator.clipboard?.writeText(location.href).then(() => {
      seedEl.classList.add("copied");
      setTimeout(() => seedEl.classList.remove("copied"), 1400);
    });
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // rebuild spatial layout for the new frame, keeping the same seed
  randomSeed(seed);
  noiseSeed(seed);
  palette = derivePalette();
  galaxy = deriveStructure();
  buildParticles();
  paintBackdrop();
}
