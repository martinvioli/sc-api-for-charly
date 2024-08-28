import { Router } from "express";
import UserController from "../../../controllers/user/user.controller";
import UserService from "../../../services/user.service";
import UserValidator from "../../../controllers/user/user.validators";

const userController = new UserController(
  new UserService(),
  new UserValidator()
);

const routes = Router()
  .post("/", userController.create)
  .post("/admin-user", userController.create)
  .get("/:email", userController.find)
  .put("/change-password", userController.changePassword);

const usersRouter = Router()
  .post("/login", userController.login)
  .use("/user", routes);

export default usersRouter;
