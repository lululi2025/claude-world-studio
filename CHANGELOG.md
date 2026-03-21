# Changelog

## [1.4.0] - 2026-03-21

### Added

- **Remotion video generation** — `remotion-best-practices` skill installed from [remotion-dev/skills](https://github.com/remotion-dev/skills); Claude can now create frame-perfect product animations and motion graphics on demand
  - Spring, easing, interpolation, scene sequencing, text animations, particle effects
  - Renders to MP4 via `npx remotion render`; output is downloadable from `demo/download.html`
- **Demo animations** — `demo/remotion-demo.mp4` (Remotion intro) and `demo/engenius-ad.mp4` (EnGenius AI Cloud Surveillance 30s ad, 5 scenes, 1280×720 30fps)
- **Remotion source examples** — `demo/remotion-src/` contains the full source for the demo compositions (`Intro.tsx`, `EnGenius.tsx`, `Root.tsx`)

## [1.1.0] - 2026-03-15

### Added

- **Full CLI support** — `bin/cli.js` with 23 commands mapping 1:1 to REST API + WebSocket
  - `session list|create|get|rename|delete|messages` — full session CRUD
  - `chat --message|--session|--json` — WebSocket streaming with auto-session-create and stdin pipe
  - `account list|create|update|delete` — social account management
  - `settings get|detect|apply|set` — MCP tool auto-detection and configuration
  - `file list|read` — workspace file browsing with URL-encoded paths
  - `publish|history` — content publishing (existing, now CLI-accessible)
  - `interrupt` — stop running sessions via WebSocket
- **`--json` global flag** — all commands support JSON output for programmatic use (NDJSON for chat streaming)
- **`--port` / `--host` global flags** — override server connection (env: `STUDIO_PORT`, `STUDIO_HOST`)
- **`studio` bin entry** — `npm install -g @claude-world/studio` then `studio <command>`
- **CLI skill file** — `.claude/skills/studio/SKILL.md` with complete command reference
- **CI/CD** — GitHub Actions workflow: typecheck + build + CLI smoke test (~30s)

### Security

- File paths URL-encoded per segment to prevent malformed HTTP requests
- `parseGlobalFlags` validates `--port` requires numeric value, won't consume flags as values
- `getFlag` won't consume `--flag` tokens as values for other flags
- API requests timeout after 30 seconds (prevents indefinite hangs)
- SIGINT handler flushes interrupt message before exit (ws.send callback + 500ms fallback)
- WebSocket close handler exits 1 on unexpected disconnect (not silent exit 0)
- Cost field handles both `event.cost_usd` and `event.cost` from server

## [1.0.0] - 2026-03-14

### Added

- Initial release: Web UI, REST API, WebSocket, MCP tools
- Agent SDK integration with Claude for AI-powered sessions
- Social publishing to Threads with poll, image, link-comment support
- Settings auto-detection for trend-pulse, cf-browser, notebooklm MCP tools
- Workspace file browsing with path traversal protection
- SQLite storage for sessions, messages, accounts, settings, publish history
