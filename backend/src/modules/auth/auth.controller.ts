import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { authService } from "./auth.service";

export const authController = {
  bootstrapSuperAdmin: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.bootstrapSuperAdmin(req.body);
    res.status(201).json({ success: true, data: result });
  }),

  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerStudent(req.body);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    res.status(200).json({ success: true, data: result });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);
    res.status(200).json({ success: true, message: "Logged out" });
  }),
};
