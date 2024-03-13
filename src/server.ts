import express, { Application } from "express";
import dotenvSafe from "dotenv-safe";
import mongoDBService from "./database/mongodb";
import logger from "./lib/logger";
dotenvSafe.config();

const app: Application = express();
const PORT: number | string = process.env.PORT || 3001;
(async () => {
  try {
    await mongoDBService.connectWithRetry();
  } catch (error) {
    logger.info(`Error connecting to MongoDB: ${error}`);
    process.exit(1); // Exit the process if MongoDB connection fails
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
})();
