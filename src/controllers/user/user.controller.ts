import { Request, RequestHandler, Response } from "express";
import UserService from "../../services/user.service";
import UserValidator from "./user.validators";

class UserController {
  constructor(
    private userService: UserService,
    private userValidator: UserValidator
  ) {}

  create: RequestHandler = async (req, res, throwError) => {
    try {
      const { name, email, password } = await this.userValidator.create(
        req.body
      );
      return res.json(
        await this.userService.create({
          email,
          name,
          plainPassword: password,
        })
      );
    } catch (error) {
      return throwError(error);
    }
  };

  login: RequestHandler = async (req, res, throwError) => {
    try {
      const { email, password } = await this.userValidator.login(req.body);
      return res.json(
        await this.userService.login({ email, plainPassword: password })
      );
    } catch (error) {
      return throwError(error);
    }
  };

  find: RequestHandler = async (req, res, throwError) => {
    try {
      const { email } = await this.userValidator.find(req.params);
      return res.json(await this.userService.find({ email }));
    } catch (error) {
      return throwError(error);
    }
  };

  changePassword: RequestHandler = async (req, res, throwError) => {
    try {
      const { password, newPassword } = await this.userValidator.changePassword(
        req.body
      );
      return res.json(
        await this.userService.changePassword({
          user: req.currentUser,
          password,
          newPassword,
        })
      );
    } catch (error) {
      return throwError(error);
    }
  };
}

export default UserController;
