import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { BussinessException } from "./BussinessException";
import { ErrorCode } from "../baserespone/ErrorCode";


@Catch(HttpException, BussinessException)
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: BussinessException | HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        if (exception instanceof BussinessException) {
            console.log('自定义异常')
            //处理BussinessException
            response.status(HttpStatus.BAD_REQUEST)
                .json({
                    code: exception.getStatus(),
                    message: exception.getResponse(),
                    description: exception.getDescription()
                })
        } else if (exception instanceof HttpException) {
            // 处理 HttpException
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    code: ErrorCode.SYSYTEN_ERROR,
                    message: exception.message,
                    description: '',
                });
        }
    }
}