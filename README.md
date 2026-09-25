# AETHERISM

### *galaxies remembered from a single number*

Aetherism is an algorithmic art movement in which **every cosmos is compressed into
a single seed**. Nothing is drawn by hand and nothing is truly random — each galaxy
is *grown* deterministically from one number, so any universe you love can be found
again, exactly, forever.

The image is never rendered in an instant. It **accretes**: thousands of particles
orbit a seeded logarithmic spiral, their paths bent by a Perlin noise field, their
light building up frame after frame like dust becoming stars.

---

## The Manifesto (in brief)

1. **A universe is a number.** Determinism is a promise, not a limitation.
2. **Order is noise that has forgiven itself.** We sculpt with fields, not lines.
3. **The particle is the smallest possible faith.** No star knows the spiral it makes.
4. **Gravity is a rumor the particles choose to believe.** We simulate poetry, not physics.
5. **Nothing is rendered. Everything is grown.**

The full manifesto lives inside the piece — press **M**.

---

## The Three Techniques

| Technique | Where it lives in `sketch.js` |
|---|---|
| **Particle systems** | ~2,600 stars + drifting dust, each an autonomous point accreting into a spiral |
| **Noise fields** | `noise()` perturbs every orbit (`drawStars`) and scatters the deep-field backdrop |
| **Seeded randomness** | `randomSeed()` + `noiseSeed()` make each seed a fully reproducible universe |

## Controls

| Action | Key / Gesture |
|---|---|
| New cosmos (new seed) | **N** or *✦ new cosmos* |
| Save PNG | **S** or *↓ save* |
| Manifesto | **M** or *☰ manifesto* |
| Shift the void | drag |
| Breathe (zoom) | scroll |
| Share a universe | click the seed → copies a URL with `?seed=` |

Open `index.html` in any modern browser. The seed is stored in the URL, so
`index.html?seed=12345` always regrows the same galaxy.

## Files

- `index.html` — stage, HUD, and manifesto overlay
- `style.css` — glassmorphic control panel and typographic identity
- `sketch.js` — the seeded galaxy engine (particles + noise + determinism)
