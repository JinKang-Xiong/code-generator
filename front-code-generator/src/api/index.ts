import { headers } from './../utils/axios/config';

import request from '../utils/axios/request'
import type { AddCodeGenerator, BigSearchCodeGenerator, SerachCodeGenerator, SmallSearchCodeGenerator, UpdateCodeGenerator, UserLogin, UserRegister } from './interface';



//注册接口
export async function UserRegisterAPI(userRegister: UserRegister): Promise<any> {
    return request({
        url: '/user/register',
        method: 'post',
        data: userRegister
    })
}

//登录接口
export async function UserLoginAPI(userLogin: UserLogin): Promise<any> {
    return request({
        url: '/user/login',
        method: 'post',
        data: userLogin
    })
}

//获取用户登录态
export async function UserCurrentAPI(token: string | null): Promise<any> {
    return request({
        url: '/user/current',
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

//搜索代码生成器的全部信息
export async function SearchCodeGeneratorAPI(data: SerachCodeGenerator): Promise<any> {
    return request({
        url: '/code-generator/search',
        method: 'post',
        data
    })
}


//增加代码生成器
export async function AddCodeGeneratorAPI(data: AddCodeGenerator): Promise<any> {
    return request({
        url: '/code-generator/add',
        method: 'post',
        data
    })
}

//修改代码生成器
export async function UpdateCodeGeneratorAPI(data: UpdateCodeGenerator): Promise<any> {
    return request({
        url: '/code-generator/update',
        method: 'post',
        data
    })
}

//更加id查询代码生成器
export async function FindCodeGeneratorById(query: object): Promise<any> {
    return request({
        url: '/code-generator/findbyid',
        method: 'get',
        params: query
    })
}

//删除生成器
export async function DeleteCodeGeneratorAPI(query: object): Promise<any> {
    return request({
        url: '/code-generator/delete',
        method: 'put',
        params: query
    })
}

//公共大搜索
export async function BigSearchCodeGeneratorAPI(query: BigSearchCodeGenerator): Promise<any> {
    return request({
        url: '/code-generator/bigsearch',
        method: 'get',
        params: query
    })
}

//公共小搜索
export async function SmallSearchCodeGeneratorAPI(data: SmallSearchCodeGenerator): Promise<any> {
    return request({
        url: '/code-generator/smallsearch',
        method: 'post',
        data
    })
}

//上传文件
export async function UploadFileAPI(data: any, token: string | null): Promise<any> {
    return request({
        url: '/code-generator/upload',
        method: 'post',
        data,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data;charset=utf-8'
        }
    })
}


//下载文件
export async function DownLoadAPI(query: any, token: string | null): Promise<any> {
    return request({
        url: '/code-generator/download',
        method: 'get',
        params: query,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'blob', // 默认值
    })
}

//在线使用代码生成器
export async function UseCodeGeneratorAPI(data: any, token: string | null): Promise<any> {
    return request({
        url: '/code-generator/use',
        method: 'post',
        data,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'blob', // 默认值
    })
}


//上传文件
export async function UploadFileLocalAPI(data: any, token: string | null): Promise<any> {
    return request({
        url: '/code-generator/uploadlocal',
        method: 'post',
        data,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data;charset=utf-8'
        }
    })
}

//在线制作代码生成器
export async function MakerCodeGeneratorAPI(data: any, token: string | null): Promise<any> {
    return request({
        url: '/code-generator/maker',
        method: 'post',
        data,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'blob', // 默认值
    })
}