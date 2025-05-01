// @ts-types="npm:@types/express"
import express from "npm:express";
import { readTasks, writeTasks } from "../data.ts";
import { Task } from "./Task.ts";

const tasksRouter = express();

tasksRouter.get("/new", (_req, res) => {
  res.render("tasks/new");
});

tasksRouter.post("/", async (req, res) => {
  const taskName = req.body.taskName;

  const newTask = { id: crypto.randomUUID(), name: taskName, column: "To Do" };

  const tasks = await readTasks();

  tasks.push(newTask);

  await writeTasks(tasks);

  res.redirect("/board");
});

tasksRouter.get("/:id/edit", async (req, res) => {
  const tasks = await readTasks();

  const task = tasks.find((task: Task) => task.id === req.params.id);

  res.render("tasks/edit", { task });
});

tasksRouter.put("/:id", async (req, res) => {
  const tasks = await readTasks();

  const updatedTask: Task = req.body;

  const currentTaskIndex = tasks.findIndex((t: Task) =>
    t.id === updatedTask.id
  );
  tasks[currentTaskIndex] = updatedTask;

  await writeTasks(tasks);

  res.sendStatus(204);

  return;
});

tasksRouter.delete("/:id", async (req, res) => {
  const tasks = await readTasks();

  const id = req.params.id;

  const updatedTasks = tasks.filter((t: Task) => t.id != id);

  await writeTasks(updatedTasks);

  res.sendStatus(204);

  return;
});

export default tasksRouter;
