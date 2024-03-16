/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Inject, Injectable, Logger, NotAcceptableException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { ErrorCode } from 'src/common/baserespone/ErrorCode';
import { isEmpty } from 'lodash'
import { BussinessException } from 'src/common/exception/BussinessException';
import { ACCOUNT_REPEAT, REGISTER_SUCCESS } from 'src/common/constan/ReturnConstan';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<UserDocument>,
    ) { }

    private readonly logger = new Logger(UserService.name)

    /**
     * 注册用户
     * @param createUserDto 
     */
    async createUserSer(createUserDto: CreateUserDto): Promise<any> {
        let { userAccount, userEmail, userPassword, checkUserPassword } = createUserDto

        //验证用户的有些格式是否正确
        let patterEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!patterEmail.test(userEmail)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '邮箱的格式不正确')
        }

        //验证密码长度是否大于6
        if (userPassword.length < 6 || checkUserPassword.length < 6) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '密码长度小于6')
        }

        //验证两次输入的密码是否相等
        if (userPassword != checkUserPassword) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '两次输入的密码不一样')
        }

        //查询账号是否重复
        const userByAccount = await this.userModel.findOne({ userAccount })
        if (!isEmpty(userByAccount)) {
            return ACCOUNT_REPEAT
        }

        try {
            let user = new this.userModel({ userAccount, userPassword, userName: userAccount, userEmail })
            await user.save()
            return REGISTER_SUCCESS
        } catch (error) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, error)
        }

    }


    /**
     * 根据账号查询用户
     * @param userAccount 
     * @returns 
     */
    async findByUserAccount(userAccount: string): Promise<any> {
        if (isEmpty(userAccount)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, 'userAccount为空')
        }

        const dataSer = await this.userModel.findOne({ userAccount }).lean()
        return dataSer
    }


    /**
     * 根据用户的id查询用户态
     * @param _id 
     */
    async findByUserId(_id: string): Promise<any> {
        if (isEmpty(_id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, '_id为空')
        }

        const ser_user = await this.userModel.findById(_id).lean()

        if (isEmpty(ser_user)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '数据库查询失败')
        }

        let { userPassword, __v, ...data } = ser_user
        return data
    }


}
