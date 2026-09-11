-- Permitir a usuarios autenticados subir imágenes
create policy "Autenticados pueden subir imagenes"
  on storage.objects for insert
  with check (
    bucket_id = 'imagenes'
    and auth.role() = 'authenticated'
  );

-- Permitir a usuarios autenticados actualizar (upsert)
create policy "Autenticados pueden actualizar imagenes"
  on storage.objects for update
  using (
    bucket_id = 'imagenes'
    and auth.role() = 'authenticated'
  );

-- Permitir a todos leer las imágenes (para la landing)
create policy "Lectura publica de imagenes"
  on storage.objects for select
  using (bucket_id = 'imagenes');
