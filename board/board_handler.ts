// @ts-types="npm:@types/express"
import express from "npm:express";

import { Board, Column } from "./Board.ts";
import { readTasks } from "../data.ts";
import { Task } from "../task/Task.ts";

const boardRouter = express();

boardRouter.get("/", async function (_req, res) {
  const tasks = await readTasks();

  const board = buildBoard(tasks);

  res.render("./board/pages", { board });
});

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

export default boardRouter;
