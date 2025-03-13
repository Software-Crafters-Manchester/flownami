// @ts-types="npm:@types/express"
import express from "npm:express";

const app = express();

const filePath = "./database.json";

const jsonText = await Deno.readTextFile(filePath);
const data = JSON.parse(jsonText);

app.set("view engine", "ejs");

app.use(express.static("static"));

app.use(express.urlencoded({ extended: true }));

app.get("/", function (_, res) {
  res.render("pages/index");
});

type Column = {
  name: string;
  tasks: Array<Task>;
};

type Task = {
  name: string;
};

app.get("/board", function (_req, res) {
  const columns: Array<Column> = data
  res.render("pages/board", { columns });
});

app.get("/create", function (_req, res){
  res.render("pages/create")
})

app.post("/create", function(_req, res){
  const toDo = data.find((column: Column) => column.name === "To Do")
  const newTask = _req.body.task
  toDo.tasks.push({name: newTask})
  Deno.writeTextFile(filePath, JSON.stringify(data))
  res.redirect("/board")
})

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
