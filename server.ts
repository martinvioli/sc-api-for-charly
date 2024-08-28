import express from "express";
import "dotenv/config";
import databaseInstance from "./config/database";
import RootRouter from "./src/routes";
import ErrorHandler from "./src/errors/handler";
import AuthMiddleware from "./src/middlewares/auth.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(AuthMiddleware);
app.use(RootRouter);
app.use(ErrorHandler);

try {
  app.listen(3000, () => {
    console.log(`Server running on port 3000`);
    try {
      databaseInstance.authenticate();
      databaseInstance.sync();
      console.log(`Database connected!`);
    } catch (error) {
      console.log(`Can't connect to database: `, error);
    }
  });
} catch (error) {
  console.error("Can't wake up server: ", error);
}
