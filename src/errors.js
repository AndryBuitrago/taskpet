// Errores de dominio: el servicio los lanza y el controlador los traduce a códigos HTTP.
class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = { ValidationError, NotFoundError };
