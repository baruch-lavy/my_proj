import { HttpException } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor(message: string, cause?: Error) {
        super(message, 403, { cause, description: 'Forbidden Error' });
    }
}