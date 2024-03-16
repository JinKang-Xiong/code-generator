export class ErrorCode {

    constructor(
        private code: number,
        private message: string,
        private description?: string
    ) { }


    getCode(): number {
        return this.code
    }

    getMessage(): string {
        return this.message
    }

    getDescription(): string {
        return this.description
    }


    static SUCCESS = new ErrorCode(0, 'OK', '成功')
    static PARAM_NULL = new ErrorCode(40000, '请求参数为空')
    static PARAM_NULL_SER = new ErrorCode(40000, '服务层参数为空')
    static PARAM_ERROR = new ErrorCode(40001, '请求参数错误')
    static PARAM_ERROR_SER = new ErrorCode(40001, '服务层参数错误')
    static NO_LOGIN = new ErrorCode(40100, '未登录')
    static SYSYTEN_ERROR = new ErrorCode(50000, '系统错误')
}