-- Script controlado de inicialización (idempotente: se puede ejecutar muchas veces)
CREATE TABLE IF NOT EXISTS mascotas (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre           TEXT    NOT NULL,
  especie          TEXT    NOT NULL,
  raza             TEXT,
  fecha_nacimiento TEXT,
  peso_kg          REAL,
  creado_en        TEXT    NOT NULL DEFAULT (datetime('now'))
);
