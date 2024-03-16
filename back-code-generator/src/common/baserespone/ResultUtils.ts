import { BaseReponse } from "../interface/BaseResponse";

export class ResultUtils {

    /**
     * 成功的返回结果
     * @param data 
     * @returns 
     */
    static success<T>(data?: T): BaseReponse<T> {
        return {
            code: 0,
            data,
            message: 'OK',
            descript: '返回结果成功'
        }
    }

    /**
     * 参数错误警告
     */
    static warnAccount<T>(data?: T): BaseReponse<T> {
        return {
            code: 10001,
            data,
            message: 'WRAN',
            descript: '参数错误'
        }
    }
}