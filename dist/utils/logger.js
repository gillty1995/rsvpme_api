"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// Set up Winston logger
const logger = winston_1.default.createLogger({
    level: 'info', // Log level: info, warn, error, etc.
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })),
    transports: [
        // Log to console
        new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }),
        // Optionally log to a file
        new winston_1.default.transports.File({ filename: 'logs/app.log' }),
    ],
});
exports.default = logger;
