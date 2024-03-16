/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/common/baserespone/ErrorCode';
import { jwtConstants } from 'src/common/constan/AuthConstans';
import { BussinessException } from 'src/common/exception/BussinessException';
import { UserService } from 'src/modeule/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) { }

    /**
     * 验证是否存在该用户
     * @param userAccount 账号 
     * @param userPassword 密码
     */
    async validateUser(userAccount: string, userPassword: string): Promise<any> {
        const user = await this.userService.findByUserAccount(userAccount)
        if (user && user.userPassword === userPassword) {
            const { userPassword, ...result } = user

            return result
        }

        return null

    }


    /**
     * 获取token
     * @param user 
     * @returns 
     */
    async getToken(user: any, remember: boolean) {
        let { userAccount, _id } = user
        let expiresIn: string = '10s'
        if (!userAccount || !_id) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, 'userAccount或_id为空')
        }
        const payload = { userAccount, sub: _id }
        if (remember) {
            expiresIn = '100h'
        }
        return this.jwtService.sign(payload, { expiresIn })

    }
}
