import { assertSpyCallAsync, spy, stub } from "jsr:@std/testing/mock";
import { addNewTask, findTaskById, removeTask, updateTask } from "./service.ts";
import { TaskRepo } from "../data.ts";
import { Task } from "./Task.ts";
import { UUID } from "node:crypto";

Deno.test("Add a Task to the repository", async () => {
  const fakeTasks: Task[] = [];

  const readTasksSpy = spy(() => Promise.resolve(fakeTasks));
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

  await assertSpyCallAsync(writeTasksSpy, 0, { args: [expectedTasks] });
  randomUuidStub.restore();
});

Deno.test("Find a task by ID", async () => {
  const newTask: Task = {
    id: "some-id",
    name: "New Test Task",
    column: "To Do",
  };
  const fakeTasks: Task[] = [newTask];

  const readTasksSpy = spy(() => Promise.resolve(fakeTasks));
  const writeTasksSpy = spy(() => Promise.resolve());

  const taskRepo = {
    writeTasks: writeTasksSpy,
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  await findTaskById("some-id", taskRepo);

  await assertSpyCallAsync(readTasksSpy, 0, { args: [], returned: fakeTasks });
});

Deno.test("Update a Task", async () => {
  const newTask: Task = {
    id: "some-id",
    name: "New Test Task",
    column: "To Do",
  };
  const fakeTasks: Task[] = [newTask];

  const readTasksSpy = spy(() => Promise.resolve(fakeTasks));
  const writeTasksSpy = spy(() => Promise.resolve());

  const taskRepo = {
    writeTasks: writeTasksSpy,
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  await findTaskById("some-id", taskRepo);

  await assertSpyCallAsync(readTasksSpy, 0, { args: [], returned: fakeTasks });
});

Deno.test("Update a Task", async () => {
  const newTask: Task = {
    id: "some-id",
    name: "New Test Task",
    column: "To Do",
  };
  const fakeTasks: Task[] = [newTask];

  const readTasksSpy = spy(() => Promise.resolve(fakeTasks));
  const writeTasksSpy = spy(() => Promise.resolve());

  const taskRepo = {
    writeTasks: writeTasksSpy,
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  const updatedTask: Task = {
    id: "some-id",
    name: "New Test Task Updated",
    column: "To Do",
  };
  await updateTask(updatedTask, taskRepo);

  await assertSpyCallAsync(writeTasksSpy, 0, {
    args: [[updatedTask]],
  });
});

Deno.test("Remove a Task", async () => {
  const newTask: Task = {
    id: "some-id",
    name: "New Test Task",
    column: "To Do",
  };
  const fakeTasks: Task[] = [newTask];

  const readTasksSpy = spy(() => Promise.resolve(fakeTasks));
  const writeTasksSpy = spy(() => Promise.resolve());

  const taskRepo = {
    writeTasks: writeTasksSpy,
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  await removeTask("some-id", taskRepo);

  await assertSpyCallAsync(writeTasksSpy, 0, {
    args: [[]],
  });
});
