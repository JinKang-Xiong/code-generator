<template>
    <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="false" :maxCount="1" :disable="loading"
        @change="" @drop="handleDrop" :customRequest="customUpload" @remove="removeValue">
        <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖拽文件上传</p>
        <p class="ant-upload-hint">
            <template v-if="prop.biz === 'generator_dist'">
                请上传生成器文件的压缩包
            </template>

            <template v-if="prop.biz === 'generator_maker_template'">
                请上传压缩包，打包时不要添加最外层目录
            </template>


        </p>
    </a-upload-dragger>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUpdated, watch, nextTick } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { UploadFileAPI, UploadFileLocalAPI } from '../../api'
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';

import { Form } from 'ant-design-vue';
const fileList = ref<any>([]);
const loading = ref(false)

onMounted(() => {
    console.log('组件重新加载')
    console.log(prop.value);

    if (prop.value) {
        console.log('进来了')
        fileList.value.push({
            uid: '-1',
            name: prop.value.slice(prop.value.lastIndexOf('/')),
            status: 'done',
            url: prop.value,
        })
    }

})



const prop = defineProps(['value', 'biz'])

const emit = defineEmits(['update:value'])

const biz = prop.biz

const formItemContext = Form.useInjectFormItemContext();
const triggerChange = (changedValue: any) => {
    emit('update:value', changedValue);
    formItemContext.onFieldChange();
};




const customUpload = async (fileObj: any) => {
    console.log("fileObj以下是");

    console.log(fileObj)
    loading.value = true
    const formdata = new FormData()
    formdata.append('file', fileObj.file)
    formdata.append('biz', biz)
    const token = localStorage.getItem('token')
    try {
        let res
        if (biz === 'generator_dist') {
            res = await UploadFileAPI(formdata, token)
        } else if (biz === 'generator_maker_template') {
            res = await UploadFileLocalAPI(formdata, token)
        }
        if (res.code === 0) {
            // @ts-ignore
            // fileList.value.push(res.data)
            triggerChange(res.data)
            message.success(`${res.data} file uploaded successfully.`);
            fileObj.onSuccess(res.data)
        } else {
            message.error(`${res.data} file upload failed.`);
            fileObj.onError(res.data)
        }
    } catch (error) {
        message.error(`${error} file upload failed.`);
        fileObj.onError(error)
    }
    loading.value = false

}

const removeValue = (file: any) => {
    triggerChange('')
    return true
}


// const handleChange = (info: UploadChangeParam) => {
//     const status = info.file.status;
//     if (status !== 'uploading') {
//         console.log(info.file, info.fileList);
//     }
//     if (status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//     }
// };
function handleDrop(e: DragEvent) {
    console.log(e);
}

watch(() => prop.value, (newValue, oldValue) => {
    if (prop.biz === 'generator_maker_template') {
        if (newValue === '') {
            fileList.value = []
        }
    }
})
</script>