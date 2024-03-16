import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { BussinessException } from "src/common/exception/BussinessException";
import { ErrorCode } from "src/common/baserespone/ErrorCode";

/**
 * 用户登录的守卫
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'userAccount',
            passwordField: 'userPassword',
        } as IStrategyOptions)
    }

    /**
     * 验证用户的策略
     * @param userAccount 
     * @param userPassword 
     * 
     * @returns  特性：Passport 根据从 validate() 方法返回的值自动创建一个 user 对象，并将其作为 req.user 分配给请求对象
     */
    async validate(userAccount: string, userPassword: string, remember: boolean): Promise<any> {
        const user = await this.authService.validateUser(userAccount, userPassword)
        if (!user) {
            throw new UnauthorizedException("用户未注册")
        }

        const token = await this.authService.getToken(user, remember)

        return { token }

    }
}