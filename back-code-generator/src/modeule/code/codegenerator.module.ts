/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CodeGeneratorController } from './codegenerator.controller';
import { CodeGeneratorService } from './codegenerator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeGeneratorSchema } from './schemas/codeGenerator.schema';
import { CacheModel } from '../cache/cache.module';

@Module({
    imports: [CacheModel, MongooseModule.forFeature([{ name: 'code_generator', schema: CodeGeneratorSchema }])],
    controllers: [CodeGeneratorController],
    providers: [CodeGeneratorService],
})
export class CodeGeneratorModule { }
