import { Request } from "express";
import * as Yup from "yup";

export default class UserValidator {
  create = (payload: Request["body"]) => {
    return Yup.object()
      .shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      })
      .validate(payload);
  };

  login = (payload: Request["body"]) => {
    return Yup.object()
      .shape({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      })
      .validate(payload);
  };

  find = (payload: Request["params"]) => {
    return Yup.object()
      .shape({ email: Yup.string().email().required() })
      .validate(payload);
  };

  changePassword = (payload: Request["body"]) => {
    return Yup.object()
      .shape({
        password: Yup.string().required(),
        newPassword: Yup.string().required(),
        newPasswordRepeated: Yup.string()
          .oneOf([Yup.ref("newPassword")], "Passwords must match")
          .required(),
      })
      .validate(payload);
  };
}
