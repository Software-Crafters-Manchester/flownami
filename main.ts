// @ts-types="npm:@types/express"
import express from "npm:express";
import { readTasks, writeTasks } from "./data/tasksStore.ts";
import { generateBoard } from "./services/boardService.ts";
import { createTask } from "./services/taskService.ts";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (_req, res) {
  res.render("pages/index");
});

app.get("/board", async function (_req, res) {
  const tasks = await readTasks();
  const columns = generateBoard(tasks);

  res.render("pages/board", { columns });
});

app.get("/tasks/new", (_req, res) => {
  res.render("pages/create");
});

app.post("/tasks", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = createTask(taskName);


  const tasks = await readTasks();

  tasks.push(newTask);

  await writeTasks(tasks);

  res.redirect("/board");
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
