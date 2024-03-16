import { User } from './../../../.history/src/modeule/user/schema/user.schema_20240212074523';

/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Inject, Post, Request, UseGuards, ValidationPipe, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { BaseReponse } from 'src/common/interface/BaseResponse';
import { UserService } from './user.service';
import { ResultUtils } from 'src/common/baserespone/ResultUtils';
import { ACCOUNT_REPEAT, REGISTER_SUCCESS } from 'src/common/constan/ReturnConstan';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { isEmpty } from 'lodash';
import { AuthService } from 'src/auth/auth.service';
import { BussinessException } from 'src/common/exception/BussinessException';
import { ErrorCode } from 'src/common/baserespone/ErrorCode';

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,) { }

    //TODO:管道来验证传递的参数是否为空
    @Post('register')
    async createUserCon(@Body() createUserDto: CreateUserDto): Promise<BaseReponse<any>> {
        const userSer = await this.userService.createUserSer(createUserDto)
        if (userSer === ACCOUNT_REPEAT) {
            return ResultUtils.warnAccount('邮箱已经注册')
        }
        if (userSer === REGISTER_SUCCESS) {
            return ResultUtils.success('注册成功')
        }
    }

    /**
     * 用户登录
     * @param req 
     * @returns 返回token
     */
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any): Promise<BaseReponse<any>> {
        return ResultUtils.success(req.user)
    }


    /**
     * 获取用户的登录态
     * @param req 
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('current')
    async current(@Request() req: any): Promise<BaseReponse<any>> {
        const user_con = await this.userService.findByUserId(req.user._id)
        if (isEmpty(user_con)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR)
        }
        return ResultUtils.success(user_con)
    }

}
