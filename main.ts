// @ts-types="npm:@types/express"
import express from "npm:express";

const app = express();

app.set("view engine", "ejs");

app.get("/", function (_, res) {
  res.render("pages/index");
});

app.get("/board", function (req, res) {
  res.render("pages/board");
});

const port = Deno.env.get("PORT") || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
