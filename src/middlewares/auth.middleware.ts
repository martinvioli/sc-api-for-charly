import { Request, RequestHandler } from "express";
import AuthException from "../errors/auth/auth.exception";
import * as jwt from "jsonwebtoken";
import User from "../models/user.model";
import UserService from "../services/user.service";
import dayjs from "dayjs";

const userService = new UserService();

const isAuthExcluded = (req: Request) => {
  return (
    req.path === "/api/login" ||
    (req.path === "/api/user/admin-user" && req.method === "POST")
  );
};

const AuthMiddleware: RequestHandler = async (req, res, next) => {
  /* Excclusion routes */
  if (isAuthExcluded(req)) {
    return next();
  }
  const header = req.header("Authorization") || "";
  if (!header) {
    return next(Error(AuthException.MISSING_AUTH_HEADER));
  }
  const [_authTypePrefix, token] = header.split(" ");
  if (!token) {
    return next(Error(AuthException.MISSING_TOKEN));
  }
  try {
    const { email, iat } = jwt.decode(token) as jwt.JwtPayload;
    const user = await userService.find({ email });
    if (
      !user.getDataValue("lastJWTiat") ||
      iat < dayjs(user.getDataValue("lastJWTiat")).unix()
    ) {
      throw Error();
    }
    jwt.verify(token, process.env.APP_KEY) as User;
    req.currentUser = user;
    next();
  } catch (error) {
    return next(Error(AuthException.INVALID_TOKEN));
  }
};

export default AuthMiddleware;
