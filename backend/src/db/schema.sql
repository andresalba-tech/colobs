-- ================================================================
-- Observatorio Colombiano del Mercado Laboral Tecnológico
-- Esquema de Base de Datos (SQLite / Cloudflare D1 Compatible)
-- ================================================================

-- Tabla de Vacantes Individuales
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_job_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    country TEXT DEFAULT 'CO',
    apply_method TEXT,
    url TEXT,
    company_url TEXT,
    published_at TEXT NOT NULL,       -- ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ)
    published_date TEXT NOT NULL,     -- YYYY-MM-DD para agrupaciones temporales
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1
);

-- Catálogo de Tecnologías y Roles
CREATE TABLE IF NOT EXISTS technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL            -- 'language', 'frontend', 'backend', 'ai', 'role'
);

-- Relación N:M Vacantes <-> Tecnologías
CREATE TABLE IF NOT EXISTS job_technologies (
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    technology_id INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, technology_id)
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_jobs_published_date ON jobs(published_date);
CREATE INDEX IF NOT EXISTS idx_jobs_external_id ON jobs(external_job_id);
CREATE INDEX IF NOT EXISTS idx_job_tech_tech_id ON job_technologies(technology_id);
CREATE INDEX IF NOT EXISTS idx_job_tech_job_id ON job_technologies(job_id);

-- Eventos de Analítica Propia (Sección 15 del Plan Maestro)
CREATE TABLE IF NOT EXISTS visitor_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    series_selected TEXT,
    period_selected TEXT,
    created_at TEXT NOT NULL
);

-- Contactos Profesionales Voluntarios (Sección 18 del Plan Maestro)
CREATE TABLE IF NOT EXISTS visitor_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    role TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    comment TEXT,
    created_at TEXT NOT NULL
);
