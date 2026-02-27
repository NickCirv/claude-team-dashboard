import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const DATA_FILE = join(homedir(), '.claude-team', 'data.json');

export function getDataPath() {
  return DATA_FILE;
}

export function loadData() {
  if (!existsSync(DATA_FILE)) {
    return { developers: [], lastUpdated: null };
  }
  try {
    const raw = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { developers: [], lastUpdated: null };
  }
}

export function aggregateTeam(data) {
  const { developers = [] } = data;

  const totalCost = developers.reduce((sum, dev) => sum + (dev.totalCost ?? 0), 0);
  const totalSessions = developers.reduce((sum, dev) => sum + (dev.sessions ?? 0), 0);
  const totalTokens = developers.reduce((sum, dev) => {
    const t = dev.tokens ?? {};
    return sum + (t.input ?? 0) + (t.output ?? 0);
  }, 0);
  const activeDevs = developers.filter(dev => (dev.sessions ?? 0) > 0).length;

  const modelUsage = {};
  for (const dev of developers) {
    for (const [model, count] of Object.entries(dev.modelUsage ?? {})) {
      modelUsage[model] = (modelUsage[model] ?? 0) + count;
    }
  }

  const projectBreakdown = {};
  for (const dev of developers) {
    for (const [project, info] of Object.entries(dev.projects ?? {})) {
      if (!projectBreakdown[project]) {
        projectBreakdown[project] = { cost: 0, sessions: 0, devs: new Set() };
      }
      projectBreakdown[project].cost += info.cost ?? 0;
      projectBreakdown[project].sessions += info.sessions ?? 0;
      projectBreakdown[project].devs.add(dev.name);
    }
  }

  const topProjects = Object.entries(projectBreakdown)
    .map(([name, info]) => ({
      name,
      cost: info.cost,
      sessions: info.sessions,
      devCount: info.devs.size,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10);

  const timeline = buildTimeline(developers);

  return {
    totalCost,
    totalSessions,
    totalTokens,
    activeDevs,
    totalDevs: developers.length,
    modelUsage,
    topProjects,
    timeline,
    developers: developers.map(dev => ({
      name: dev.name,
      sessions: dev.sessions ?? 0,
      totalCost: dev.totalCost ?? 0,
      tokens: dev.tokens ?? { input: 0, output: 0 },
      favoriteModel: favoriteModel(dev.modelUsage ?? {}),
      lastActive: dev.lastActive ?? null,
    })),
  };
}

function favoriteModel(modelUsage) {
  const entries = Object.entries(modelUsage);
  if (!entries.length) return 'unknown';
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function buildTimeline(developers) {
  const dailyMap = {};

  for (const dev of developers) {
    for (const entry of dev.daily ?? []) {
      const { date, cost } = entry;
      if (!date) continue;
      dailyMap[date] = (dailyMap[date] ?? 0) + (cost ?? 0);
    }
  }

  return Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, cost]) => ({ date, cost }));
}

export function generateDevReport(devName, data) {
  const dev = (data.developers ?? []).find(
    d => d.name.toLowerCase() === devName.toLowerCase()
  );
  if (!dev) return null;

  return {
    name: dev.name,
    sessions: dev.sessions ?? 0,
    totalCost: dev.totalCost ?? 0,
    tokens: dev.tokens ?? { input: 0, output: 0 },
    modelUsage: dev.modelUsage ?? {},
    favoriteModel: favoriteModel(dev.modelUsage ?? {}),
    projects: dev.projects ?? {},
    daily: (dev.daily ?? []).slice(-30),
    lastActive: dev.lastActive ?? null,
  };
}
