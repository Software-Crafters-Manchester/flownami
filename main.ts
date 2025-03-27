// @ts-types="npm:@types/express"
import express from "npm:express";
import { readTasks, writeTasks } from "./data/tasksStore.ts";
import { Task } from "./data/task.ts";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (_req, res) {
  res.render("pages/index");
});

type Column = {
  name: string;
  tasks: Array<Task>;
};

app.get("/board", async function (_req, res) {
  const tasks = await readTasks();
  const columns: Array<Column> = [
    {
      name: "To Do",
      tasks,
    },
    {
      name: "Doing",
      tasks: [
        {
          name: "In progress...",
        },
      ],
    },
    {
      name: "Done",
      tasks: [
        {
          name: "Finished this one",
        },
        {
          name: "And this one",
        },
        {
          name: "Crikey,",
        },
        {
          name: "Wasn't I...",
        },
        {
          name: "Productive!",
        },
      ],
    },
  ];

  res.render("pages/board", { columns });
});

app.get("/tasks/new", (_req, res) => {
  res.render("pages/create");
});

app.post("/tasks", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = { name: taskName };

  const tasks = await readTasks();

  tasks.push(newTask);

  await writeTasks(tasks);

  res.redirect("/board");
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
