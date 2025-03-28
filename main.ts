// @ts-types="npm:@types/express"
import express from "npm:express";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use('/scripts', express.static("scripts", {setHeader: function (res, path, stat) {
  res.type('application/javascript');
}}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (_req, res) {
  res.render("pages/index");
});

type Task = {
  id: string;
  name: string;
  column: string;
};

type Column = {
  name: string;
  tasks: Array<Task>;
};

app.get("/board", async function (_req, res) {
  const columns = await readTasks();
  res.render("pages/board", { columns });
});

app.get("/tasks/new", (_req, res) => {
  res.render("pages/create");
});

async function writeTasks(tasks: Column[]) {
  await Deno.writeTextFile("./data.json", JSON.stringify(tasks));
}

async function readTasks() {
  const data = await Deno.readTextFile("./data.json");
  return JSON.parse(data);
}

app.post("/tasks", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = { id: crypto.randomUUID(), name: taskName, column: "To Do" };

  const columns = await readTasks();

  columns[0].tasks.push(newTask);

  await writeTasks(columns);

  res.redirect("/board");
});

app.get("/tasks/:id/edit", async (req, res) => {
  let columns = await readTasks();

  let task = columns.reduce((tasks, column) => {
    tasks.push(column.tasks);
    return tasks;
  }, [])
  .flat()
  .find((task) => task.id === req.params.id);

  res.render("pages/task/edit", { task });
});

app.put("/tasks/:id", async (req, res) => {
  let columns = await readTasks();
  let tasks = columns.reduce((tasks, column) => {
    tasks.push(column.tasks);
    return tasks;
  }, [])
  .flat()

  let updatedTask = req.body;

  let currentTaskIndex = tasks.findIndex((t) => t.id === updatedTask.id);
  tasks[currentTaskIndex] = updatedTask;

  let todoTasks: Task[] = tasks.filter((t) => t.column === "To Do");
  let doingTasks: Task[] = tasks.filter((t) => t.column === "Doing");
  let doneTasks: Task[] = tasks.filter((t) => t.column === "Done");
  
  let updatedColumns: Column[] = [
    {name: "To Do", tasks: todoTasks},
    {name: "Doing", tasks: doingTasks},
    {name: "Done", tasks: doneTasks},
  ]

  await writeTasks(updatedColumns);

  return res.sendStatus(204);
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
