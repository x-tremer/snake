# Changelog

All notable changes to Snake HTML5 are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [SemVer](https://semver.org/spec/v2.0.0.html)

---

## [1.0.0] — 2026-05-21

### 🎉 Initial Release

Complete migration from Python/turtle to HTML5 Canvas.

### Added

- **Single-player mode** with skins (4 palettes), maps (4 presets), food types (3), level progression (every 5 points), speed ramp, and obstacles from level 2.
- **Two-player local mode** with independent controls (arrows + WASD), dual collision detection, opponent body collision, head-to-head draw, and winner overlay.
- **PWA support**: service worker with cache-first strategy, web app manifest, install prompt, SVG icons (192px + 512px), offline-capable.
- **Mobile input**: swipe gesture detection + on-screen D-pad fallback.
- **Responsive canvas sizing**: adapts to viewport while maintaining aspect ratio.
- **Animated starfield background** with 30 drifting particles.
- **localStorage record persistence**: high score survives page refresh.
- **33 unit tests** across 5 engine modules (Vitest).
- **Playwright e2e smoke test**.
- **Capacitor config** for Android and iOS native wrapping.
- **Vite** for dev server (HMR) and production builds.
- **GitHub Actions CI/CD**: automated test + build + release pipeline.

### Changed

- Replaced Python + turtle with vanilla JavaScript + Canvas 2D.
- Replaced file-based record (`record.txt`) with `localStorage`.
- Restructured project into `src/engine/`, `src/renderer/`, `src/input/` with ES Modules.
- Deleted 7 legacy `.py` files.

### Removed

- Online multiplayer (TCP sockets — incompatible with browsers, deferred).
- AI opponent (deferred — can be added in a future release).

---

## Version Reference

| Version | Date | Highlights |
|---------|------|------------|
| v1.0.0 | 2026-05-21 | Initial release: full Snake engine, 2P, PWA, Capacitor |
