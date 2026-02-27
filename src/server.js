import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadData, aggregateTeam, generateDevReport } from './aggregator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

export function startServer(port = 4321) {
  const app = express();
  app.use(express.json());
  app.use(express.static(PUBLIC_DIR));

  app.get('/api/team', (req, res) => {
    try {
      const data = loadData();
      const aggregated = aggregateTeam(data);
      res.json({ ok: true, data: aggregated, lastUpdated: data.lastUpdated });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.get('/api/dev/:name', (req, res) => {
    try {
      const data = loadData();
      const report = generateDevReport(req.params.name, data);
      if (!report) {
        return res.status(404).json({ ok: false, error: 'Developer not found' });
      }
      res.json({ ok: true, data: report });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.get('/api/raw', (req, res) => {
    try {
      const data = loadData();
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.get('*', (req, res) => {
    res.sendFile(join(PUBLIC_DIR, 'index.html'));
  });

  const server = createServer(app);
  server.listen(port, () => {});
  return server;
}
