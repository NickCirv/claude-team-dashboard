# claude-team-dashboard — implementation reference

Source revision: `fc752e5877bb8042b574d5bc8dd9838446be9d87`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/package.json) declares `bin/team.js`. Node.js `>=20` and npm.

Executable mapping: `claude-team-dashboard` → `./bin/team.js`.

## Supported workflow

JSON import; team and developer summaries; a web interface; raw and aggregated API endpoints.

Imported records and sample data are not proof of real team adoption. The server exposes usage endpoints; authentication was not established in this documentation review. Cost/usage interpretation depends on input quality.

## Declared command interface

Options belong to the preceding command in the linked source; they are not necessarily global.

| Kind | Declaration | Source description | Source |
| --- | --- | --- | --- |
| command | `start` | Start the web dashboard on localhost:4321 | [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) |
| option | `-p, --port <port>` | Port to listen on | [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) |
| command | `report <dev>` | Generate a per-developer usage report | [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) |
| command | `import <file>` | Import developer usage data (JSON) | [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) |
| command | `summary` | Print team summary to terminal | [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) |

## Option defaults

These are literal defaults or parsers declared by the command builder; flags belong to their command as shown above.

| Option | Declared default / parser |
| --- | --- |
| `-p, --port <port>` | `'4321'` |

## Web API

`node bin/team.js start --port 4321` starts the dashboard. The captured server uses `listen(port)` without a host restriction and does not install authentication middleware; contain access before loading real team records.

| Route | Successful JSON | Failure |
| --- | --- | --- |
| `GET /api/team` | `ok: true`, aggregated `data`, `lastUpdated` | `500` with `ok: false`, `error` |
| `GET /api/dev/:name` | `ok: true`, developer report in `data` | `404` when no developer matches; `500` on exception |
| `GET /api/raw` | `ok: true`, complete stored data | `500` on exception |

The catch-all route serves `public/index.html`. The raw-data route exposes the imported records, so sharing the dashboard can disclose more than the summary cards show. `import FILE` writes local team data; inspect the JSON shape and merge behavior before importing a second dataset.

## Package scripts

| Script | Exact command |
| --- | --- |
| `start` | `node bin/team.js start` |
| `test` | `node --test` |

## Implementation sources

[src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.
