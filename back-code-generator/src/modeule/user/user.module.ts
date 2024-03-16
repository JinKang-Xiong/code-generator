import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
/*
https://docs.nestjs.com/modules
*/

import { Module, forwardRef } from '@nestjs/common';
import { UserSchema } from './schema/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),],
    controllers: [
        UserController,],
    providers: [
        UserService,],
    exports: [UserService]
})
export class UserModule { }
