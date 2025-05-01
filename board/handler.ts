// @ts-types="npm:@types/express"
import express from "npm:express";

import { generateBoard } from "./service.ts";
import { JSONTaskRepo } from "../data.ts";

const boardRouter = express();

boardRouter.get("/", async function (_req, res) {
  const board = await generateBoard(JSONTaskRepo);

  res.render("./board/pages", { board });
});

export default boardRouter;
