import { Task } from "./task/Task.ts";

export async function writeTasks(tasks: Task[]) {
  await Deno.writeTextFile("./data.json", JSON.stringify(tasks));
}
export async function readTasks() {
  const data = await Deno.readTextFile("./data.json");
  return JSON.parse(data);
}
