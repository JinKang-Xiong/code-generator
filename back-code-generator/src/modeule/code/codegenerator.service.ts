
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CodeGeneratorModule } from './codegenerator.module';
import { Model } from 'mongoose';
import { CodeGeneratorDocument } from './schemas/codeGenerator.schema';
import { isEmpty, isNil } from 'lodash';
import { BussinessException } from 'src/common/exception/BussinessException';
import { ErrorCode } from 'src/common/baserespone/ErrorCode';
import { CreateCodeGeneratorDto, SmallSearchQueryDto, UpdateCodeGeneratorDto } from './dto/codeGeneratorDto';
import { ADD_SUCCESS, UPDATE_SUCCESS } from 'src/common/constan/ReturnConstan';
import { CreateOrQuery, CreateQuery } from 'src/common/utils/SearchQuery';
import { deleteObject } from 'src/common/utils/cos/cosManager';



@Injectable()
export class CodeGeneratorService {
    constructor(
        @InjectModel('code_generator') private codeGeneratorModel: Model<CodeGeneratorDocument>,
    ) { }

    private readonly logger = new Logger(CodeGeneratorService.name)

    /**
     * 查询代码生成器的全部数据——分页
     * @param userId 
     * @param pageNumber 
     * @param pageSize 
     */
    async findAllSer(userId: string, pageNumber: number, pageSize: number): Promise<any> {
        if (isEmpty(userId) || isNil(pageNumber) || isNil(pageSize)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, 'userid,pageNumber,pageSize为空')
        }

