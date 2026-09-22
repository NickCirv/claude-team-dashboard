# claude-team-dashboard — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`fc752e5877bb8042b574d5bc8dd9838446be9d87`](https://github.com/NickCirv/claude-team-dashboard/commit/fc752e5877bb8042b574d5bc8dd9838446be9d87).
- Tree: `2fd31caf1186fc4fa25ee0f2ba3abff14f69aa9d`; truncated: `false`.
- Capture: 9 of 9 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/package.json) | Source declaration inspected; runtime unverified |
| Aggregates imported Claude usage records into team summaries and a local web dashboard. | [bin/team.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/bin/team.js) · [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) | Implementation interfaces inspected; behavior not executed |
| JSON import; team and developer summaries; a web interface; raw and aggregated API endpoints. | [bin/team.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/bin/team.js), [src/aggregator.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/aggregator.js), [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js), [src/server.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/server.js) | Source-backed scope, not a test result |
| Imported records and sample data are not proof of real team adoption. The server exposes usage endpoints; authentication was not established in this documentation review. Cost/usage interpretation depends on input quality. | [bin/team.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/bin/team.js), [src/aggregator.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/aggregator.js), [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js), [src/server.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/server.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

Imported records and sample data are not proof of real team adoption. The server exposes usage endpoints; authentication was not established in this documentation review. Cost/usage interpretation depends on input quality.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/LICENSE) | `68729cab364d82364078b08d8580ccfa51dc69c81a7d64e8d8d47a1da6c9349d` | 1072 |
| [README.md](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/README.md) | `2d002d69d76c002f1f1abc8201af0c8b274ea003b50d73e64d5a873fee10bc35` | 1978 |
| [package.json](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/package.json) | `657dbe143768d713f56e56414091590a1cee7d75db341be3d2728910fd70137a` | 716 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/.github/workflows/ci.yml) | `e818f4e6bd805f798665dbbf04964d02f12fc59dd7f18903ad63d26d374ae3f0` | 380 |
| [bin/team.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/bin/team.js) | `89d2c57d192e3cc76303d8a060438e0a54d75c0b38b3d8af6a84c4eaa3bd979f` | 99 |
| [src/aggregator.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/aggregator.js) | `6c577ee5a9c08533d4cd22d22f30354eb4da8427c7d1ab63f8582706c231c40c` | 3522 |
| [src/index.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/index.js) | `67050c411f8f7f6878b7095dbd5effb6566823cf5b555459289a42cec8f08320` | 8572 |
| [src/server.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/src/server.js) | `cfa94b8bdb52c7690ca72c9203cc09f81753684781fb379a171f3ba38b901315` | 1556 |
| [test/smoke.test.js](https://github.com/NickCirv/claude-team-dashboard/blob/fc752e5877bb8042b574d5bc8dd9838446be9d87/test/smoke.test.js) | `f6ac85bbf05f69bde7ec557b22a226c9f992b43411d82c1961306ba72fa9a980` | 341 |
