const repo = require('../repositories/mascotas.repository');
const { ValidationError, NotFoundError } = require('../errors');

// Capa de negocio: valida y normaliza ANTES de llamar al repositorio.
const ESPECIES = ['perro', 'gato', 'ave', 'conejo', 'hamster', 'pez', 'reptil', 'otro'];

const validarId = (id) => {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ValidationError('El id debe ser un entero positivo');
  }
  return n;
};

// Valida el cuerpo completo de una mascota y devuelve los datos normalizados.
const validarMascota = (data = {}) => {
  const errores = [];
  const nombre = typeof data.nombre === 'string' ? data.nombre.trim() : '';
  const especie = typeof data.especie === 'string' ? data.especie.trim().toLowerCase() : '';

  if (nombre.length < 2 || nombre.length > 50) {
    errores.push('nombre es obligatorio (entre 2 y 50 caracteres)');
  }
  if (!ESPECIES.includes(especie)) {
    errores.push(`especie es obligatoria y debe ser una de: ${ESPECIES.join(', ')}`);
  }

  let raza = null;
  if (data.raza !== undefined && data.raza !== null && data.raza !== '') {
    if (typeof data.raza !== 'string' || data.raza.trim().length > 50) {
      errores.push('raza debe ser texto de máximo 50 caracteres');
    } else {
      raza = data.raza.trim();
    }
  }

  let fecha_nacimiento = null;
  if (data.fecha_nacimiento !== undefined && data.fecha_nacimiento !== null && data.fecha_nacimiento !== '') {
    const f = new Date(data.fecha_nacimiento);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.fecha_nacimiento)) || isNaN(f.getTime())) {
      errores.push('fecha_nacimiento debe tener formato AAAA-MM-DD válido');
    } else if (f > new Date()) {
      errores.push('fecha_nacimiento no puede estar en el futuro');
    } else {
      fecha_nacimiento = data.fecha_nacimiento;
    }
  }

  let peso_kg = null;
  if (data.peso_kg !== undefined && data.peso_kg !== null && data.peso_kg !== '') {
    const p = Number(data.peso_kg);
    if (!Number.isFinite(p) || p <= 0 || p > 200) {
      errores.push('peso_kg debe ser un número mayor a 0 y máximo 200');
    } else {
      peso_kg = p;
    }
  }

  if (errores.length) throw new ValidationError('Datos inválidos', errores);
  return { nombre, especie, raza, fecha_nacimiento, peso_kg };
};

const listar = () => repo.findAll();

const obtener = async (id) => {
  const mascota = await repo.findById(validarId(id));
  if (!mascota) throw new NotFoundError(`No existe una mascota con id ${id}`);
  return mascota;
};

const crear = (data) => repo.create(validarMascota(data));

const actualizar = async (id, data) => {
  const n = validarId(id);
  const datos = validarMascota(data);
  if (!(await repo.findById(n))) throw new NotFoundError(`No existe una mascota con id ${id}`);
  return repo.update(n, datos);
};

const eliminar = async (id) => {
  const eliminada = await repo.remove(validarId(id));
  if (!eliminada) throw new NotFoundError(`No existe una mascota con id ${id}`);
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
