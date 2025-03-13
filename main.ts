// @ts-types="npm:@types/express"
import express from "npm:express";
import bodyParser from "npm:body-parser"
import { readTasks, writeTasks } from "./data/tasksStore.ts";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (_, res) {
  res.render("pages/index");
});

type Column = {
  name: string;
  tasks: Array<Task>;
};

export type Task = {
  name: string;
};

app.get("/board", function (_req, res) {
  const columns: Array<Column> = [
    {
      name: "To Do",
      tasks: [
        {
          name: "Task 1",
        },
        {
          name: "Task 2",
        },
        {
          name: "Task 3",
        },
      ],
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

app.get("/create", (req, res) => {
  res.render('pages/create');
});

app.post("/task", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = { name: taskName };

  const tasks = await readTasks();

  tasks.push(newTask);

  await writeTasks(tasks);

  res.redirect('/board');
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);

