import { Router } from "express";
import usersRouter from "./users";

/* Load every api route here */
const routes = [usersRouter];

const apiRouter = Router();

routes.forEach((route) => apiRouter.use("/api", route));

export default apiRouter;
