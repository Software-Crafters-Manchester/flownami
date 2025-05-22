import { TaskRepo } from "../data.ts";
import { Task } from "./Task.ts";

export async function addNewTask(taskName: string, taskRepo: TaskRepo) {
  const newTask = { id: crypto.randomUUID(), name: taskName, column: "To Do" };

  const tasks = await taskRepo.readTasks();

  tasks.push(newTask);

  await taskRepo.writeTasks(tasks);
}

export async function findTaskById(id: string, taskRepo: TaskRepo) {
  const tasks = await taskRepo.readTasks();
  const task = tasks.find((task: Task) => task.id === id);
  return task;
}

export async function updateTask(updatedTask: Task, taskRepo: TaskRepo) {
  const tasks = await taskRepo.readTasks();

  const currentTaskIndex = tasks.findIndex((t: Task) =>
    t.id === updatedTask.id
  );

  tasks[currentTaskIndex] = updatedTask;

  await taskRepo.writeTasks(tasks);
}

export async function removeTask(id: string, taskRepo: TaskRepo) {
  const tasks = await taskRepo.readTasks();

  const updatedTasks = tasks.filter((t: Task) => t.id != id);

  await taskRepo.writeTasks(updatedTasks);
}
