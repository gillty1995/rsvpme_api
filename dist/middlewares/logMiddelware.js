"use strict";
// import { Request, Response, NextFunction } from "express";
// import logger from "../utils/logger"; // Adjust the path based on where you place the logger.ts file
Object.defineProperty(exports, "__esModule", { value: true });
const logMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
};
exports.default = logMiddleware;
