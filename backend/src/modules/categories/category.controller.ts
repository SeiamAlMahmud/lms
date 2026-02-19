import { Request, Response } from "express";
import { toSingleParam } from "../../shared/utils/request";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { categoryService } from "./category.service";

export const categoryController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const row = await categoryService.create(req.body);
    res.status(201).json({ success: true, data: row });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const categoryId = toSingleParam(req.params.id, "id");
    const row = await categoryService.update(categoryId, req.body);
    res.status(200).json({ success: true, data: row });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.list(req.query as any);
    res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
  }),
};
