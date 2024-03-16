import { HttpException } from "@nestjs/common";
import { ErrorCode } from "../baserespone/ErrorCode";

/**
 * 自定义异常
 */
export class BussinessException extends HttpException {
    private description: string

    getDescription(): string {
        return this.description
    }

    constructor(errorCode: ErrorCode, description?: string) {
        super(errorCode.getMessage(), errorCode.getCode())
        this.description = errorCode.getDescription() || description
    }
}