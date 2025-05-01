// @ts-types="npm:@types/express"
import express from "npm:express";

import { generateBoard } from "./service.ts";

const boardRouter = express();

boardRouter.get("/", async function (_req, res) {
  const board = await generateBoard();

  res.render("./board/pages", { board });
});

export default boardRouter;
