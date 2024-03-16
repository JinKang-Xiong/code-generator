import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BussinessException } from '../exception/BussinessException';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ErrorLoggingInterceptor.name)
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                if (error instanceof BussinessException) {
                    // this.logger.log(`BussinessException: message:${error.getResponse()},description:${error.getDescription()}`)
                    console.log(`BussinessException: message:${error.getResponse()},description:${error.getDescription()}`)
                } else {
                    console.error('An unexpected error occurred:', error);
                }
                return throwError(() => error)
            }),
        );
    }
}
