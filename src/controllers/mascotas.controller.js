const service = require('../services/mascotas.service');

// Capa HTTP: lee req, llama al servicio y decide el código de estado.
// Los errores se delegan al middleware de errores de app.js con next(err).
const listar = async (req, res, next) => {
  try {
    res.status(200).json(await service.listar());
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    res.status(200).json(await service.obtener(req.params.id));
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    res.status(201).json(await service.crear(req.body));
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    res.status(200).json(await service.actualizar(req.params.id, req.body));
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    await service.eliminar(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
