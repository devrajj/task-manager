import winston from "winston";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(winston.format.simple()),
  transports: [new winston.transports.Console()],
});

export default logger;
