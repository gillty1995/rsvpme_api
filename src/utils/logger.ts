import winston from "winston";

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',  // Log level: info, warn, error, etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    // Log to console
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    // Optionally log to a file
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

export default logger;