import { readTasks, writeTasks } from "../data.ts";
import { Task } from "./Task.ts";
import { TaskRepo } from "../data.ts";

export async function addNewTask(taskRepo: TaskRepo, taskName: string) {
  const newTask = { id: crypto.randomUUID(), name: taskName, column: "To Do" };

  const tasks = await taskRepo.readTasks();

  tasks.push(newTask);

  await taskRepo.writeTasks(tasks);
}

export async function findTaskById(id: string) {
  const tasks = await readTasks();
  const task = tasks.find((task: Task) => task.id === id);
  return task;
}

export async function updateTask(updatedTask: Task) {
  const tasks = await readTasks();

  const currentTaskIndex = tasks.findIndex((t: Task) =>
    t.id === updatedTask.id
  );

  tasks[currentTaskIndex] = updatedTask;

  await writeTasks(tasks);
}

export async function removeTask(id: string) {
  const tasks = await readTasks();

  const updatedTasks = tasks.filter((t: Task) => t.id != id);

  await writeTasks(updatedTasks);
}
