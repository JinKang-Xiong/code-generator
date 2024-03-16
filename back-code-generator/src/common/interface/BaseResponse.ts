
//统一返回对象的接口
export interface BaseReponse<T> {
    code: number;
    data: T;
    message: string;
    descript: string
}