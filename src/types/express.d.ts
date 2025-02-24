declare namespace Express {
    export interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        sub?: string; 
        // Add other properties as needed 
        userId?: string;
      };
    }
  }