-- Tabla de configuración del negocio (fila única)
CREATE TABLE IF NOT EXISTS config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  horarios text,
  direccion text,
  descripcion_negocio text,
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "config_lectura_publica"
  ON config FOR SELECT
  USING (true);

-- Escritura solo autenticados
CREATE POLICY "config_escritura_autenticada"
  ON config FOR ALL
  USING (auth.role() = 'authenticated');

-- Insertar fila inicial vacía (se edita, nunca se crea otra)
INSERT INTO config (horarios, direccion, descripcion_negocio)
VALUES (null, null, null)
ON CONFLICT DO NOTHING;
