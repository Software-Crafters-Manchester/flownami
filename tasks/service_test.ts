import {
  assertSpyCallAsync,
  assertSpyCalls,
  spy,
  stub,
} from "jsr:@std/testing/mock";
import { addNewTask } from "./service.ts";
import { TaskRepo } from "../data.ts";
import { Task } from "./Task.ts";
import { UUID } from "node:crypto";

Deno.test("Add a Task to the repository", async () => {
  const fakeTasks: Task[] = [];

  const readTasksSpy = spy(() => fakeTasks);
  const writeTasksSpy = spy(() => Promise.resolve());
  const randomUuidStub = stub(crypto, "randomUUID", () => "some-id" as UUID);

  const taskRepo = {
    writeTasks: writeTasksSpy,
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  await addNewTask("New Test Task", taskRepo);

  const newTask: Task = {
    id: "some-id",
    name: "New Test Task",
    column: "To Do",
  };
  const expectedTasks: Task[] = [
    newTask,
  ];

  assertSpyCallAsync(writeTasksSpy, 0, { args: [expectedTasks] });
  randomUuidStub.restore();
});
