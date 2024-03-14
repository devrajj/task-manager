import mongoose, { ConnectOptions } from "mongoose";
import logger from "../lib/logger";
import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

const MAX_RETRIES: number = 3;

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

class MongoDBService {
  private dbURI: string = process.env.mongodbUri as string;
  private options: ConnectOptions = {
    serverSelectionTimeoutMS: 15000,
    minPoolSize: 40,
  };

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (this.areEventListenersSet()) return;

    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.error("MongoDB disconnected");
    });
  }

  private areEventListenersSet(): boolean {
    return mongoose.connection.listeners("connected").length > 0;
  }

  private async connect(options: ConnectOptions): Promise<void> {
    await mongoose.connect(this.dbURI, options);
  }

  public async connectWithRetry(
    retryAttempt: number = MAX_RETRIES,
    options: ConnectOptions = this.options
  ): Promise<void> {
    try {
      await this.connect(options);
    } catch (error) {
      if (retryAttempt === 0) throw error;
      logger.warn(`Retrying in 3 seconds... (${retryAttempt} retries left)`);
      await wait(3000);
      await this.connectWithRetry(retryAttempt - 1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}

const mongoDBService = new MongoDBService();

export default mongoDBService;
