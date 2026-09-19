-- Agregar columna opciones (variantes) a platos, plato_dia y promociones
ALTER TABLE platos      ADD COLUMN IF NOT EXISTS opciones jsonb DEFAULT NULL;
ALTER TABLE plato_dia   ADD COLUMN IF NOT EXISTS opciones jsonb DEFAULT NULL;
ALTER TABLE promociones ADD COLUMN IF NOT EXISTS opciones jsonb DEFAULT NULL;
