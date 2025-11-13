import { Router, type Router as ExpressRouter } from "express";
import { authController } from "./auth.controller.ts";

// Router Express khusus untuk semua endpoint Auth
const authRouter: ExpressRouter = Router();

// POST /api/v1/auth/register
authRouter.post("/register", authController.register);

// POST /api/v1/auth/login
authRouter.post("/login", authController.login);

export default authRouter;
