# Snake HTML5 — Contributing

¡Gracias por querer contribuir! Un par de reglas simples para mantener todo limpio.

## Flujo de trabajo

1. **Issue primero** — abrí un issue describiendo el bug, feature, o mejora.
2. **Branch con prefijo** — `feat/descripcion`, `fix/descripcion`, `docs/descripcion`.
3. **Commits convencionales** — `feat(engine): agregar power-up de velocidad`, `fix(renderer): corregir HUD en 2P`.
4. **PR con tests** — si agregás lógica, agregá tests en `tests/unit/`.
5. **Build verde** — `npm test && npm run build` debe pasar antes de pushear.

## Setup

```bash
git clone https://github.com/x-tremer/snake.git
cd snake
npm install
npm run dev      # http://localhost:3000
```

## Estructura

| Directorio | Qué va |
|---|---|
| `src/engine/` | Lógica pura del juego — sin DOM, sin Canvas |
| `src/renderer/` | Canvas 2D — dibujo, overlays, partículas |
| `src/input/` | Teclado y touch |
| `tests/unit/` | Tests unitarios con Vitest |
| `tests/e2e/` | Smoke tests con Playwright |
| `public/` | PWA assets estáticos |

## Tests

```bash
npm test          # Unitarios (33 tests)
npm run test:e2e  # Playwright (requiere `npm run build` antes)
```

Agregá tests para cualquier feature nueva. Mínimo: happy path + un edge case.

## Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(engine): descripción
fix(renderer): descripción
docs(readme): descripción
test(game-state): descripción
refactor(input): descripción
chore(ci): descripción
```

## PRs

- Una feature por PR.
- Si tocás más de 400 líneas, considerá dividirlo en PRs encadenados.
- El CI corre automáticamente: tests + build + shellcheck donde aplique.

## Código de conducta

Sé buena persona. Tratá a los demás como te gustaría que te traten. Simple.
