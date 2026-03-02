# 3D Asymmetrical Shelving Configurator

This project is a **3D asymmetric shelf configurator** built with **Three.js**, developed as part of a technical exercise.

The configurator allows dynamically adjusting the shelf height via a numeric input, visualizing the asymmetric geometry in real time, and exporting the configuration as structured JSON.

---

## Features

- **Asymmetric shelf geometry**
  - Base panel wider in depth (30cm) than the top panel (20cm)
  - Four diagonal lateral supports connecting base and top corners precisely
  - Tapered silhouette that changes proportionally with height

- **Parametric height control**
  - Height adjustable via input field (min 30cm, step 10cm)
  - Shelf geometry rebuilds completely on every change

- **Real-time camera framing**
  - Camera automatically repositions and reframes based on shelf height
  - Uses bounding box calculation to keep the shelf always in view

- **JSON configuration export**
  - Configuration logged to the browser console on every change
  - Includes dimensions, product metadata and coordinate system reference

- **Glassmorphism UI panel**
  - Floating panel with backdrop blur and smooth hover transitions

---

## Project Structure

```
/
├── index.html
├── main.js
└── README.md
```

---

## Architecture Overview

### main.js

- Scene, camera, renderer and lights setup
- Shelf construction logic (`buildAsymmetricShelf`)
- Asymmetric geometry calculation (`createShelfGeometry`)
- Corner computation for base and top panels (`computeCorners`)
- Diagonal lateral creation with quaternion alignment (`createLateral`)
- Camera framing logic (`frameShelf`)
- JSON export logic (`getAsymmetricShelfConfig`, `logShelfConfig`)
- Window resize handler

---

## Geometry Details

The shelf is built from 6 procedural elements:

```
Base panel   — 80cm wide × 30cm deep  (bottom)
Top panel    — 80cm wide × 20cm deep  (top, offset to align back edge)
4 Laterals   — connect each base corner to the corresponding top corner diagonally
```

The depth difference between base and top creates the asymmetry:

```javascript
const offsetY = (baseDepth - topDepth) / 2; // 5cm
```

Each lateral support is aligned using quaternion rotation:

```javascript
mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3().subVectors(to, from).normalize()
);
```

---

## JSON Export

The shelf configuration is generated from a single source of truth and includes metadata and dimensions.

Example output:

```json
{
  "productId": "ASYM-SHELF-001",
  "type": "asymmetric_shelf",
  "exportedAt": "2026-03-02T20:00:00.000Z",
  "dimensions": {
    "width": 80,
    "baseDepth": 30,
    "topDepth": 20,
    "height": 60,
    "thickness": 1
  },
  "coordinateSystem": {
    "x": "horizontal (left to right)",
    "y": "depth (scene back to viewer)",
    "z": "vertical (bottom to top)"
  }
}
```

The configuration is:
- Logged automatically to the browser console on every height change

---

## Controls

### Shelf
- **Height input**: Set total shelf height (min 30cm, step 10cm)

### Camera
- **Left drag**: Orbit around the shelf
- **Scroll**: Zoom in / out
- **Right drag**: Pan

---

## Technologies

- Three.js r128
- OrbitControls
- BoxGeometry (procedural — no external models)
- Vanilla JavaScript (no frameworks)
- ES Modules

---

## Getting Started

Simply open `index.html` using a local server (e.g. VS Code Live Server).
No build step required.

---

## 🚀 Demo en vivo
👉 [Ver proyecto](https://maria94mml-boop.github.io/3D-Asymmetrical-shelving/)
