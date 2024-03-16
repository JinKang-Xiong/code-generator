<template>
    <a-upload name="file" :multiple="false" :maxCount="1" list-type="picture-card" class="avatar-uploader" @change=""
        :show-upload-list="false" :customRequest="customPicture" :before-upload="beforeUpload">
        <img v-if="imageUrl" :src="baseImgURL + imageUrl" alt="avatar" style="width: 100%;" />
        <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
        </div>
    </a-upload>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { UploadFileAPI } from '../../api'
import { baseImgURL } from '../../utils/constans'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

// function getBase64(img: Blob, callback: (base64Url: string) => void) {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result as string));
//     reader.readAsDataURL(img);
// }

import { Form } from 'ant-design-vue';



const prop = defineProps(['imageUrl'])

const emit = defineEmits(['update:imageUrl'])

const formItemContext = Form.useInjectFormItemContext();
const triggerChange = (changedValue: any) => {
    emit('update:imageUrl', changedValue);
    formItemContext.onFieldChange();
};




const fileList = ref([]);
const loading = ref<boolean>(false);
const biz_picture = 'generator_picture'

const customPicture = async (fileObj: any) => {
    console.log("fileObj以下是");

    console.log(fileObj)
    loading.value = true
    const token = localStorage.getItem('token')
    try {
        const res = await UploadFileAPI({
            file: fileObj.file,
            biz: biz_picture
        }, token)

        if (res.code === 0) {
            triggerChange(res.data)
            message.success(`${fileObj.filename}上传成功`)
            fileObj.onSuccess(res.data)
        } else {

            fileObj.onError(res.data)
        }
    } catch (error: any) {
        message.error(`上传失败${error.message}`)
        fileObj.onError(error)
    }
    loading.value = false
}

// const handleChange = (info: any) => {
//     if (info.file.status === 'uploading') {
//         loading.value = true;
//         return;
//     }
//     if (info.file.status === 'done') {
//         // Get this url from response in real world.
//         getBase64(info.file.originFileObj, (base64Url: string) => {
//             imageUrl.value = base64Url;
//             loading.value = false;
//         });
//     }
//     if (info.file.status === 'error') {
//         loading.value = false;
//         message.error('upload error');
//     }
// };

const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('你只能上传image和png类型的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
        message.error('图片大小要小于4M');
    }
    return isJpgOrPng && isLt2M;
};
</script>
<style scoped>
.avatar-uploader>.ant-upload {
    width: 128px;
    height: 128px;
}

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
  