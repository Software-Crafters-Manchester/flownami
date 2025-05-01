// @ts-types="npm:@types/express"
import express from "npm:express";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(
  "/scripts",
  express.static("scripts", {
    setHeaders: function (res, _path, _stat) {
      res.type("application/javascript");
    },
  }),
);
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

type Board = Column[];

app.get("/board", async function (_req, res) {
  const columns = await readTasks();
  res.render("pages/board", { columns });
});

app.get("/tasks/new", (_req, res) => {
  res.render("pages/create");
});

app.post("/tasks", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = { id: crypto.randomUUID(), name: taskName, column: "To Do" };

  const columns = await readTasks();

  columns[0].tasks.push(newTask);

  await writeTasks(columns);

  res.redirect("/board");
});

app.get("/tasks/:id/edit", async (req, res) => {
  const columns = await readTasks();

  const task = columns.reduce((tasks: Task[][], column: Column) => {
    tasks.push(column.tasks);
    return tasks;
  }, [])
    .flat()
    .find((task: Task) => task.id === req.params.id);

  res.render("pages/task/edit", { task });
});

app.put("/tasks/:id", async (req, res) => {
  const columns = await readTasks();
  const tasks: Task[] = columns.reduce((acc: Task[][], column: Column) => {
    acc.push(column.tasks);
    return acc;
  }, [])
    .flat();

  const updatedTask: Task = req.body;

  const currentTaskIndex = tasks.findIndex((t: Task) =>
    t.id === updatedTask.id
  );
  tasks[currentTaskIndex] = updatedTask;

  const updatedColumns = buildBoard(tasks);

  await writeTasks(updatedColumns);

  res.sendStatus(204);

  return;
});

app.delete("/tasks/:id", async (req, res) => {
  const columns = await readTasks();
  const tasks: Task[] = columns.reduce((acc: Task[][], column: Column) => {
    acc.push(column.tasks);
    return acc;
  }, [])
    .flat();

  const id = req.params.id;

  const updatedTasks = tasks.filter((t) => t.id != id);

  const updatedColumns = buildBoard(updatedTasks);

  await writeTasks(updatedColumns);

  res.sendStatus(204);

  return;
});

function buildBoard(tasks: Task[]): Board {
  const todoTasks: Task[] = tasks.filter((t) => t.column === "To Do");
  const doingTasks: Task[] = tasks.filter((t) => t.column === "Doing");
  const doneTasks: Task[] = tasks.filter((t) => t.column === "Done");

  const updatedColumns: Column[] = [
    { name: "To Do", tasks: todoTasks },
    { name: "Doing", tasks: doingTasks },
    { name: "Done", tasks: doneTasks },
  ];
  return updatedColumns;
}

async function writeTasks(tasks: Column[]) {
  await Deno.writeTextFile("./data.json", JSON.stringify(tasks));
}

async function readTasks() {
  const data = await Deno.readTextFile("./data.json");
  return JSON.parse(data);
}

if (import.meta.main) {
  const port = Deno.env.get("PORT") || 8080;
  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

export default app;
