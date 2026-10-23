const { run, get, all } = require('../db/database');

// Capa de acceso a datos: solo SQL parametrizado, sin reglas de negocio.
const COLUMNAS = 'id, nombre, especie, raza, fecha_nacimiento, peso_kg, creado_en';

const findAll = () => all(`SELECT ${COLUMNAS} FROM mascotas ORDER BY id`);

const findById = (id) => get(`SELECT ${COLUMNAS} FROM mascotas WHERE id = ?`, [id]);

const create = async ({ nombre, especie, raza, fecha_nacimiento, peso_kg }) => {
  const { lastID } = await run(
    `INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, peso_kg)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, especie, raza, fecha_nacimiento, peso_kg]
  );
  return findById(lastID);
};

const update = async (id, { nombre, especie, raza, fecha_nacimiento, peso_kg }) => {
  await run(
    `UPDATE mascotas
        SET nombre = ?, especie = ?, raza = ?, fecha_nacimiento = ?, peso_kg = ?
      WHERE id = ?`,
    [nombre, especie, raza, fecha_nacimiento, peso_kg, id]
  );
  return findById(id);
};

const remove = async (id) => {
  const { changes } = await run('DELETE FROM mascotas WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = { findAll, findById, create, update, remove };
