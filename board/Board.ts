import { Task } from "../tasks/Task.ts";

export type Column = {
  name: string;
  tasks: Array<Task>;
};

export type Board = Column[];
