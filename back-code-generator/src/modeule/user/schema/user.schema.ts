import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document

//用户表
@Schema()
export class User extends Document {

    //账号
    @Prop({ required: true, index: true })
    userAccount: string

    //密码
    @Prop({ required: true })
    userPassword: string

    //用户昵称
    @Prop({ required: true, default: '默认昵称' })
    userName: string

    //用户头像
    @Prop({ default: '' })
    userAvatar: string

    //用户简介
    @Prop({ default: '' })
    userProfile: string

    //用户邮箱
    @Prop({ required: true, })
    userEmail: string

    //用户手机号码
    @Prop({ default: '' })
    userPhone: string

    //用户角色 0是普通用户，1是管理员
    @Prop({ default: 0 })
    userRole: number

    //用户状态 0是正常，1是异常，2是封禁
    @Prop({ default: 0 })
    userStatus: number

    //用户编程兴趣
    @Prop({ default: [] })
    userCodeHobby: string[]

    //创建时间
    @Prop({ default: () => new Date() })
    createTime: Date

    //修改时间
    @Prop({ default: () => new Date() })
    updateTime: Date

    //是否删除 0是不删除，1是删除
    @Prop({ default: 0 })
    isDelete: number

}


export const UserSchema = SchemaFactory.createForClass(User)


//在执行save和findOneAndUpdate时会执行中间件
UserSchema.pre('save', function (this: User, next: Function) {
    console.log("我是MemoSchema的中间件，执行save的方法")
    this.updateTime = new Date();
    next();
});

UserSchema.pre('findOneAndUpdate', function (this: any, next: Function) {
    console.log("我是MemoSchema的中间件，执行了findOneAndUpdate方法")
    this._update.updateTime = new Date();
    next();
});
