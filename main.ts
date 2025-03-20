// @ts-types="npm:@types/express"
import express from "npm:express";
import { resolve } from "https://deno.land/std@0.224.0/path/mod.ts";

const app = express();

app.set("view engine", "ejs");

// Add middleware to parse form data
app.use(express.urlencoded({ extended: true }));
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

// Helper functions for reading and writing board data
async function readBoardData(): Promise<Array<Column>> {
  try {
    const filePath = resolve("data/board.json");
    const fileContent = await Deno.readTextFile(filePath);
    const data = JSON.parse(fileContent);
    return data.columns;
  } catch (error) {
    console.error("Error reading board data:", error);
    // Return default data if file doesn't exist
    return [
      {
        name: "To Do",
        tasks: [],
      },
      {
        name: "Doing",
        tasks: [],
      },
      {
        name: "Done",
        tasks: [],
      },
    ];
  }
}

async function writeBoardData(columns: Array<Column>): Promise<void> {
  try {
    const filePath = resolve("data/board.json");
    await Deno.writeTextFile(filePath, JSON.stringify({ columns }, null, 2));
  } catch (error) {
    console.error("Error writing board data:", error);
  }
}

// Route to display the board
app.get("/board", async function (_req, res) {
  const columns = await readBoardData();
  res.render("pages/board", { columns });
});

// Routes for managing tasks
app.get("/tasks/new", function (_req, res) {
  res.render("pages/tasks/index.ejs");
});

app.post("/tasks", async function (req, res) {
  const { name } = req.body;
  
  if (name) {
    const columns = await readBoardData();
    // Find "To Do" column
    const todoColumn = columns.find(column => column.name === "To Do");
    
    if (todoColumn) {
      // Add new task to the "To Do" column
      todoColumn.tasks.push({ name });
      await writeBoardData(columns);
    }
  }
  
  // Redirect to the board page after submission (PRG pattern)
  res.redirect("/board");
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);