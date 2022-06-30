const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "movies.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server is Running at http://localhost:5000");
    });
  } catch (error) {
    console.log(`DB Error ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/details/", async (request, response) => {
  const getDetailsQuery = `SELECT * FROM details`;
  const detailsArray = await db.all(getDetailsQuery);
  response.send(detailsArray);
});

app.post("/details/", async (request, response) => {
  const { name, img, summary } = request.body;
  const postQuery = `INSERT INTO details
  (name,img,summary)
  VALUES('${name}','${img}','${summary}')`;

  await db.run(postQuery);
  response.send("Query Posted");
});

app.put("/detail/:id", async (request, response) => {
  const { id } = request.params;
  const { name, img, summary } = request.body;
  const UpdateQuery = `UPDATE details
    SET 
    name = '${name}',
    img = '${img}',
    summary ='${summary}'
    WHERE id =${id}`;
  await db.run(UpdateQuery);
  response.send("Details Updated");
});

app.delete("/detail/:id", async (request, response) => {
  const { id } = request.params;
  const DeleteQuery = `
    DELETE FROM details
    WHERE id = ${id};
    `;
  await db.run(DeleteQuery);
  response.send("Details Deleted");
});
