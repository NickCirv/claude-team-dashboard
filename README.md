# claude-team-dashboard

Team-wide Claude Code analytics — track cost, token usage, and model distribution across every developer.

<p align="center">
  <img src="https://img.shields.io/npm/v/claude-team-dashboard.svg" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="node >= 18" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
</p>

## Why

When your whole team uses Claude Code, the questions get harder to answer: Who's spending the most? Which projects are driving cost? Are devs using Haiku when Opus is overkill, or the reverse? `claude-team-dashboard` aggregates usage data from all your developers into a shared dashboard — terminal summary or browser UI — so engineering leads can track spend and optimize usage across the board.

## Quick Start

```bash
# Import a developer's usage data
npx claude-team-dashboard import alice-usage.json

# Print team summary to terminal
npx claude-team-dashboard summary

# Generate a per-developer report
npx claude-team-dashboard report alice

# Start the web dashboard
npx claude-team-dashboard start
```

## What It Does

- Aggregates usage data from multiple developers stored in `~/.claude-team/data.json`
- Shows team totals: cost, sessions, tokens, active developer count
- Per-developer breakdown: sessions, input/output tokens, total cost, favorite model
- Model distribution: which Claude models the team uses and in what proportions
- Top projects by cost across the whole team
- 30-day cost timeline chart (ASCII bar in terminal, visual in browser)
- Web dashboard at `localhost:4321` with REST API (`/api/team`, `/api/dev/:name`, `/api/raw`)
- Individual developer reports with daily cost history (last 14 days)
- Import/update developer data from JSON files — works with any data collection pipeline

## Example Output

```
$ npx claude-team-dashboard summary

  == Claude Team Dashboard ==
  Last updated: 2026-02-28T09:00:00.000Z

  Team Overview
  Total Cost           $284.72
  Total Sessions       1,847
  Total Tokens         48,291,400
  Active Devs          6 / 6

  Per-Developer Breakdown
  Name             Sessions    Tokens          Cost        Top Model
  ──────────────────────────────────────────────────────────────────────
  alice            412         14,200,000      $98.40      claude-sonnet-4-6
  bob              387         11,800,000      $72.15      claude-sonnet-4-6
  carol            298          9,100,000      $54.30      claude-haiku-4-5
  dave             241          7,400,000      $32.80      claude-sonnet-4-6
  eve              318          4,200,000      $22.10      claude-haiku-4-5
  frank            191          1,591,400      $4.97       claude-opus-4-6

  Model Distribution
  claude-sonnet-4-6              ████████████████  72.4%
  claude-haiku-4-5               ██████░░░░░░░░░░  21.8%
  claude-opus-4-6                ██░░░░░░░░░░░░░░   5.8%

  Top Projects by Cost
  cirvgreen-website              $84.20      412 sessions, 3 devs
  agent-viewer                   $61.50      298 sessions, 2 devs
  morality-pipeline              $44.80      187 sessions, 1 dev
```

## Commands

### `start`

Start the web dashboard.

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port to listen on | `4321` |

Opens at `http://localhost:4321`. REST API available at:
- `GET /api/team` — full aggregated team data
- `GET /api/dev/:name` — individual developer report
- `GET /api/raw` — raw data file contents

### `summary`

Print team summary to the terminal.

### `report <dev>`

Generate a per-developer usage report including daily cost breakdown (last 14 days).

### `import <file>`

Import or update a developer's usage data from a JSON file. Updates existing entry by name, or adds new.

**Expected JSON format:**

```json
{
  "name": "alice",
  "sessions": 412,
  "totalCost": 98.40,
  "tokens": { "input": 10200000, "output": 4000000 },
  "modelUsage": { "claude-sonnet-4-6": 389, "claude-haiku-4-5": 23 },
  "projects": {
    "my-app": { "cost": 45.20, "sessions": 201 }
  },
  "daily": [
    { "date": "2026-02-28", "cost": 4.80 }
  ],
  "lastActive": "2026-02-28"
}
```

Data is stored at `~/.claude-team/data.json`.

## Install Globally

```bash
npm i -g claude-team-dashboard
```

## License

MIT
