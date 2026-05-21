# pwa-packaging Specification

## Purpose
Progressive Web App packaging: service worker, manifest, offline caching, install prompt handler.

## Requirements

### Requirement: Service Worker
The app SHALL register a service worker that caches static assets for offline play. Cached assets SHALL include: index.html, JS bundles, CSS, icons.

### Requirement: Web App Manifest
The manifest SHALL declare: name, short_name, icons (192px and 512px), start_url, display: standalone, theme_color, background_color.

### Requirement: Install Prompt
The app SHALL show an install prompt on eligible browsers. The handler MUST NOT intercept if the app is already installed.

### Requirement: Full-Screen Mode
The manifest SHALL request `display: standalone` so the game runs full-screen without browser chrome on installed PWA.
