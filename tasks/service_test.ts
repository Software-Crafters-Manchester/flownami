import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { addNewTask } from "./service.ts";
import { TaskRepo } from "../data.ts";
import { Task } from "./Task.ts";

Deno.test("Add a Task to the repository", async () => {
  const fakeTasks: Task[] = [];

  const readTasksSpy = spy(() => fakeTasks);
  const writeTasksSpy = spy(() => Promise.resolve());

  const taskRepo = {
    writeTasks: writeTasksSpy,
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  await addNewTask("New Test Task", taskRepo);

  assertSpyCalls(writeTasksSpy, 1);
});
