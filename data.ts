import { Task } from "./tasks/Task.ts";

export interface TaskRepo {
  writeTasks(tasks: Task[]): Promise<void>;
  readTasks(): Promise<Task[]>;
}

export const JSONTaskRepo: TaskRepo = {
  writeTasks: async function (tasks: Task[]) {
    await Deno.writeTextFile("./data.json", JSON.stringify(tasks));
  },
  readTasks: async function () {
    const data = await Deno.readTextFile("./data.json");
    return JSON.parse(data);
  },
};

export async function writeTasks(tasks: Task[]) {
  await Deno.writeTextFile("./data.json", JSON.stringify(tasks));
}

export async function readTasks() {
  const data = await Deno.readTextFile("./data.json");
  return JSON.parse(data);
}
