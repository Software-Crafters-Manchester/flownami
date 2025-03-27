import { assertStringIncludes } from "@std/assert";
import { assertEquals } from "@std/assert";
import { Column, renderTemplate } from "./main.ts";

//pull in database to test
const filePath = "./database.json";
const jsonText = await Deno.readTextFile(filePath);
const data = JSON.parse(jsonText);


Deno.test("Homepage renders successfully", async () => {
  const html = await renderTemplate("./views/pages/index.ejs", {data});
  assertStringIncludes(html, "Flownami");
});

Deno.test("Board shows three columns", async () => {
  const columns: Array<Column> = data;
  const html = await renderTemplate("./views/pages/board/index.ejs", {columns});
  assertStringIncludes(html, "To Do");
  assertStringIncludes(html, "Doing");
  assertStringIncludes(html, "Done");
});

// Deno.test("The correct task is added to the end of the To Do column",()=>{
//   const toDo = data.find((column: Column) => column.name === "To Do")
//   toDo.tasks.push({name: "New Task"})
//   assertEquals(toDo.tasks[toDo.tasks.length-1].name, "New Task")
// })






