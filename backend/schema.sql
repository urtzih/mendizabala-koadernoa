-- ============================================================================
-- MENDIZABALA LHII - Schema PostgreSQL
-- Base de datos 100% Open Source
-- ============================================================================

-- Crear extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLA: teachers (Profesores)
-- ============================================================================
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  substitute_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teachers_email ON teachers(email);

-- ============================================================================
-- TABLA: companies (Empresas)
-- ============================================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  assigned_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'orange' CHECK (status IN ('green', 'orange', 'red')),
  demand_dual1 INTEGER DEFAULT 0,
  demand_dual_general INTEGER DEFAULT 0,
  demand_dual_intensive INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_teacher ON companies(assigned_teacher_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_name ON companies(name);

-- ============================================================================
-- VISTA: companies_with_teacher
-- ============================================================================
CREATE VIEW companies_with_teacher AS
SELECT 
  c.id,
  c.name,
  c.location,
  c.contact_person,
  c.email,
  c.phone,
  c.website,
  c.assigned_teacher_id,
  c.status,
  c.demand_dual1,
  c.demand_dual_general,
  c.demand_dual_intensive,
  t.name as teacher_name,
  t.email as teacher_email,
  c.created_at,
  c.updated_at
FROM companies c
LEFT JOIN teachers t ON c.assigned_teacher_id = t.id;

-- ============================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_teachers_timestamp
BEFORE UPDATE ON teachers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_companies_timestamp
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- DATOS INICIALES (OPCIONAL - comentar en producción)
-- ============================================================================

-- Profesores de ejemplo
INSERT INTO teachers (email, name, substitute_name) VALUES
  ('juan.garcia@mendizabala.eus', 'Juan García', 'JG'),
  ('maria.lopez@mendizabala.eus', 'María López', 'ML'),
  ('carlos.martin@mendizabala.eus', 'Carlos Martín', 'CM')
ON CONFLICT (email) DO NOTHING;

-- Empresas de ejemplo
INSERT INTO companies (name, location, contact_person, email, phone, website, status) VALUES
  ('Acme Corporation', 'Vitoria-Gasteiz', 'Pedro López', 'contacto@acme.es', '+34 123 456 789', 'https://acme.es', 'green'),
  ('TechStart SL', 'Bilbao', 'Ana García', 'info@techstart.es', '+34 987 654 321', 'https://techstart.es', 'orange'),
  ('Empresa 3D', 'Gasteiz', 'Mikel Sanz', 'contacto@empresa3d.es', '+34 555 666 777', 'https://empresa3d.es', 'orange')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INFORMACIÓN DE RECUPERACIÓN
-- ============================================================================
/*
Para restaurar esta base de datos desde el archivo:
  psql -U postgres -d mendizabala -f schema.sql

Para respaldar:
  pg_dump -U postgres mendizabala > backup.sql

Credenciales por defecto (cambiar en producción):
  Usuario: postgres
  Host: localhost
  Puerto: 5432
*/