        const skipValue = (pageNumber - 1) * pageSize
        const total = await this.codeGeneratorModel.countDocuments({ userId, isDelete: 0 })
        const dataSer = await this.codeGeneratorModel.find({ userId, isDelete: 0 }).sort({ createTime: -1 }).skip(skipValue).limit(pageSize)
        return { dataSer, total }
    }


    /**
     * 新增加代码生成器
     * @param createCodeGenerator 
     */
    async createCodeGenerator(createCodeGenerator: CreateCodeGeneratorDto): Promise<any> {
        if (isEmpty(createCodeGenerator)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, 'createCodeGenerator参数为空')
        }

        let { picture, ...data } = createCodeGenerator
        try {
            const codeGenerator = new this.codeGeneratorModel({ picture, ...data })
            codeGenerator.save()
            return ADD_SUCCESS
        } catch (error) {
            this.logger.error(error)
        }
    }

    /**
     * 修改单个代码生成器
     * @param updateCodeGenerator 
     */
    async updateCodeGenerator(updateCodeGenerator: UpdateCodeGeneratorDto): Promise<any> {
        let { _id, userId, ...data } = updateCodeGenerator
        if (isEmpty(_id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, '_id为空')
        }

        if (isEmpty(updateCodeGenerator)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, 'updateCodeGenerator参数为空');
        }

        //先查询对象存储数据是否更改
        const oldCodeObj = await this.codeGeneratorModel.findById(_id, { distPath: 1, picture: 1 }).lean()
        //如果重新上传了新的代码生成器，要把对象存储中的代码生成器清理掉
        if (oldCodeObj.distPath !== data.distPath) {
            try {
                await deleteObject(oldCodeObj.distPath)
            } catch (error) {
                throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '删除单个代码生成器失败')
            }
        }

        //如果重新上传了新的图片，要把对象存储中的图片清理掉
        if (oldCodeObj.picture !== data.picture) {
            try {
                await deleteObject(oldCodeObj.picture)
            } catch (error) {
                throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '删除单个图片失败')
            }
        }



        const resultSer = await this.codeGeneratorModel.findByIdAndUpdate(_id, { $set: { ...data } })
        if (isEmpty(resultSer)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '数据库修改失败')
        }

        return UPDATE_SUCCESS
    }


    /**
     * 根据id单个查询代码生成器
     * @param _id 
     */
    async findCodeGeneratorById(_id: string): Promise<any> {
        if (isEmpty(_id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, '_id参数为空')
        }

        const codeGeneratorData = await this.codeGeneratorModel.findOne({ _id, isDelete: 0 }).lean()
        if (isEmpty(codeGeneratorData)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '数据库查询失败，无效_id')
        }

        let { isDelete, __v, ...resultSer } = codeGeneratorData
        return resultSer
    }

    /**
     * 删除单个代码生成器——逻辑删除
     * @param _id 
     */
    async deleteCodeGeneratorById(_id: string): Promise<any> {
        if (isEmpty(_id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL_SER, '_id参数为空')
        }

        const resultSer = await this.codeGeneratorModel.findByIdAndUpdate(_id, { $set: { isDelete: 1 } })
        if (isEmpty(resultSer)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR_SER, '数据库逻辑删除失败')
        }
        return UPDATE_SUCCESS
    }

    /**
     * 根据搜索条件搜索用户的代码生成器——分页
     * @param name 名称
     * @param description 描述 
     * @param tags 标签
     * @param pageNumber 页码
     * @param pageSize 页大小
     * @param userId 用户
     * @returns 
     */
    async SerachCodeGenerator(pageNumber: number, pageSize: number, userId: string, name?: string, description?: string, tags?: string[],): Promise<any> {
        let query = CreateQuery({ name, description, userId })

        let skipValue = (pageNumber - 1) * pageSize

        let total: any
        let resultSer: any
        if (isEmpty(tags)) {
            total = await this.codeGeneratorModel.countDocuments(query)
            resultSer = await this.codeGeneratorModel.find(query).sort({ createTime: -1 }).skip(skipValue).limit(pageSize)
        } else {
            total = await this.codeGeneratorModel.countDocuments({ ...query, tags: { $all: [...tags] } })
            resultSer = await this.codeGeneratorModel.find({ ...query, tags: { $all: [...tags] } }).sort({ createTime: -1 }).skip(skipValue).limit(pageSize)
        }
        return { resultSer, total }

    }


    /**
     * 公共大搜索，根据名称和描述搜索——分页
     * @param name 
     * @param description 
     * @param pageNumber 
     * @param pageSize 
     * @returns 
     */
    async bigSearchCodeGenerator(pageNumber: number, pageSize: number, name?: string, description?: string,): Promise<any> {

        const arrQuery = CreateOrQuery({ name, description })

        let skipValue = (pageNumber - 1) * pageSize

        let total
        let resultSer
        total = await this.codeGeneratorModel.countDocuments({ $or: [...arrQuery], isDelete: 0 })
        resultSer = await this.codeGeneratorModel.find({ $or: [...arrQuery], isDelete: 0 }, { userId: 0, __v: 0, modelConfig: 0, fileConfig: 0 }).sort({ createTime: -1 }).skip(skipValue).limit(pageSize).lean()

        return { total, resultSer }
    }


    async smallSearchCodeGenerator(data: SmallSearchQueryDto): Promise<any> {
        let { tags, author, pageNumber, pageSize, name, description } = data
        let query = CreateQuery({ author })
        let arrayQuery = CreateOrQuery({ name, description })
        let skipValue = (pageNumber - 1) * pageSize

        let total;
        let resultSer;
        if (isEmpty(tags)) {
            total = await this.codeGeneratorModel.countDocuments({ $or: [...arrayQuery], ...query })
            resultSer = await this.codeGeneratorModel.find({ $or: [...arrayQuery], ...query }).sort({ createTime: -1 }).skip(skipValue).limit(pageSize).lean()
        } else {
            total = await this.codeGeneratorModel.countDocuments({ $or: [...arrayQuery], ...query, tags: { $all: [...tags] } })
            resultSer = await this.codeGeneratorModel.find({ $or: [...arrayQuery], ...query, tags: { $all: [...tags] } }).sort({ createTime: -1 }).skip(skipValue).limit(pageSize).lean()
        }
        return { total, resultSer }
    }


    async testModel(): Promise<any> {
        // 将要生成的文档结构
        const dataToInsert = {
            name: "2",
            description: "1能",
            basePackage: "1",
            version: '1.0',
            author: '1',
            tags: [],
            picture: '1',
            fileConfig: '{}',
            modelConfig: '{}',
            distPath: '1',
            userId: '1'
        };

        // 生成多个文档
        const insertDocuments = async () => {
            try {
                // 重复1000次，插入数据
                for (let i = 0; i < 100000; i++) {
                    const codeGeneraot = new this.codeGeneratorModel(dataToInsert)
                    codeGeneraot.save()
                }
                console.log('生成数据成功');
            } catch (error) {
                console.error('生成数据时出现错误：', error);
            } finally {
            }
        };

        insertDocuments()
    }





}
