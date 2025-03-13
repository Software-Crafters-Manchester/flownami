import { Task } from "./task.ts";

export async function writeTasks(tasks: Task[]) {
  await Deno.writeTextFile("./data/data.json", JSON.stringify(tasks));
}
export async function readTasks() {
  const data = await Deno.readTextFile("./data/data.json");

  const tasks = JSON.parse(data);
  return tasks;
}
