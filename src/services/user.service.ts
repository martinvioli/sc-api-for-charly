import { Sequelize } from "sequelize";
import AuthException from "../errors/auth/auth.exception";
import UserException from "../errors/user/user.exception";
import User from "../models/user.model";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";

export default class UserService {
  private APP_KEY = process.env.APP_KEY;

  private encryptPassword = (plainPassword: string) =>
    crypto
      .pbkdf2Sync(plainPassword, this.APP_KEY, 10000, 64, "sha512")
      .toString("base64");

  changePassword = async ({
    user,
    password,
    newPassword,
  }: {
    user: User;
    password: string;
    newPassword: string;
  }) => {
    const encryptedPassword = this.encryptPassword(password);
    if (user.getDataValue("password") !== encryptedPassword) {
      throw Error(UserException.WRONG_PASSWORD);
    }
    const encryptedNewPassword = this.encryptPassword(newPassword);
    return user.update({
      password: encryptedNewPassword,
      /* Force close opened session */
      lastJWTiat: null,
    });
  };

  find = async ({ email }: { email: string }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Error(UserException.USER_NOT_FOUND);
    }
    return user;
  };

  login = async ({
    email,
    plainPassword,
  }: {
    email: string;
    plainPassword: string;
  }) => {
    const encryptedPasswordCheck = this.encryptPassword(plainPassword);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Error(AuthException.USER_NOT_FOUND);
    }
    if (encryptedPasswordCheck !== user.getDataValue("password")) {
      throw Error(AuthException.USER_WRONG_PASSWORD);
    }
    /* Validate user session */
    await user.update({ lastJWTiat: Sequelize.literal("CURRENT_TIMESTAMP") });
    return {
      token: jwt.sign({ email: user.email, name: user.name }, this.APP_KEY, {
        expiresIn: "1h",
      }),
    };
  };

  create = async ({
    name,
    email,
    plainPassword,
  }: {
    name: string;
    email: string;
    plainPassword: string;
  }) => {
    if (!(await this.isEmailFree(email))) {
      throw Error(UserException.MAIL_REPEATED);
    }
    const encryptedPassword = this.encryptPassword(plainPassword);
    return User.create({ name, email, password: encryptedPassword });
  };

  private isEmailFree = async (email: string) => {
    const existentUser = await User.findOne({ where: { email } });
    return !existentUser;
  };
}
