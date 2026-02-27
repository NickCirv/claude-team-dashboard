import { Command } from 'commander';
import chalk from 'chalk';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { startServer } from './server.js';
import { loadData, aggregateTeam, generateDevReport, getDataPath } from './aggregator.js';

const DATA_DIR = join(homedir(), '.claude-team');
const DATA_FILE = getDataPath();

function fmt(n, digits = 2) {
  return Number(n).toFixed(digits);
}

function fmtCost(n) {
  return `$${fmt(n)}`;
}

function fmtNum(n) {
  return Number(n).toLocaleString();
}

function asciiBar(value, max, width = 20) {
  const filled = max > 0 ? Math.round((value / max) * width) : 0;
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function asciiCostChart(timeline) {
  if (!timeline.length) return chalk.dim('  No timeline data yet.');

  const maxCost = Math.max(...timeline.map(d => d.cost));
  const height = 8;
  const lines = [];

  const bars = timeline.map(d => ({
    date: d.date.slice(5),
    height: maxCost > 0 ? Math.round((d.cost / maxCost) * height) : 0,
    cost: d.cost,
  }));

  for (let row = height; row >= 1; row--) {
    const label = row === height ? fmtCost(maxCost).padStart(7) : '       ';
    const rowBars = bars.map(b => (b.height >= row ? chalk.blue('▄▄') : '  ')).join('');
    lines.push(`  ${chalk.dim(label)} ${rowBars}`);
  }

  lines.push(`  ${' '.repeat(8)}` + bars.map(b => chalk.dim(b.date.slice(-2))).join(' '));
  return lines.join('\n');
}

function printTeamSummary(data) {
  const agg = aggregateTeam(data);

  console.log('\n' + chalk.bold.blue('  ══ Claude Team Dashboard ══'));
  console.log(chalk.dim(`  Last updated: ${data.lastUpdated ?? 'unknown'}\n`));

  console.log(chalk.bold('  Team Overview'));
  console.log(`  ${'Total Cost'.padEnd(20)} ${chalk.green(fmtCost(agg.totalCost))}`);
  console.log(`  ${'Total Sessions'.padEnd(20)} ${chalk.white(fmtNum(agg.totalSessions))}`);
  console.log(`  ${'Total Tokens'.padEnd(20)} ${chalk.white(fmtNum(agg.totalTokens))}`);
  console.log(`  ${'Active Devs'.padEnd(20)} ${chalk.white(agg.activeDevs + ' / ' + agg.totalDevs)}`);

  if (agg.developers.length) {
    console.log('\n' + chalk.bold('  Per-Developer Breakdown'));
    const header = '  ' + [
      'Name'.padEnd(16),
      'Sessions'.padEnd(10),
      'Tokens'.padEnd(14),
      'Cost'.padEnd(10),
      'Top Model',
    ].join('');
    console.log(chalk.dim(header));
    console.log(chalk.dim('  ' + '─'.repeat(70)));

    for (const dev of agg.developers) {
      const tokens = (dev.tokens.input ?? 0) + (dev.tokens.output ?? 0);
      console.log(
        '  ' +
          chalk.white(dev.name.padEnd(16)) +
          String(dev.sessions).padEnd(10) +
          fmtNum(tokens).padEnd(14) +
          chalk.green(fmtCost(dev.totalCost).padEnd(10)) +
          chalk.dim(dev.favoriteModel)
      );
    }
  }

  if (Object.keys(agg.modelUsage).length) {
    console.log('\n' + chalk.bold('  Model Distribution'));
    const total = Object.values(agg.modelUsage).reduce((a, b) => a + b, 0);
    const maxVal = Math.max(...Object.values(agg.modelUsage));
    for (const [model, count] of Object.entries(agg.modelUsage).sort((a, b) => b[1] - a[1])) {
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
      console.log(`  ${model.padEnd(30)} ${asciiBar(count, maxVal, 16)} ${chalk.dim(pct + '%')}`);
    }
  }

  if (agg.topProjects.length) {
    console.log('\n' + chalk.bold('  Top Projects by Cost'));
    for (const proj of agg.topProjects) {
      console.log(
        `  ${proj.name.padEnd(30)} ${chalk.green(fmtCost(proj.cost).padEnd(10))} ${chalk.dim(proj.sessions + ' sessions, ' + proj.devCount + ' devs')}`
      );
    }
  }

  if (agg.timeline.length) {
    console.log('\n' + chalk.bold('  Cost Over Time (last 30 days)'));
    console.log(asciiCostChart(agg.timeline));
  }

  console.log('');
}

function printDevReport(devName, data) {
  const report = generateDevReport(devName, data);
  if (!report) {
    console.error(chalk.red(`  Developer "${devName}" not found.`));
    process.exit(1);
  }

  const totalTokens = (report.tokens.input ?? 0) + (report.tokens.output ?? 0);

  console.log('\n' + chalk.bold.blue(`  ══ Report: ${report.name} ══\n`));
  console.log(`  ${'Sessions'.padEnd(20)} ${report.sessions}`);
  console.log(`  ${'Total Cost'.padEnd(20)} ${chalk.green(fmtCost(report.totalCost))}`);
  console.log(`  ${'Total Tokens'.padEnd(20)} ${fmtNum(totalTokens)}`);
  console.log(`    ${'  Input'.padEnd(18)} ${fmtNum(report.tokens.input ?? 0)}`);
  console.log(`    ${'  Output'.padEnd(18)} ${fmtNum(report.tokens.output ?? 0)}`);
  console.log(`  ${'Favorite Model'.padEnd(20)} ${chalk.dim(report.favoriteModel)}`);
  console.log(`  ${'Last Active'.padEnd(20)} ${chalk.dim(report.lastActive ?? 'unknown')}`);

  if (Object.keys(report.modelUsage).length) {
    console.log('\n' + chalk.bold('  Model Breakdown'));
    const total = Object.values(report.modelUsage).reduce((a, b) => a + b, 0);
    const maxVal = Math.max(...Object.values(report.modelUsage));
    for (const [model, count] of Object.entries(report.modelUsage).sort((a, b) => b[1] - a[1])) {
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
      console.log(`  ${model.padEnd(30)} ${asciiBar(count, maxVal, 16)} ${chalk.dim(pct + '%')}`);
    }
  }

  if (Object.keys(report.projects).length) {
    console.log('\n' + chalk.bold('  Projects'));
    const sorted = Object.entries(report.projects).sort((a, b) => (b[1].cost ?? 0) - (a[1].cost ?? 0));
    for (const [name, info] of sorted) {
      console.log(
        `  ${name.padEnd(30)} ${chalk.green(fmtCost(info.cost ?? 0).padEnd(10))} ${chalk.dim((info.sessions ?? 0) + ' sessions')}`
      );
    }
  }

  if (report.daily.length) {
    console.log('\n' + chalk.bold('  Daily Cost (last 30 days)'));
    const maxCost = Math.max(...report.daily.map(d => d.cost ?? 0));
    for (const entry of report.daily.slice(-14)) {
      const bar = asciiBar(entry.cost ?? 0, maxCost, 24);
      console.log(`  ${chalk.dim(entry.date)}  ${bar}  ${chalk.green(fmtCost(entry.cost ?? 0))}`);
    }
  }

  console.log('');
}

function importData(filePath, data) {
  let incoming;
  try {
    incoming = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(chalk.red(`  Failed to read import file: ${err.message}`));
    process.exit(1);
  }

  const devData = incoming.developer ?? incoming;
  if (!devData.name) {
    console.error(chalk.red('  Import file must include a "name" field (or "developer.name").'));
    process.exit(1);
  }

  const existing = data.developers ?? [];
  const idx = existing.findIndex(d => d.name.toLowerCase() === devData.name.toLowerCase());

  if (idx >= 0) {
    existing[idx] = devData;
    console.log(chalk.yellow(`  Updated existing entry for: ${devData.name}`));
  } else {
    existing.push(devData);
    console.log(chalk.green(`  Added new developer: ${devData.name}`));
  }

  const updated = {
    developers: existing,
    lastUpdated: new Date().toISOString(),
  };

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  console.log(chalk.dim(`  Saved to ${DATA_FILE}\n`));
}

export function createCommand(argv) {
  const program = new Command();

  program
    .name('claude-team-dashboard')
    .description('Team-wide Claude Code analytics dashboard')
    .version('1.0.0');

  program
    .command('start')
    .description('Start the web dashboard on localhost:4321')
    .option('-p, --port <port>', 'Port to listen on', '4321')
    .action(async opts => {
      const port = parseInt(opts.port, 10);
      console.log(chalk.blue(`\n  Starting Claude Team Dashboard on http://localhost:${port}\n`));
      startServer(port);
      console.log(chalk.dim(`  Data file: ${DATA_FILE}`));
      console.log(chalk.dim('  Press Ctrl+C to stop.\n'));
    });

  program
    .command('report <dev>')
    .description('Generate a per-developer usage report')
    .action(devName => {
      const data = loadData();
      printDevReport(devName, data);
    });

  program
    .command('import <file>')
    .description('Import developer usage data (JSON)')
    .action(filePath => {
      const data = loadData();
      importData(filePath, data);
    });

  program
    .command('summary')
    .description('Print team summary to terminal')
    .action(() => {
      const data = loadData();
      printTeamSummary(data);
    });

  program.parse(argv);
}
