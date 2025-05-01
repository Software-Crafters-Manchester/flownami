// @ts-types="npm:@types/express"
import express from "npm:express";
import tasksRouter from "./tasks/handler.ts";
import boardRouter from "./board/handler.ts";

export const app = express();

app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(
  "/scripts",
  express.static("scripts", {
    setHeaders: function (res, _path, _stat) {
      res.type("application/javascript");
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (_req, res) {
  res.render("index");
});

app.use("/tasks", tasksRouter);

app.use("/board", boardRouter);

if (import.meta.main) {
  const port = Deno.env.get("PORT") || 8080;
  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

export default app;
