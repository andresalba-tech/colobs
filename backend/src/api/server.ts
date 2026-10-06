import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { db, initDatabase } from '../db/database.js';
import { Router } from './router.js';

// Repositorios (Infraestructura / Persistencia)
import { SqliteJobsRepository } from '../infrastructure/repositories/sqlite_jobs.repository.js';
import { SqliteTechnologyRepository } from '../infrastructure/repositories/sqlite_technology.repository.js';
import { SqliteAnalyticsRepository } from '../infrastructure/repositories/sqlite_analytics.repository.js';
import { SqliteVisitorRepository } from '../infrastructure/repositories/sqlite_visitor.repository.js';

// Servicios (Casos de uso / Lógica de dominio)
import { StatsService } from '../application/services/stats.service.js';
import { AnalyticsService } from '../application/services/analytics.service.js';
import { VisitorService } from '../application/services/visitor.service.js';

// Controladores (Adaptadores de transporte HTTP)
import { StatsController } from './controllers/stats.controller.js';
import { AnalyticsController } from './controllers/analytics.controller.js';
import { VisitorController } from './controllers/visitor.controller.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'colobs_secret_2026';

// 1. Inicializar esquema de base de datos
initDatabase();

// 2. Inyección de Dependencias (Composition Root - DIP)
const jobsRepository = new SqliteJobsRepository(db);
const techRepository = new SqliteTechnologyRepository(db);
const analyticsRepository = new SqliteAnalyticsRepository(db);
const visitorRepository = new SqliteVisitorRepository(db);

const statsService = new StatsService(jobsRepository);
const analyticsService = new AnalyticsService(techRepository, analyticsRepository);
const visitorService = new VisitorService(visitorRepository);

const statsController = new StatsController(statsService);
const analyticsController = new AnalyticsController(analyticsService);
const visitorController = new VisitorController(visitorService, ADMIN_API_KEY);

// 3. Configurar Enrutador desacoplado (OCP / SRP)
export const router = new Router();

// Endpoints del Observatorio
router.get('/api/health', statsController.getHealth);
router.get('/api/stats', statsController.getStats);
router.get('/api/series', analyticsController.getSeries);
router.get('/api/timeline', analyticsController.getTimeline);
router.get('/api/summary', analyticsController.getSummary);
router.post('/api/events', visitorController.recordEvent);
router.post('/api/contact', visitorController.recordContact);
router.get('/api/admin/visitor-report', visitorController.getVisitorReport);

// 4. Instancia del servidor HTTP nativo
export const server = http.createServer((req, res) => {
  router.dispatch(req, res);
});

// Arrancar el servidor si este script es el punto de entrada directo
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  server.listen(PORT, () => {
    console.log(`🚀 Observatorio Tech Colombia - Backend API escuchando en http://localhost:${PORT}`);
  });
}
