/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { CacheService } from './cache.service';
@Module({
    imports: [

    ],
    controllers: [],
    providers: [
        CacheService,
        {
            provide: 'REDIS_CLIENT',
            async useFactory() {
                const client = createClient({
                    socket: {
                        host: 'localhost',
                        port: 6379
                    }
                });
                await client.connect()
                console.log('redis连接成功')
                return client
            }
        }

    ],
    exports: [CacheService]
})
export class CacheModel { }
