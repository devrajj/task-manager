import express, { Application } from "express";
import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

const app: Application = express();
const PORT: number | string = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
