# WMMHR Compass

High-precision **true-north compass** and **AR level** for the browser, powered by the NOAA/BGS **World Magnetic Model High Resolution 2025 (WMMHR2025, degree/order 133)**. Installable as a PWA and fully offline.

## Features
- True north = magnetic heading + declination computed on-device from WMMHR2025 (valid 2025.0 – 2030.0)
- Tilt-compensated heading from the absolute orientation quaternion, SLERP-smoothed
- Dial with 0.5° ticks and a 0.1° fine-scale heading tape
- **AR Level** tab: live camera, target box, artificial horizon, pitch ladder (1° ticks), roll and pitch gauges (0.5° ticks), Sun and custom-target markers
- Heading trim, roll/pitch zeroing and one-tap heading calibration against the Sun
- Built-in self-test against the official NOAA WMMHR2025 test values (12/12)

## New in v3.4 — Clinometer (AR LEVEL → CLINO)
- Aim the box at a point: live elevation angle and grade (%). **MEASURE** averages 0.9 s of readings and rejects an unsteady hold (spread > 0.5°).
- **Slots**: ANGLE (slope: angle, grade, 1:n, rise and slope length if a distance is entered), TOP and BASE (object height = d·(tan θtop − tan θbase); with TOP only, height = d·tan θtop + eye height). *d is the horizontal distance.*
- **Two-face method**: measure, rotate the phone 180° about the viewing axis, aim at the same point and measure again. The average cancels the sensor/mounting offset and the half-difference is reported as the offset. Two-face readings use the raw pitch; single-face readings use pitch with your ZERO applied.
- Height uncertainty shown is from reading spread only; distance error is usually larger (1 % in d = 1 % in height).
- Service worker cache `wmmhr-compass-v8`.

## New in v3.3 — Target coordinates: distance, bearing, radar
- **Target card** (COMPASS tab): enter target coordinates as decimal (`-6.2088, 106.8456`, decimal comma also accepted) or DMS with hemisphere (`6°12′31″S 106°50′44″E`, `LS/BT` also accepted), or tap **MARK HERE** to store your current position. The target is saved on the device.
- **Geodesic on WGS84** (Vincenty inverse, mm-level; verified against the Flinders Peak–Buninyong test line). Falls back to a spherical approximation only for near-antipodal pairs, and says so.
- Shows distance, initial bearing in the shown north (TRUE / MAG / GRID), all three bearings, the turn relative to your current heading, and the **bearing uncertainty ≈ atan(GPS accuracy ÷ distance)**.
- **Offline radar** (canvas, no map tiles): you at the centre, GPS-accuracy disc, range rings, dashed line to the target. Tap to switch north-up / heading-up.
- **OPEN IN MAPS** hands the target to the installed maps app (`geo:` on Android).
- The bearing feeds the existing **TARGET** marker in AR LEVEL (label adds the distance). Typing an azimuth by hand there overrides the coordinate target. Elevation is still typed manually.
- Service worker cache `wmmhr-compass-v7`.

## New in v3.1
- **Innovation check (works without the Magnetometer API)**: σ of the abs−rel yaw offset over 5 s (only while rotation < 20°/s) plus the instantaneous deviation. Levels WARN/ANOMALY (`INOV`, heuristic, tune from the log) cut the magnetic gain to 25 % / 5 %; the heading is then held by the gyro.
- **Rate weighting**: magnetic correction weight (1 − ω/40)², zero above 40°/s; the offset is not initialised while rotating ≥ 20°/s (abs/rel timing skew of ~30 ms would otherwise bias it by ω·lag).
- **Session log** (LOG START / EXPORT LOG / CLEAR LOG): 5 Hz CSV (`sess,utc,t_s,hdgShown,hdgMagFused,hdgMagAbs,yawOffDeg,yawRawDeg,innovDeg,innovStd5sDeg,omegaDps,gate,iLvl,dLvl,fieldDevPct,dipDevDeg,upright,stabDeg,fps,lat,lon`), flushed every 25 rows to its own IndexedDB, so a killed tab loses at most 5 s. `yawRawDeg` is the yaw of q_abs ⊗ q_rel⁻¹.
- Gallery CSV and photo metadata add `fusion, headingCorr, fieldDevPct, dipDevDeg, innovStdDeg, anomalyLvl, fps`.
- Swing info warns when the largest heading gap exceeds 180° (Sun alone cannot cover the compass).
- Service worker cache `wmmhr-compass-v5`.

**Upload to the repo root (replace existing): `index.html`, `sw.js`, `README.md`.** Icons and manifest are unchanged.

## New in v3 (sensor-error reduction, after the Xsens MT0202P magnetic-calibration approach)
- **Gyro fusion**: `RelativeOrientationSensor` (gyro+accelerometer, immune to magnetic disturbance) is rotated into ENU by a filtered yaw offset θ = yaw(q_abs ⊗ q_rel⁻¹), τ = 6 s (0.5 s for the first 3 s), gain reduced by field anomalies and fast rotation. Falls back to the absolute sensor alone if unavailable.
- **Field-consistency check against WMMHR2025**: measured |F| and dip (from the Magnetometer API, where exposed) vs model F and I; thresholds in `DIST` (heuristic, tune per device). Anomaly pauses magnetic correction in the fusion and raises an alert.
- **Swing calibration**: heading-dependent error e(ψ) = a₀ + a₁sinψ + b₁cosψ + a₂sin2ψ + b₂cos2ψ fitted by least squares from Sun/target sightings (offset ≥1 pt, 3-term ≥5 pts, 5-term ≥8 pts with gaps ≤120°); RMS shown; replaces the single trim when active.
- Metadata adds `fusion`, `headingCorr`, `fieldDevPct`, `dipDevDeg`. Service worker cache `wmmhr-compass-v4`.

## New in v2.1 (stamp always shows TRUE, MAG and GRID headings; * marks the mode shown)

## New in v2
- **Stamped capture**: the AR photo is saved as JPEG at native camera resolution with a data band (UTC + local time, lat/lon/alt/GPS accuracy, true/magnetic/shown heading, declination, pitch, roll, heading stability, model error, trim, FOV).
- **EXIF + metadata**: standard EXIF/GPS tags (incl. `GPSImgDirection` true/magnetic, GPS position and accuracy, UTC time) plus the full JSON in `UserComment`; SHA-256 of the JPEG kept in the gallery record.
- **Gallery** (IndexedDB, offline): share, per-photo JSON, delete, export all as CSV / GeoJSON / KML. Optional auto-capture when level and steady for 1.2 s.
- **Reliability alerts** (from the Dec 2025 State of the Geomagnetic Field report): Blackout zone (H < 2000 nT), Caution zone (H < 6000 nT), live NOAA SWPC Kp storm banner (cached, ignored if older than 6 h), validity period, optional magnetometer interference check (only where the browser exposes `Magnetometer`).
- **Uncertainty**: declination model error from the WMMHR2025 error model, δD = sqrt(0.25² + (5205/H)²) (Technical Report eq. 44); heading stability (circular σ over 1.5 s).
- **Grid North** mode (TRUE → MAG → GRID), UTM zone, grid convergence and grid variation; declination secular change (′/yr).
- Sun calibration now averages up to 8 samples and reports the spread; Sun marker fixed in magnetic mode.
- Service worker cache bumped to `wmmhr-compass-v2` with an update toast.

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
