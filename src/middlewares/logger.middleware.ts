import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`${req.method} ${req.originalUrl}`);
        next();
    }   
}

// alternatively you can use a functional middleware without the need to create a class that implements NestMiddleware
// export function logger(req: Request, res: Response, next: NextFunction) {
//     console.log(`${req.method} ${req.originalUrl}`);
//     next();
// }