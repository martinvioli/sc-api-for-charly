import { Options, Sequelize } from "sequelize";
import DATABASE_CONNECTION from "../database/connection.js";

export const databaseInstance = new Sequelize(DATABASE_CONNECTION);

export default databaseInstance;
