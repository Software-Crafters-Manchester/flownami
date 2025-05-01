import { spy } from "@std/testing/mock";
import { Task } from "./Task.ts";
import { addNewTask } from "./service.ts";
import { TaskRepo } from "../data.ts";
import { assert } from "@std/assert";

Deno.test("test add new task", async () => {
  const fakeTask: Task = {
    id: "some-id",
    name: "Some Name",
    column: "To Do",
  };

  const fakeTasks: Task[] = [fakeTask];

  const readTasksSpy = spy(() => fakeTasks);
  const writeTasksSpy = spy(() => fakeTasks);

  const taskRepo = {
    readTasks: readTasksSpy,
    writeTasks: writeTasksSpy,
  } as unknown as TaskRepo;

  const _result = await addNewTask(taskRepo, "some-id-2");

  assert(
    fakeTasks.some((item) => item.name === "some-id-2"),
    "Expected array to contain an item with name 'some-id-2'",
  );
});
