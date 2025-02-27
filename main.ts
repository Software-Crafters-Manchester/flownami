// @ts-types="npm:@types/express"
import express from "npm:express";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));

app.get("/", function (_, res) {
  res.render("pages/index");
});

type Column = {
  name: string;
  tasks: Array<Task>;
};

type Task = {
  name: string;
};

app.get("/board", function (_req, res) {
  const columns: Array<Column> = [
    {
      name: "To Do",
      tasks: [
        {
          name: "Task 1",
        },
        {
          name: "Task 2",
        },
        {
          name: "Task 3",
        },
      ],
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

  res.render("pages/board", { columns });
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
