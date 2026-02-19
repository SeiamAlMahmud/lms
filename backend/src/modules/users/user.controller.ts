import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { toSingleParam } from "../../shared/utils/request";
import { userService } from "./user.service";

export const userController = {
  createAdmin: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createAdmin(req.user!, req.body);
    res.status(201).json({ success: true, data: user });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const userId = toSingleParam(req.params.id, "id");
    const user = await userService.updateUserStatus(req.user!, userId, req.body.status);
    res.status(200).json({ success: true, data: user });
  }),

  listUsers: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.listUsers(req.query as any);
    res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
  }),
};
