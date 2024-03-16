import type { Request } from 'express';
import { nanoid } from 'nanoid'
import type { Params } from 'nestjs-pino';
import type { ReqId } from 'pino-http';
const passUrl = new Set([]);

export const loggerOptions: Params = {
    pinoHttp: {
        // https://getpino.io/#/docs/api?id=timestamp-boolean-function
        // Change time value in production log.
        // timestamp: stdTimeFunctions.isoTime,
        quietReqLogger: true,
        genReqId: (req): ReqId => (<Request>req).header('X-Request-Id') ?? nanoid(),
        ...(process.env.NODE_ENV === 'production'
            ? {}
            : {
                level: 'debug',
                // https://github.com/pinojs/pino-pretty
                transport: {
                    target: 'pino-pretty',
                    options: { sync: true, singleLine: true },
                },
            }),
        autoLogging: {
            ignore: (req) => passUrl.has((<Request>req).originalUrl),
        },
    },
};