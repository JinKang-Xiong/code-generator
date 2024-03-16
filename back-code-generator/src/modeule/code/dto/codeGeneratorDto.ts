import { IsArray, IsNotEmpty, isNotEmpty } from "class-validator"
import { MetaDto } from "./metaDto"

// 查询代码生成器分页对象
class FindAllDto {

    //用户的id
    @IsNotEmpty()
    userId: string

    //分页的页数
    @IsNotEmpty()
    pageNumber: number

    //分页的大小——每页的大小
    @IsNotEmpty()
    pageSize: number
}

// 新增加代码生成器的对象
class CreateCodeGeneratorDto {

    //名称
    @IsNotEmpty()
    name: string

    //描述
    @IsNotEmpty()
    description: string

    //基础包
    @IsNotEmpty()
    basePackage: string

    //版本
    @IsNotEmpty()
    version: string

    //作者
    @IsNotEmpty()
    author: string

    //标签
    @IsArray()
    tags: string[]

    //图片
    @IsNotEmpty()
    picture: string

    //文件配置
    @IsNotEmpty()
    fileConfig: string

    //模型配置
    @IsNotEmpty()
    modelConfig: string

    //代码生成器产物路径
    @IsNotEmpty()
    distPath: string

    //创建用户
    @IsNotEmpty()
    userId: string
}

// 修改代码生成器的对象
class UpdateCodeGeneratorDto {

    //id
    @IsNotEmpty()
    _id: string

    //名称
    @IsNotEmpty()
    name: string

    //描述
    @IsNotEmpty()
    description: string

    //基础包
    @IsNotEmpty()
    basePackage: string

    //版本
    @IsNotEmpty()
    version: string

    //作者
    @IsNotEmpty()
    author: string

    //标签
    @IsArray()
    tags: string[]

    //图片
    @IsNotEmpty()
    picture: string

    //文件配置
    @IsNotEmpty()
    fileConfig: string

    //模型配置
    @IsNotEmpty()
    modelConfig: string

    //代码生成器产物路径
    @IsNotEmpty()
    distPath: string

    //状态
    @IsNotEmpty()
    status: number

    //创建用户
    @IsNotEmpty()
    userId: string
}

//条件搜索的参数对象
class SearchQueryDto {
    name?: string
    description?: string
    tags?: string[]

    @IsNotEmpty()
    pageSize: number

    @IsNotEmpty()
    pageNumber: number

    @IsNotEmpty()
    userId: string
}


class SmallSearchQueryDto {

    name?: string

    description?: string

    tags?: string[]

    author?: string

    @IsNotEmpty()
    pageNumber: number

    @IsNotEmpty()
    pageSize: number
}


class useGeneratorDto {
    @IsNotEmpty()
    id: string

    data: object
}


class makerGeneratorDto {
    @IsNotEmpty()
    zipTemplateFilePath: string

    @IsNotEmpty()
    meta: MetaDto
}


export { FindAllDto, CreateCodeGeneratorDto, UpdateCodeGeneratorDto, SearchQueryDto, SmallSearchQueryDto, useGeneratorDto, makerGeneratorDto }