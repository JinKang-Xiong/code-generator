import { UserModule } from 'src/modeule/user/user.module';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constan/AuthConstans';
import { JwtStrategy } from './strategy/jwt.strategy';


@Module({
    imports: [UserModule, PassportModule, JwtModule.register({
        secret: jwtConstants.secret
    })],
    controllers: [],
    providers: [
        AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule { }
