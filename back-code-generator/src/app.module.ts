import { CodeGeneratorModule } from './modeule/code/codegenerator.module';

import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modeule/user/user.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exception/GlobalExceptionFilter';
import { ErrorLoggingInterceptor } from './common/interceptor/ErrorLoggingInterceptor';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from './common/config/logger.config';

@Module({
  imports: [
    CodeGeneratorModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/code_generator'),
    UserModule,
    LoggerModule.forRoot(loggerOptions)
  ],
  controllers: [
  ],
  providers: [

    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: false
      })
    }
  ],
})
export class AppModule { }
