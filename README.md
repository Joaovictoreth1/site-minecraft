# site-minecraft

Behemoth Voxel Engine is a browser game inspired by Minecraft: Xbox 360 Edition.
It is an unofficial fan project, not affiliated with Mojang or Microsoft. The
Portuguese (pt-PT) interface includes an in-game tutorial and control reference.

## Architecture

- `index.html` defines the loader, menus, game HUD and dialogs.
- `src/main.js` boots the game module and displays
  a recovery message if startup fails. `src/startup.js` formats error text.
- `src/game.js` contains the original voxel engine: Three.js r128 renders the
  world with WebGL, Canvas generates textures, and Web Audio produces sound.
  There is no backend, database, account, or saved game.
- `src/game.css` styles the game, imports local fonts and compiles Tailwind
  utilities at build time.
  Vite bundles all runtime dependencies; the game makes no CDN requests.

## Local development

Use Node.js 22.22.2+ (22.x) or 24.15+ (24.x, used in CI) and a browser with
WebGL enabled.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Use the in-game **Como Jogar & Controlos** menu
for keyboard and mouse controls; touch controls appear on supported devices.

| Command            | Purpose                                                                               |
| ------------------ | ------------------------------------------------------------------------------------- |
| `npm run lint`     | ESLint, Stylelint, HTML Validate, and Prettier checks                                 |
| `npm test`         | Vitest unit tests, with text, HTML and LCOV coverage for extracted pure startup logic |
| `npm run build`    | Produce the static artifact in `dist/`                                                |
| `npm run preview`  | Serve the built artifact locally                                                      |
| `npm run test:e2e` | Test the built game in Chromium at root and under a project subpath                   |

Before running browser tests, run `npm run build` and
`npx playwright install chromium` (use `--with-deps` on clean Linux runners).
The smoke tests use software WebGL for reproducibility. They cover menu and
dialog interactions, basic gameplay entry, and startup failures; they do not
measure GPU performance or exercise all world mechanics. No TypeScript
typecheck is configured because this repository uses JavaScript.

## Deploy

Publish the **contents of `dist/`** to an HTTPS static host, not the source
tree. Relative asset URLs support a root domain or a project path such as
`/site-minecraft/`; redirect the path without a trailing slash to the path
with a slash. No server-side route rewrites are needed. Use short caching or
revalidation for `index.html` and long immutable caching for hashed files in
`assets/`.

The build also writes the Three.js and font license notices to `dist/licenses/`.

GitHub Pages is not configured by this repository. To use it, enable **GitHub
Actions** as the Pages source and publish `dist/` as the Pages artifact from a
deployment workflow after CI passes. The current CI only verifies changes and
does not publish anything.

The HTML supplies a Content Security Policy: scripts, stylesheets, and fonts
are same-origin, and generated sprite images use `data:`.
On a host that supports headers, send that same policy as a
`Content-Security-Policy` response header and add `frame-ancestors 'none'`
(not honored in HTML meta). Also set `X-Content-Type-Options: nosniff` and
`Referrer-Policy: no-referrer`; configure HSTS at the HTTPS host once all
affected domains reliably serve HTTPS. Do not disable WebGL or pointer lock
when configuring the host or embedding restrictions.
