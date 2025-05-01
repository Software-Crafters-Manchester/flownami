import { generateBoard } from "./service.ts";
import { Board } from "./Board.ts";
import { assertArrayIncludes } from "@std/assert/array-includes";
import { spy } from "@std/testing/mock";
import { TaskRepo } from "../data.ts";
import { Task } from "../tasks/Task.ts";

Deno.test("generate a Board", async () => {
  const fakeTask: Task = {
    id: "some-id",
    name: "Some Name",
    column: "To Do",
  };

  const fakeTasks: Task[] = [fakeTask];

  const readTasksSpy = spy(() => fakeTasks);

  const taskRepo = {
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  const board = await generateBoard(taskRepo);

  const todoColumn = {
    name: "To Do",
    tasks: [
      fakeTask,
    ],
  };
  const doingColumn = {
    name: "Doing",
    tasks: [],
  };
  const doneColumn = {
    name: "Done",
    tasks: [],
  };
  const expectedBoard: Board = [todoColumn, doingColumn, doneColumn];

  assertArrayIncludes(board, expectedBoard);
});
