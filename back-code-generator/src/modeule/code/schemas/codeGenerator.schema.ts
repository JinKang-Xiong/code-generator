import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CodeGeneratorDocument = CodeGenerator & Document

//代码生成器表
@Schema()
export class CodeGenerator extends Document {

    //名称
    @Prop({ required: true })
    name: string

    //描述
    @Prop({ required: true })
    description: string

    //基础包
    @Prop({ required: true })
    basePackage: string

    //版本
    @Prop({ required: true })
    version: string

    //作者
    @Prop({ required: true })
    author: string

    //标签列表
    @Prop({ default: [] })
    tags: string[]

    //图片
    @Prop({ default: '' })
    picture: string

    //文件配置
    @Prop({ default: '' })
    fileConfig: string

    //模型配置
    @Prop({ default: '' })
    modelConfig: string

    //代码生成器产物路径
    @Prop({ default: '' })
    distPath: string

    //状态
    @Prop({ default: 0 })
    status: number

    //创建用户id
    @Prop({ default: '', index: true })
    userId: string

    //创建时间
    @Prop({ default: () => new Date() })
    createTime: Date

    //修改时间
    @Prop({ default: () => new Date() })
    updateTime: Date

    //是否删除
    @Prop({ default: 0 })
    isDelete: number

}

export const CodeGeneratorSchema = SchemaFactory.createForClass(CodeGenerator)

//在执行save和findOneAndUpdate时会执行中间件
CodeGeneratorSchema.pre('save', function (this: CodeGenerator, next: Function) {
    console.log("我是MemoSchema的中间件，执行save的方法")
    this.updateTime = new Date();
    next();
});

CodeGeneratorSchema.pre('findOneAndUpdate', function (this: any, next: Function) {
    console.log("我是MemoSchema的中间件，执行了findOneAndUpdate方法")
    this._update.updateTime = new Date();
    next();
});
