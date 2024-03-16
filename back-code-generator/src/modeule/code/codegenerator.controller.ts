/*
https://docs.nestjs.com/controllers#controllers
*/


import { Body, Controller, Get, Logger, Post, Put, Query, Req, Request, Res, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CodeGeneratorService } from './codegenerator.service';
import { CreateCodeGeneratorDto, FindAllDto, SearchQueryDto, SmallSearchQueryDto, UpdateCodeGeneratorDto, makerGeneratorDto, useGeneratorDto } from './dto/codeGeneratorDto';
import { BaseReponse } from 'src/common/interface/BaseResponse';
import { ResultUtils } from 'src/common/baserespone/ResultUtils';
import { isEmpty } from 'lodash';
import { BussinessException } from 'src/common/exception/BussinessException';
import { ErrorCode } from 'src/common/baserespone/ErrorCode';
import { SourceMap } from 'module';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { ensureDirSync, ensureFileSync, pathExistsSync, removeSync, writeJSONSync } from 'fs-extra'
import { chmod, chmodSync, createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { getObject, getObjectLocal, uploadPutObject } from 'src/common/utils/cos/cosManager';
import { GENERATOR_DIST, GENERATOR_MAKER_TEMPLATE, GENERATOR_PICTURE, UPDATE_SUCCESS } from 'src/common/constan/ReturnConstan';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { SearchFile } from 'src/common/utils/fileUntils';
import * as AdmZip from 'adm-zip';
import { Readable } from 'stream';
import { error, log } from 'console';
import { json } from 'stream/consumers';
import { exec, execSync } from 'child_process';
import { CacheService } from '../cache/cache.service';
//@ts-ignore
const { GeneratorTemplate } = require('maker-project')


@Controller('code-generator')
export class CodeGeneratorController {
    constructor(private readonly codeGeneratorService: CodeGeneratorService, private readonly cacheService: CacheService) { }

    private readonly logger = new Logger(CodeGeneratorService.name)


    /**
     * 查询代码生成器的全部数据——分页
     * @param data 
     */
    @Post('findall')
    async findAllCon(@Body() data: FindAllDto): Promise<BaseReponse<any>> {
        const resultCon = await this.codeGeneratorService.findAllSer(data.userId, data.pageNumber, data.pageSize)
        return ResultUtils.success(resultCon)
    }

    /**
     * 新增加代码生成器
     * @param codeGeneratorDto 
     */
    @Post('add')
    async addCodeGeneratorCon(@Body() codeGeneratorDto: CreateCodeGeneratorDto): Promise<BaseReponse<any>> {
        const resultCon = await this.codeGeneratorService.createCodeGenerator(codeGeneratorDto)
        if (isEmpty(resultCon)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, '数据库新增失败')
        }

        return ResultUtils.success(resultCon)
    }

    /**
     * 修改代码生成器
     * @param codeGeneratorDto 
     */
    @Post('update')
    async updateCodeGeneratorCon(@Body() codeGeneratorDto: UpdateCodeGeneratorDto): Promise<BaseReponse<any>> {
        const resultCon = await this.codeGeneratorService.updateCodeGenerator(codeGeneratorDto)

        if (isEmpty(resultCon)) {
            throw new BussinessException(ErrorCode.PARAM_NULL)
        }

        return ResultUtils.success(resultCon)

    }

    /**
     *  根据id查询代码生成器
     * @param _id 
     * @returns 
     */
    @Get('findbyid')
    async findCodeGeneratorByIdCon(@Query('_id') _id: string): Promise<BaseReponse<any>> {
        if (isEmpty(_id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL, '_id参数为空')
        }
        const resultCon = await this.codeGeneratorService.findCodeGeneratorById(_id)
        return ResultUtils.success(resultCon)
    }

    @Put('delete')
    async deleteCodeGeneratorByIdCon(@Query('_id') _id: string): Promise<BaseReponse<any>> {
        if (isEmpty(_id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL, '_id参数为空')
        }
        const resultCon = await this.codeGeneratorService.deleteCodeGeneratorById(_id)
        return ResultUtils.success(resultCon)
    }

    /**
     * 
     * @param data 
     * @returns 
     */
    @Post('search')
    async SearchCodeGeneatorCon(@Body() data: SearchQueryDto): Promise<BaseReponse<any>> {
        const resultCon = await this.codeGeneratorService.SerachCodeGenerator(data.pageNumber, data.pageSize, data.userId, data.name, data.description, data.tags,)
        return ResultUtils.success(resultCon)
    }


    @Get('bigsearch')
    async bigSearchCodeGeneratorCon(
        @Query('name') name: string, @Query('description') description: string,
        @Query('pageNumber') pageNumber: number, @Query('pageSize') pageSize: number): Promise<BaseReponse<any>> {
        // const key = this.getPageCacheKey(pageNumber, pageSize)
        // const cacheData = await this.cacheService.get(key)
        // if (!isEmpty(cacheData)) {
        //     return ResultUtils.success(cacheData)
        // }

        const resultCon = await this.codeGeneratorService.bigSearchCodeGenerator(pageNumber, pageSize, name, description,)
        // await this.cacheService.set(key, resultCon, 3600)

        return ResultUtils.success(resultCon)
    }

    @Post('smallsearch')
    async smallSearchCodeGeneratorCon(@Body() data: SmallSearchQueryDto): Promise<BaseReponse<any>> {

        const resultCon = await this.codeGeneratorService.smallSearchCodeGenerator(data)
        return ResultUtils.success(resultCon)
    }

    /**
     * 上传文件
     * @param file 
     * @param biz 
     * @param req 
     * @returns 
     */
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('jwt'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('biz') biz: string, @Request() req): Promise<BaseReponse<any>> {
        if (biz != GENERATOR_DIST && biz != GENERATOR_PICTURE) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, 'biz参数错误，不存在')
        }
        console.log(file)
        const _id = req.user._id
        let originalname = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
        );
        console.log(originalname)
        //文件目录，根据业务来划分
        const filename = nanoid(8) + "-" + originalname
        // const filepath = path.join('test', '//ok', filename)
        const filepath = `${biz}/${_id}/${filename}`
        console.log("filename=" + filename)
        const dirTemp = path.join(path.resolve(), ".temp", biz, _id)
        const tempFilePath = path.join(dirTemp, filename)
        try {
            //如果不加那个后缀recursive，那么它只会创建尾目录，如果其他的父目录不存在那么它会报错
            if (!existsSync(dirTemp)) {
                mkdirSync(dirTemp, { recursive: true })
            }

            writeFileSync(tempFilePath, file.buffer)

            await uploadPutObject(filepath, tempFilePath)
            return ResultUtils.success(filepath)
        } catch (error) {
            this.logger.log(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '上传失败')
        } finally {
            if (!isEmpty(tempFilePath)) {
                removeSync(tempFilePath)
            }
        }

    }


    /**
     * 下载文件
     * @param filepath 
     * @param req 
     */
    @Get('download')
    @UseGuards(AuthGuard('jwt'))
    async downloadFile(@Query('filepath') filepath: string, @Query('id') id: string, @Request() req, @Response() res) {
        try {
            // console.log("filepath=" + filepath)
            // console.log(filepath.slice(filepath.lastIndexOf('-') + 1))
            res.set('Content-Type', 'application/octet-stream;charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=111.txt');

            const zipFilePath = this.getCatchFilePath(id, filepath)
            if (pathExistsSync(zipFilePath)) {
                const readStream = createReadStream(zipFilePath);
                readStream.pipe(res);
            }


            const resBuffer = await getObject(filepath)


            const stream = new Readable()
            stream.push(resBuffer)
            stream.push(null)

            /**
             * 中文文件名编码：
             *  const filename = '中文文件.txt';
                const encodedFilename = encodeURIComponent(filename);
                res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`);

             */

            stream.pipe(res)
        } catch (error) {
            this.logger.log(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '上传失败')
            // throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '上传失败')
        }
    }


    /**
     * 使用代码生成器
     * @param useData 
     * @param req 
     * @param res 
     */
    @Post('use')
    //需要用户登录
    @UseGuards(AuthGuard('jwt'))
    async useGenerator(@Body() useData: useGeneratorDto, @Req() req, @Res() res) {
        //获取用户的输入请求参数
        let { id, data } = useData

        //将布尔字符转换为布尔值
        for (let item in data) {
            if (data[item] === 'true' || data[item] === 'false') {
                data[item] = JSON.parse(data[item])
            }
        }
        //验证生成器在不在
        const result = await this.codeGeneratorService.findCodeGeneratorById(id)
        if (isEmpty(result)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, '生成器不存在')
        }
        let distPath = result.distPath

        const tempDir = path.join(path.resolve(), '.temp', 'use', id)
        const zipFilePath = path.join(tempDir, 'dist.zip')
        const unzipDir = path.join(tempDir, 'dist')
        try {
            //创建独立空间
            ensureFileSync(zipFilePath)

            //从对象存储中下载压缩包
            const res = await getObjectLocal(distPath, zipFilePath)


            // //解压文件
            // const unzipDir = `${path.parse(zipFilePath).dir.replaceAll('\\', '/')}/dist`
            // const envZipFilePath = `${path.parse(zipFilePath).dir.replaceAll('\\', '/')}/${path.parse(zipFilePath).base}`
            // console.log(envZipFilePath)
            // console.log(unzipDir)
            let zip = new AdmZip(zipFilePath)
            zip.extractAllTo(unzipDir, true)
        } catch (error) {
            this.logger.log(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '目录创建失败')
        }

        //将用户输入的参数写到Json文件中
        const jsonPath = path.join(unzipDir, 'dataModel.json')
        try {
            //json文件路径
            writeJSONSync(jsonPath, data)

            console.log('文件写入生成json成功')
        } catch (error) {
            this.logger.warn(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, 'json文件写入失败')
        }

        //执行脚本
        const distIndexPath = await SearchFile(unzipDir, 2, 'index.js')
        try {
            // 添加可执行权限
            chmodSync(distIndexPath, 0o755,);
            console.log('文件权限已修改为可执行');
        } catch (error) {
            console.error('修改权限出错:', error);
        }

        //执行脚本命令
        try {
            // 执行第一个子进程
            //npm --prefix /path/to/project-b run your-command
            const stdout1 = execSync(`npm --prefix ${unzipDir} install`);
            console.log(`第一个命令执行成功：${stdout1.toString()}`);

            const stdout2 = execSync(`node ${distIndexPath} json-generator --file=${jsonPath}`)
            console.log(`第二个命令执行成功：${stdout2.toString()}`);
        } catch (error) {
            console.error(`执行的错误: ${error.message}`);
        }


        //压缩生成结果
        const outGeneratorPath = path.join(unzipDir, 'out-generator')
        const resultPath = path.join(unzipDir, 'out-generator.zip')

        // 创建一个新的zip文件
        let zip = new AdmZip();

        // 添加整个文件夹到zip文件
        zip.addLocalFolder(outGeneratorPath);

        // 将zip文件写入磁盘
        zip.writeZip(resultPath);

        // 读取文件并将其写入到响应流中
        res.set('Content-Type', 'application/octet-stream;charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(resultPath));
        const readStream = createReadStream(resultPath);
        readStream.pipe(res);

        // 监听读取流关闭事件
        readStream.on('close', () => {
            // 删除工作空间
            try {
                removeSync(tempDir);
                console.log('Temporary directory deleted successfully');
            } catch (error) {
                console.error('Error deleting temporary directory:', error);
            }
        });
    }


    /**
     * 制作代码生成器
     * @param generatorMaker 
     */
    @Post('maker')
    @UseGuards(AuthGuard('jwt'))
    async makerGenerator(@Body() generatorMaker: makerGeneratorDto, @Res() res): Promise<any> {
        //1)输入的参数
        let { zipTemplateFilePath, meta } = generatorMaker

        //2)需要登录


        //3)创建独立工作空间
        const id = nanoid(6)
        const tempDir = path.join(path.resolve(), '.temp', 'maker', id)
        // const zipTemplateFileOutPath = path.join(tempDir, 'project.zip')
        const zipFilePath = path.join(path.resolve(), zipTemplateFilePath)

        const unZipTemplatePath = path.join(tempDir, 'project')

        //4)下载模板文件

        try {
            //创建空间
            // ensureDirSync(unZipTemplatePath)
            ensureDirSync(unZipTemplatePath)

            //从对象存储下载压缩包
            // await getObjectLocal(zipTemplateFilePath, zipTemplateFileOutPath)

            //5)解压模板文件。得到模板文件路径

            let zip = new AdmZip(zipFilePath)
            zip.extractAllTo(unZipTemplatePath, true)

        } catch (error) {
            this.logger.error(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '对象存储下载失败')
        }

        //6)构造meta对象
        meta.fileConfig.sourceRootPath = unZipTemplatePath
        meta.fileConfig.inputRootPath = `.source/${path.basename(unZipTemplatePath)}`
        meta.fileConfig.fileName = path.basename(unZipTemplatePath)
        meta.fileConfig.outputRootPath = 'out-generator'
        meta.fileConfig.type = 'dir'
        const date = new Date()
        meta.createTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`


        //7)调用maker方法
        const outGeneratorPath = path.join(tempDir, 'generator', meta.name, 'generated-basic-project1')
        const generator = new GeneratorTemplate()
        await generator.doGeneratorMark(outGeneratorPath, meta)



        //8)将生成的生成器压缩包返回
        const suffexZip = '.zip'
        const outGeneratorPathZip = outGeneratorPath + suffexZip

        res.set('Content-Type', 'application/octet-stream;charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(outGeneratorPathZip));
        const readStream = createReadStream(outGeneratorPathZip);
        readStream.pipe(res);

        //9)清理空间
        readStream.on('close', () => {
            try {
                removeSync(tempDir)
                removeSync(zipFilePath)
                console.log('工作空间清理完成')
            } catch (error) {
                console.log(error)
            }
        })
    }




    /**
     * 上传代码生成器到本地
     * @param file 
     * @param req 
     * @returns 
     */
    @Post('uploadlocal')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('jwt'))
    async uploadFileLocal(@UploadedFile() file: Express.Multer.File, @Body('biz') biz: string, @Request() req): Promise<BaseReponse<any>> {
        if (biz !== GENERATOR_MAKER_TEMPLATE) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, 'biz参数错误')
        }

        console.log(file)
        const _id = req.user._id
        let originalname = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
        );
        console.log(originalname)
        //文件目录，根据业务来划分
        const filename = nanoid(8) + "-" + originalname
        console.log("filename=" + filename)
        const dirTemp = path.join(path.resolve(), ".temp", GENERATOR_MAKER_TEMPLATE, _id)
        const tempFilePath = path.join(dirTemp, filename)
        const relativeFilePath = path.relative(path.resolve(), tempFilePath)

        try {
            //如果不加那个后缀recursive，那么它只会创建尾目录，如果其他的父目录不存在那么它会报错
            if (!existsSync(dirTemp)) {
                mkdirSync(dirTemp, { recursive: true })
            }

            writeFileSync(tempFilePath, file.buffer)
            return ResultUtils.success(relativeFilePath)
        } catch (error) {
            this.logger.log(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '上传失败')
        } finally {
            // if (!isEmpty(tempFilePath)) {
            //     removeSync(tempFilePath)
            // }
        }

    }


    //TODO:要建权用户登录，并且还要考虑是否是管理也用户
    @Post('catchfile')
    async catchFile(@Body('id') id: string): Promise<BaseReponse<any>> {
        if (isEmpty(id)) {
            throw new BussinessException(ErrorCode.PARAM_NULL, 'id参数为空')
        }

        const generator: any = await this.codeGeneratorService.findCodeGeneratorById(id)
        if (isEmpty(generator)) {
            throw new BussinessException(ErrorCode.PARAM_ERROR, 'id参数错误')
        }

        const distPath = generator.distPath
        const zipFilePath = this.getCatchFilePath(id, distPath)

        try {

            ensureFileSync(zipFilePath)

            const res = getObjectLocal(distPath, zipFilePath)

            return ResultUtils.success(UPDATE_SUCCESS)

        } catch (error) {
            this.logger.error(error)
            throw new BussinessException(ErrorCode.SYSYTEN_ERROR, '对象存储下载')
        }




    }

    /**
     * 获取缓存路径
     * @param id 
     * @param distPath 
     * @returns 
     */
    getCatchFilePath(id: string, distPath: string) {
        const projectPath = path.resolve()
        const tempDir = path.join(projectPath, '.temp', 'catch', id)
        const zipFilePath = path.join(tempDir, distPath)
        return zipFilePath
    }

    getPageCacheKey(pageNumber: number, pageSize: number) {
        const str = `${pageNumber}${pageSize}`
        const base64 = Buffer.from(str, 'utf-8').toString('base64')
        const key = `generator:page:${base64}`
        return key
    }

    // @Get('test')
    // async testModel() {
    //     const data = await this.codeGeneratorService.testModel()

    //     return '1'
    // }




}
