const { Pool } = require("pg");

const pool = new Pool({
  user: "mario",
  host: "localhost",
  database: "repertorio",
  password: "1234",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
});

const insertar = async (datos) => {
  const consulta = {
    text: "INSERT INTO repertorio (cancion, artista, tono) VALUES ($1,$2,$3) RETURNING *;",
    values: datos,
  };
  try {
    const result = await pool.query(consulta);
    console.log("Datos insertados correctamente", result.rows[0]);
    return result;
  } catch (error) {
    console.log("Codigo de error", error.code);
    return error;
  }
};

const consultar = async () => {
  try {
    const result = await pool.query("SELECT * FROM repertorio");
    return result;
  } catch (error) {
    console.log("Codigo de error", error.code);
    return error;
  }
};

const editar = async (datos) => {
  const consulta = {
    text: `UPDATE repertorio SET 
              cancion = $1, 
              artista = $2, 
              tono = $3 
              WHERE artista = $2 RETURNING *;`,
    values: datos,
  };
  try {
    const result = await pool.query(consulta);
    console.log(result.rows[0]);
    return result;
  } catch (error) {
    console.log("Codigo de error", error.code);
    return error;
  }
};

const eliminar = async (id) => {
  try {
    const result = await pool.query(`DELETE FROM repertorio WHERE id = ${id}`);
    return result;
  } catch (error) {
    console.log("Codigo de error", error.code);
    return error;
  }
};
module.exports = { insertar, consultar, editar, eliminar };
