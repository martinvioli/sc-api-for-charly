import { ErrorRequestHandler } from "express";
import Exception from "./exception";

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    return res.status(400).json(Exception(err));
  }
};

export default ErrorHandler;
