import { Router } from "express";
import apiRouter from "./api";

const RootRouter = Router();

/* Load every service route here */
const routes = [apiRouter];

routes.forEach((route) => RootRouter.use(route));

export default RootRouter;
