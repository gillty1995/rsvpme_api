// import { Request, Response, NextFunction } from "express";
// import logger from "../utils/logger"; // Adjust the path based on where you place the logger.ts file

// // Logger middleware
// const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const { method, url } = req;
//   logger.info(`${method} ${url}`);  // Log HTTP method and requested URL
//   next();
// };



// export default logMiddleware;

import { Request, Response, NextFunction } from "express";

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

export default logMiddleware;