<div align="center">

# claude-team-dashboard

**Aggregate Claude Code usage across your whole team — cost, tokens, and model distribution in one place.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?labelColor=0B0A09)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg?labelColor=0B0A09)](package.json)

</div>

## Install

```bash
npx github:NickCirv/claude-team-dashboard <command>
```

## Usage

```bash
# Import a developer's usage data
npx github:NickCirv/claude-team-dashboard import alice-usage.json

# Print team summary to terminal
npx github:NickCirv/claude-team-dashboard summary

# Per-developer report
npx github:NickCirv/claude-team-dashboard report alice

# Start the web dashboard
npx github:NickCirv/claude-team-dashboard start
```

| Command | Description |
|---------|-------------|
| `summary` | Team totals: cost, sessions, tokens, active devs |
| `report <dev>` | Per-developer breakdown with daily cost history (last 14 days) |
| `import <file>` | Import or update a developer's usage JSON |
| `start [-p <port>]` | Web dashboard at `localhost:4321` with REST API |

## What it does

Reads developer usage JSON files and aggregates them into a shared view. The terminal summary shows team totals, per-developer breakdowns, model distribution, and a 30-day cost timeline. The web dashboard at `localhost:4321` exposes the same data via REST (`/api/team`, `/api/dev/:name`, `/api/raw`). Data is stored in `~/.claude-team/data.json`.

**Expected import format:**

```json
{
  "name": "alice",
  "sessions": 412,
  "totalCost": 98.40,
  "tokens": { "input": 10200000, "output": 4000000 },
  "modelUsage": { "claude-sonnet-4-6": 389, "claude-haiku-4-5": 23 },
  "projects": { "my-app": { "cost": 45.20, "sessions": 201 } },
  "daily": [{ "date": "2026-02-28", "cost": 4.80 }],
  "lastActive": "2026-02-28"
}
```

---
<sub>Node >=18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
