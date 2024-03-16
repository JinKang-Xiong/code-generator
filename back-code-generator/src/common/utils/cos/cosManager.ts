// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
import * as COS from "cos-nodejs-sdk-v5";
import { SecretId, SecretKey } from "./cosConfig";
import { createReadStream, statSync, createWriteStream } from 'fs'
import { Bucket, Region } from "src/common/constan/CosConstans";
import { resolve } from "path";
import { reject } from "lodash";
const cos = new COS({
    SecretId: SecretId, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
    SecretKey: SecretKey, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});

/**
 * 上传文件
 * @param key 
 * @param filePath 
 * @returns 
 */
export function uploadPutObject(key: string, filePath: string) {
    return new Promise((resolve, reject) => {
        cos.putObject({
            Bucket: Bucket, /* 填入您自己的存储桶，必须字段 */
            Region: Region,  /* 存储桶所在地域，例如 ap-beijing，必须字段 */
            Key: key,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            StorageClass: 'STANDARD',
            /* 当 Body 为 stream 类型时，ContentLength 必传，否则 onProgress 不能返回正确的进度信息 */
            Body: createReadStream(filePath), // 上传文件对象
            ContentLength: statSync(filePath).size,
            onProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            }
        }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

//浏览器下载文件
export function getObject(key: string) {
    return new Promise((resolve, reject) => {
        cos.getObject({
            Bucket: Bucket, /* 填入您自己的存储桶，必须字段 */
            Region: Region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
            Key: key,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        }, function (err, data) {
            console.log('err=' + err)
            console.log(err || data.Body);
            if (err) {
                reject(err);
            } else {
                resolve(data.Body);
            }

        });
    })
}


/**
 * 将文件下载到本地
 * @param key 
 * @param localPath 
 */
export function getObjectLocal(key: string, localPath: string) {
    return new Promise((resolve, reject) => {
        cos.getObject({
            Bucket: Bucket, /* 必须 */
            Region: Region,    /* 必须 */
            Key: key,              /* 必须 */
            Output: createWriteStream(localPath),
        }, function (err, data) {
            // console.log(err || data);
            if (err) {
                reject(err);
            } else {
                resolve(data.statusCode);
            }
        });
    })

}


/**
 * 删除单个对象
 * @param key 
 */
export function deleteObject(key: string) {
    return new Promise((resolve, reject) => {
        cos.deleteObject({
            Bucket: Bucket, /* 填入您自己的存储桶，必须字段 */
            Region: Region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
            Key: key,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        }, function (err, data) {
            console.log(err || data);
            if (err) {
                reject()
            } else {
                resolve(data.statusCode)
            }
        });
    })


}
