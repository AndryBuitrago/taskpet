const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = path.resolve(process.env.DB_FILE || './data/app.db');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

// Conexión única y centralizada: todos los repositorios importan este módulo.
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('No se pudo abrir la base de datos:', err.message);
    process.exit(1);
  }
});

// Versiones con Promesas de run / get / all.
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

// Crea las tablas ejecutando schema.sql.
const initDb = () =>
  new Promise((resolve, reject) => {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });

module.exports = { db, run, get, all, initDb };
