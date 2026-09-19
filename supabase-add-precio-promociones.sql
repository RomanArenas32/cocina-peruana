-- Agregar columna precio a la tabla promociones
ALTER TABLE promociones ADD COLUMN IF NOT EXISTS precio numeric(10,2) DEFAULT NULL;
