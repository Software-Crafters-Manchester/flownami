// @ts-types="npm:@types/express"
import express from "npm:express";
import { exists } from "jsr:@std/fs/exists";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));

app.use(express.urlencoded({ extended: true }));

app.get("/", function (_, res) {
  res.render("pages/index");
});

const boardData = await initBoardData(
  "./database/data.json",
  "./database/init.json",
);

type Column = {
  name: string;
  tasks: Array<Task>;
};

type Task = {
  name: string;
};

app.get("/board", function (_req, res) {
  const columns: Array<Column> = boardData;
  res.render("pages/board", { columns });
});

app.get("/tasks/new", function (_req, res) {
  res.render("pages/tasks/new");
});

app.post("/task", function (req, res) {
  const taskName: string = req.body.tname;
  if (taskName) {
    const toDoColumn = boardData.find((col) => col.name === "To Do");
    toDoColumn?.tasks.push({ name: taskName });
    Deno.writeTextFile("./database/data.json", JSON.stringify(boardData));
  }
  res.redirect("/board");
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server running at http://localhost:${port}`);

async function initBoardData(
  dataPath: string,
  initPath: string,
): Promise<Column[]> {
  let boardData: Column[];
  if (await exists(dataPath, { isFile: true })) {
    boardData = JSON.parse(await Deno.readTextFile(dataPath));
  } else {
    boardData = JSON.parse(await Deno.readTextFile(initPath));
  }
  return boardData;
}
