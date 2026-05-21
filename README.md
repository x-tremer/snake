```
   _____             _
  / ____|           | |
 | (___  _ __   __ _| | _____  ___
  \___ \| '_ \ / _` | |/ / _ \/ __|
  ____) | | | | (_| |   <  __/\__ \
 |_____/|_| |_|\__,_|_|\_\___||___/

     ── 🎮  Snake · HTML5 Canvas · PWA · Capacitor  🎮 ──
```

<div align="center">

**Clásico, multijugador, multiplataforma. Sin instalar nada.**

[![Tests](https://img.shields.io/badge/tests-33%20passing-brightgreen)](https://github.com/x-tremer/snake/actions)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/x-tremer/snake/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)](./CONTRIBUTING.md)

[Jugar ahora](#-jugar-ya) · [Instalar como app](#-instalar-como-app) · [Desarrollo](#-desarrollo) · [Mobile](#-android--ios)

</div>

---

## 🎯 Qué es esto

El Snake de toda la vida, rehecho desde cero en **HTML5 Canvas**.
Corre en **cualquier navegador**, se **instala como app**, y con **Capacitor** sale para **Android e iOS**.

| Plataforma | Cómo |
|---|---|
| 🖥️ Windows / Mac / Linux | Navegador o PWA instalada |
| 📱 Android | Navegador, PWA instalada, o `.apk` desde Google Play |
| 🍎 iOS | Safari, PWA "Agregar a inicio", o `.ipa` desde App Store |

```
        🟢 P1                          🟡 Comida
   ╔══════════════════╗         ┌─────────────────┐
   ║  ■ ■ ■ ●  ▶     ║         │ Score: 12        │
   ║                  ║         │ Record: 47       │
   ║   🟡         🟣  ║         │ Level: 3         │
   ║                  ║         │ Skin: Fuego      │
   ║      ████████    ║         │ Map: Fortaleza   │
   ║                  ║         └─────────────────┘
   ║  ▶  ■ ■ ■  🔵 P2║
   ╚══════════════════╝
```

## 🎮 Modos de juego

| Modo | Teclas |
|---|---|
| **1 Jugador** | `↑ ↓ ← →` |
| **2 Jugadores** | P1: `↑ ↓ ← →` · P2: `W A S D` |

### Controles generales

| Tecla | Acción |
|---|---|
| `Enter` | Iniciar 1P / Reiniciar |
| `1` | Iniciar 1 jugador |
| `2` | Iniciar 2 jugadores |
| `P` | Pausar / Continuar |
| `K` | Cambiar skin (en menú) |
| `M` | Cambiar mapa (en menú) |

### En mobile

- **Swipe** en la pantalla para mover la serpiente
- **D-pad** virtual en la parte inferior como alternativa
- **Tap rápido** para pausar

## 🎨 Skins

```
🟢 Clásica    🟢 Cabeza lima · Cuerpo verde
🔵 Azul       🔵 Cabeza celeste · Cuerpo azul
🟠 Fuego      🟠 Cabeza naranja · Cuerpo rojo
🟣 Morada     🟣 Cabeza violeta · Cuerpo púrpura
```

## 🗺️ Mapas

| Mapa | Obstáculos |
|---|---|
| **Clásico** | Sin obstáculos — campo abierto |
| **Columnas** | Barras verticales que se duplican en nivel 3+ |
| **Cruz** | Cruz central + barras horizontales extra en nivel 3+ |
| **Fortaleza** | Paredes perimetrales + anillos internos en nivel 3+ |

## 🍎 Comida

| Tipo | Puntos | Color | Probabilidad |
|---|---|---|---|
| Normal 🟡 | +1 | Rojo | 80% |
| Bonus ⭐ | +3 | Dorado | 15% |
| Speed ⚡ | +2 | Cian | 5% |

## 📈 Progresión

- **Nivel** sube cada 5 puntos
- **Velocidad** aumenta con cada nivel
- **Obstáculos** aparecen desde nivel 2
- **Récord** persistente en `localStorage`

## 🚀 Jugar ya

```bash
# 1. Cloná
git clone https://github.com/x-tremer/snake.git
cd snake

# 2. Instalá
npm install

# 3. Jugá
npm run dev
```

Abrí `http://localhost:3000` y a jugar. Sin dependencias externas, sin runtime, sin nada — solo un navegador.

## 📦 Instalar como app

### PWA (cualquier plataforma)

Abrí la URL en Chrome/Edge/Safari → menú → "Instalar aplicación" o "Agregar a inicio".
Funciona offline, pantalla completa, como una app nativa.

### Descargable (GitHub Releases)

Cada release incluye un `.zip` con la carpeta `dist/` lista para servir con cualquier hosting estático (Netlify, Vercel, GitHub Pages, Nginx).

## 🤖 Desarrollo

```bash
npm install          # Instalar dependencias
npm run dev          # Dev server con HMR en :3000
npm run build        # Build de producción → dist/
npm test             # 33 tests unitarios (Vitest)
npm run test:e2e     # Smoke test con Playwright
npm run preview      # Previsualizar build de producción
```

### Estructura

```
snake/
├── src/
│   ├── engine/          # Lógica del juego
│   │   ├── Snake.js     #   Serpiente: segmentos, dirección, crecimiento
│   │   ├── Food.js      #   Comida: spawn, tipos, detección
│   │   ├── Grid.js      #   Grilla: colisiones, posiciones libres
│   │   ├── Obstacles.js #   Obstáculos por mapa y nivel
│   │   └── GameState.js #   Máquina de estados, puntaje, niveles
│   ├── renderer/        # Renderizado Canvas 2D
│   │   ├── CanvasRenderer.js  # Loop principal de dibujo
│   │   ├── drawSnake.js       # Serpientes con skins
│   │   ├── drawFood.js        # Comida con tipos visuales
│   │   ├── drawHUD.js         # Score, récord, nivel
│   │   ├── drawMenu.js        # Pantalla de menú
│   │   └── particles.js       # Fondo estrellado animado
│   ├── input/           # Manejo de entrada
│   │   ├── KeyboardHandler.js # Teclado: flechas, WASD, menú
│   │   └── TouchHandler.js    # Touch: swipe + D-pad virtual
│   ├── main.js          # Bootstrap, game loop, responsive, PWA
│   ├── config.js        # Constantes, skins, mapas, tipos de comida
│   └── storage.js       # Persistencia de récord en localStorage
├── tests/
│   ├── unit/            # 33 tests unitarios con Vitest
│   └── e2e/             # Smoke test con Playwright
├── public/              # PWA: service worker, manifest, íconos SVG
├── openspec/            # Especificación SDD completa
│   ├── config.yaml
│   ├── specs/           # 6 dominios: game-engine, single-player, etc.
│   └── changes/         # Historial de cambios
└── capacitor.config.json
```

## 📱 Android / iOS

El juego es una web app que Capacitor empaqueta como app nativa.

```bash
# 1. Instalá Capacitor
npm install

# 2. Agregá las plataformas que necesites
npx cap add android
npx cap add ios

# 3. Build + sync
npm run build
npx cap sync

# 4. Abrí en el IDE nativo
npx cap open android   # Android Studio → .apk
npx cap open ios       # Xcode → .ipa
```

## 📋 Requisitos

| Entorno | Qué necesitás |
|---|---|
| Navegador | Chrome, Firefox, Safari, Edge — cualquiera moderno |
| Desarrollo | Node.js ≥ 18 LTS |
| Mobile | Android Studio (para `.apk`) · Xcode + macOS (para `.ipa`) |

No usa frameworks, no usa WebGL, no usa Webpack. **JavaScript vanilla + Canvas 2D + Vite.**

## 🧪 Tests

```
33 tests · 5 archivos · 0 fallas · < 2s

✅ Snake.js      7 tests  — init, dirección, bloqueo, movimiento, crecimiento, auto-colisión
✅ Grid.js        4 tests  — ocupado, snap, fuera de límites, celda libre
✅ GameState.js   13 tests — estados, spawn, colisiones, puntaje, niveles, 2P
✅ Food.js        4 tests  — spawn, detección, tipos
✅ Obstacles.js   5 tests  — mapas, niveles, alineación
```

```bash
npm test          # Unitarios
npm run test:e2e  # Playwright (requiere build previo)
```

## 🔄 CI / CD · Releases

Cada push a `main` ejecuta tests y build. Los releases se generan automáticamente al pushear un tag:

```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

git push --follow-tags
```

El workflow de GitHub Actions:
1. Corre los 33 tests
2. Hace build de producción
3. Empaqueta `dist/` como artefacto
4. Crea un Release en GitHub con el `.zip` adjunto
5. Genera release notes automáticas desde los tags

## 📄 Licencia

MIT — hacé lo que quieras, el juego es de todos.

---

<div align="center">

```
    🐍  hecho con ❤️, JavaScript vanilla, y un Canvas de 600x600  🐍
```

</div>
