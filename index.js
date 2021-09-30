const http = require("http");
const fs = require("fs");
const url = require("url");
const { insertar, consultar, editar, eliminar } = require("./consultas");

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method === "GET") {
      res.setHeader("content-type", "text/html");
      const html = fs.readFileSync("index.html", "utf-8");
      res.end(html);
    }
    /*    1. Crear una ruta POST /cancion que reciba los datos correspondientes a una canción y
    realice  a través de una función asíncrona la inserción en la tabla repertorio.
    */
    if (req.url == "/cancion" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const respuesta = await insertar(datos);
        res.end(JSON.stringify(respuesta));
      });
    }

    /* 2. Crear una ruta GET /canciones que devuelva un JSON con los registros de la tabla
    repertorio. */

    if (req.url == "/canciones" && req.method === "GET") {
      const registros = await consultar();
      //res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(registros.rows));
    }

    /*3. Crear una ruta PUT /cancion que reciba los datos de una canción que se desea
editar, ejecuta una función asíncrona para hacer la consulta SQL correspondiente y
actualice ese registro de la tabla repertorio.
 */
    if (req.url == "/cancion" && req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const respuesta = await editar(datos);
        res.end(JSON.stringify(respuesta));
      });
    }

    /*     4. Crear una ruta DELETE /cancion que reciba por queryString el id de una canción y
    realiza una consulta SQL a través de una función asíncrona para eliminarla de la
    base de datos.
 */
    if (req.url.startsWith("/cancion?") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;

      const respuesta = await eliminar(id);
      res.end(JSON.stringify(respuesta));
    }
  })
  .listen(3000, console.log("SERVIDOR ON EN PUERTO 3000"));
