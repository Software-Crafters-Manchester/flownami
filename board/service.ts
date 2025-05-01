import { TaskRepo } from "../data.ts";
import { Task } from "../tasks/Task.ts";
import { Board, Column } from "./Board.ts";

export async function generateBoard(taskRepo: TaskRepo) {
  const tasks = await taskRepo.readTasks();
  // const tasks = await taskRepo.readTasks(JSONTaskRepo);

  const board = buildBoard(tasks);
  return board;
}

function buildBoard(tasks: Task[]): Board {
  const todoTasks: Task[] = tasks.filter((t) => t.column === "To Do");
  const doingTasks: Task[] = tasks.filter((t) => t.column === "Doing");
  const doneTasks: Task[] = tasks.filter((t) => t.column === "Done");

  const updatedColumns: Column[] = [
    { name: "To Do", tasks: todoTasks },
    { name: "Doing", tasks: doingTasks },
    { name: "Done", tasks: doneTasks },
  ];
  return updatedColumns;
}
