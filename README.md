# WMMHR Compass

High-precision **true-north compass** and **AR level** for the browser, powered by the NOAA/BGS **World Magnetic Model High Resolution 2025 (WMMHR2025, degree/order 133)**. Installable as a PWA and fully offline.

## Features
- True north = magnetic heading + declination computed on-device from WMMHR2025 (valid 2025.0 – 2030.0)
- Tilt-compensated heading from the absolute orientation quaternion, SLERP-smoothed
- Dial with 0.5° ticks and a 0.1° fine-scale heading tape
- **AR Level** tab: live camera, target box, artificial horizon, pitch ladder (1° ticks), roll and pitch gauges (0.5° ticks), Sun and custom-target markers
- Heading trim, roll/pitch zeroing and one-tap heading calibration against the Sun
- Built-in self-test against the official NOAA WMMHR2025 test values (12/12)

## Files
`index.html` (app + embedded WMMHR2025 coefficients) · `manifest.webmanifest` · `sw.js` (offline cache) · icon files

## Deploy on GitHub Pages
1. Upload all files in this folder to the root of the repository.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Open `https://rakawi182.github.io/WMMHR2025/` in Chrome on Android, then **⋮ → Install app** (or tap **INSTALL** in the header).

When you change the app, bump `CACHE` in `sw.js` (for example `wmmhr-compass-v2`) so installed copies update.

## Accuracy notes
Phone magnetometers are typically good to about 1–3°, so the model is more precise than the sensor. Use *Heading trim* or *Calibrate heading to Sun* to remove residual error. Never look at the Sun directly; use the on-screen view.

## Credits
World Magnetic Model High Resolution 2025 — NOAA National Centers for Environmental Information and British Geological Survey (https://doi.org/10.25921/qb1c-vn52). The WMM source and coefficients are in the public domain.
