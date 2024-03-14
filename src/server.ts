import express, { Application } from "express";
import dotenvSafe from "dotenv-safe";
import mongoDBService from "./connections/mongodb";
import logger from "./lib/logger";
import routes from "./routes/routes";
import responseHandler from "./routes/middleware/responseHandler";
dotenvSafe.config();

const app: Application = express();
app.use(express.json({ limit: "5mb" }));
app.use(responseHandler);
app.use(routes);
const PORT: number | string = process.env.PORT || 3001;
(async () => {
  try {
    await mongoDBService.connectWithRetry();
  } catch (error) {
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
  });
})();

export default app;
