![Nicholas Ashkar — claude-team-dashboard](assets/nicholas-ashkar/banner.png)

# claude-team-dashboard

Aggregates imported Claude usage records into team summaries and a local web dashboard.



<a id="usage"></a>

<a id="print-team-summary-to-terminal"></a>

## What it does

- JSON import.
- Team and developer summaries.
- A web interface.
- Raw and aggregated API endpoints.



<a id="install"></a>

<a id="start-the-web-dashboard"></a>

## Quickstart

Prerequisites: Node.js `>=20` and npm. The checkout below pins the source used for this documentation.

```sh
git clone https://github.com/NickCirv/claude-team-dashboard.git
cd claude-team-dashboard
git checkout fc752e5877bb8042b574d5bc8dd9838446be9d87
npm install
node bin/team.js summary
```

**Expected behavior (illustrative, not captured):** Prints a summary of locally stored or bundled team data.

Examples are source-inspected, **not runtime-tested**. See the research record for verification gaps.

## Boundaries and data

Imported records and sample data are not proof of real team adoption. The server exposes usage endpoints; authentication was not established in this documentation review. Cost/usage interpretation depends on input quality.



<a id="import-a-developers-usage-data"></a>

<a id="per-developer-report"></a>

## Development

The manifest defines `npm test` as:

```sh
node --test
```

The captured suite is a smoke check, not end-to-end behavior coverage. Examples include “entry is valid JavaScript”. Tests were not run for this documentation revision.

See [implementation and command reference](docs/REFERENCE.md) for the package scripts and inspected interfaces, and [research record](docs/RESEARCH.md) for the pinned source, document decisions and unresolved checks.

## License and contact

See [LICENSE](LICENSE) for the original terms and attribution. Legal text is unchanged.

[Nicholas Ashkar](https://nicholashkar.com/) · [Discuss a project](https://nicholashkar.com/#oxblood-contact)
