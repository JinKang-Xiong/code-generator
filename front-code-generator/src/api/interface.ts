
//注册的数据接口
export interface UserRegister {
    userAccount: string,
    userEmail: string,
    userPassword: string,
    checkUserPassword: string
}

//登录的数据接口
export interface UserLogin {
    userAccount: string,
    userPassword: string,
    remember: boolean
}

//搜索代码生成器的信息的接口
export interface SerachCodeGenerator {
    name?: string,
    description?: string,
    tags?: string[]

    pageSize: number
    pageNumber: number

    userId: string
}

//增加代码生成器的接口
export interface AddCodeGenerator {
    name: string,
    description: string,
    basePackage: string,
    version: string,
    author: string,
    tags: string[],
    picture: string
    fileConfig: string,
    modelConfig: string,
    distPath: string,
    userId: string
}

//修改代码生成器的接口
export interface UpdateCodeGenerator extends AddCodeGenerator {
    _id: string,
    status: number

}

export interface SmallSearchCodeGenerator {
    pageNumber: number
    pageSize: number
    tags?: string[]
    author?: string
    name?: string
    description?: string
}


export interface BigSearchCodeGenerator {
    pageNumber: number
    pageSize: number
    name?: string
    description?: string
}


