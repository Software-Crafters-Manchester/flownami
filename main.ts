// @ts-types="npm:@types/express"
import express from "npm:express";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (_req, res) {
  res.render("pages/index");
});

type Task = {
  name: string;
  id: string;
};

type TaskGroup = {
  name: string,
  tasks: Task[],
};

type TaskDb = TaskGroup[];

type Column = {
  name: string;
  tasks: Array<Task>;
};

app.get("/board", async function (_req, res) {
  const columns = await readTasks();
  res.render("pages/board", { columns });
});

async function getTaskById(tasks: TaskDb, taskId)  {
  for (var idx = 0; idx < tasks.length; idx++){
    for (var iidx = 0; iidx < tasks[idx].tasks.length; iidx++) {
      const task = tasks[idx].tasks[iidx];
      if (task.id == taskId) 
        return task;
    }
  }
  return null;
}

async function updateTaskById(tasks: TaskDb, taskId: string, updateFn)  {
  for (var idx = 0; idx < tasks.length; idx++){
    for (var iidx = 0; iidx < tasks[idx].tasks.length; iidx++) {
      const task = tasks[idx].tasks[iidx];
      if (task.id == taskId) 
      {
        updateFn(task);
        return true;
      }
    }
  }
  return false;
}

async function deleteTaskById(tasks: TaskDb, taskId: string)  {
  for (var idx = 0; idx < tasks.length; idx++){
    for (var iidx = 0; iidx < tasks[idx].tasks.length; iidx++) {
      const task = tasks[idx].tasks[iidx];
      if (task.id == taskId) 
      {
        tasks[idx].tasks.splice(iidx, 1);
        return true;
      }
    }
  }
  return false;
}

async function writeTasks(tasks: TaskDb) {
  await Deno.writeTextFile("./data.json", JSON.stringify(tasks));
}

async function readTasks() {
  const data = await Deno.readTextFile("./data.json");
  return JSON.parse(data);
}

app.get("/tasks/new", (_req, res) => {
  res.render("pages/create");
});
app.post("/tasks", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = { name: taskName, id: crypto.randomUUID() };

  const columns = await readTasks();

  columns[0].tasks.push(newTask);

  await writeTasks(columns);

  res.redirect("/board");
});

if (import.meta.main) {
  const port = Deno.env.get("PORT") || 8080;
  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

export default app;
