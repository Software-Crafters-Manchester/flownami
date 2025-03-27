import { Board } from "../types/board.ts";

export function generateBoard(tasks) {
  const columns: Board = [
    {
      name: "To Do",
      tasks,
    },
    {
      name: "Doing",
      tasks: [
        {
          name: "In progress...",
        },
      ],
    },
    {
      name: "Done",
      tasks: [
        {
          name: "Finished this one",
        },
        {
          name: "And this one",
        },
        {
          name: "Crikey,",
        },
        {
          name: "Wasn't I...",
        },
        {
          name: "Productive!",
        },
      ],
    },
  ];
  return columns;
}

