<template>
    <div class="add-codegenerator">
        <a-steps :current="current" :items="items" style="width: 85%; margin: 0 auto;"></a-steps>
        <div class="steps-content">
            <div v-if="steps[current].id === 1" class="basic-information">
                <a-form layout='vertical' name="custom-validation" :model="formState" :rules="rulesAdd">
                    <a-form-item has-feedback label="名称" name="name">
                        <a-input v-model:value="formState.name" autocomplete="off" />
                    </a-form-item>
                    <a-form-item has-feedback label="描述" name="description">
                        <a-input v-model:value="formState.description" autocomplete="off" />
                    </a-form-item>

                    <a-form-item has-feedback label="基础包" name="basePackage">
                        <a-input v-model:value="formState.basePackage" autocomplete="off" />
                    </a-form-item>

                    <a-form-item has-feedback label="版本" name="version">
                        <a-input v-model:value="formState.version" autocomplete="off" />
                    </a-form-item>

                    <a-form-item has-feedback label="作者" name="author">
                        <a-input v-model:value="formState.author" autocomplete="off" />
                    </a-form-item>

                    <a-form-item label="标签" name="tags">
                        <a-select v-model:value="formState.tags" mode="tags" style="width: 100%"
                            placeholder="Tags Mode"></a-select>
                    </a-form-item>

                    <a-form-item has-feedback label="图片" name="picture">
                        <PictureUpload v-model:image-url="formState.picture"></PictureUpload>

                    </a-form-item>
                </a-form>

            </div>

            <div v-if="steps[current].id === 2">
                <AddModel v-model:value="modelConfig"></AddModel>
            </div>

            <div v-if="steps[current].id === 3">
                <!-- <a-form layout='vertical'>
                    <a-form-item hasFeedback label="文件配置" name="fileConfig">
                        <a-textarea :rows="4" v-model:value="fileConfig"></a-textarea>
                    </a-form-item>
                </a-form> -->
                <AddFile v-model:value="fileConfig"></AddFile>

            </div>

            <div v-if="steps[current].id === 4" style="width: 500px; margin: 16px auto;">
                <a-form layout='vertical'>
                    <a-form-item hasFeedback label="产物路径" name="distPath">
                        <FileUpload v-model:value="distPath" :biz="biz_dist"></FileUpload>
                    </a-form-item>
                </a-form>

                <a-collapse collapsible="header">
                    <a-collapse-panel key="1" header="生成制作工具">
                        <a-form layout='vertical'>
                            <a-form-item label="模板文件" name="templateFilePath">
                                <FileUpload v-model:value="templateFilePath" :biz="biz_maker"></FileUpload>
                            </a-form-item>
                        </a-form>
                        <a-button type="primary" @click="makerTemplate" :loading="makerLoading">制作</a-button>
                    </a-collapse-panel>
                </a-collapse>

            </div>

        </div>
        <div class="steps-action">
            <a-button v-if="current < steps.length - 1" type="primary" @click="next">下一步</a-button>

            <a-button v-if="current == steps.length - 1" type="primary" @click="handleFinishAddAndUpdate">
                提交
            </a-button>

            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
            <a-button v-if="current == 0" style="margin-left: 8px;" @click="RouterBack">
                返回
            </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PictureUpload from '@/components/Upload/PictureUpload.vue';
import { AddCodeGeneratorAPI, FindCodeGeneratorById, UpdateCodeGeneratorAPI, MakerCodeGeneratorAPI } from '@/api';
import FileUpload from '@/components/Upload/FileUpload.vue';
import AddModel from '@/components/Upload/AddModel.vue';
import AddFile from '@/components/Upload/AddFile.vue';
import { saveAs } from 'file-saver'
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore()
const current = ref<number>(0);
const router = useRouter()
const prop = defineProps(['id'])
const biz_dist = 'generator_dist'
const biz_maker = 'generator_maker_template'
onMounted(() => {
    if (prop.id != "0") {
        fetch()

    }
})

const fetch = async () => {
    const res = await FindCodeGeneratorById({ _id: prop.id })
    if (res.code === 0) {
        formState.name = res.data.name
        formState.description = res.data.description
        formState.basePackage = res.data.basePackage
        formState.version = res.data.version
        formState.author = res.data.author
        formState.tags = res.data.tags
        formState.picture = res.data.picture
        fileConfig.value = res.data.fileConfig
        modelConfig.value = res.data.modelConfig
        distPath.value = res.data.distPath
    }

}


const next = () => {
    current.value++;
};
const prev = () => {
    current.value--;
};
const steps = [
    {
        title: '基本信息',
        id: 1,
        content: 'First-content',
    },
    {
        title: '模型配置',
        id: 2,
        content: 'Second-content',
    },
    {
        title: '文件配置',
        id: 3,
        content: 'Last-content',
    },
    {
        title: '生成器文件',
        id: 4,
        content: 'Last-content',
    },
];
const items = steps.map(item => ({ key: item.id, title: item.title }));

interface FormState {
    name: string,
    description: string,
    basePackage: string,
    version: string,
    author: string,
    tags: string[],
    picture: string

}

const formState = reactive<FormState>({
    name: '',
    description: '',
    basePackage: '',
    version: '',
    author: '',
    tags: [],
    picture: '',
})

const fileConfig = ref('{}')
const modelConfig = ref('{}')
const distPath = ref('')
const templateFilePath = ref('')



const rulesAdd = {
    name: [{
        required: true,
        trigger: 'change',
        message: '名称不能为空'
    }],
    description: [{
        required: true,
        message: '描述不能为空',
        trigger: 'change'

    }],
    basePackage: [{
        required: true,
        trigger: 'change'
    }],
    version: [{
        required: true,
        trigger: 'change'
    }],
    author: [{
        required: true,
        message: '作者名字不能为空',
        trigger: 'change'
    }],
    picture: [{
        required: true,
        trigger: 'change',
        message: '上传正确的图片'
    }],
    fileConfig: [{
        require: true,
        trigger: 'change',
        message: '文件配置不能为空'
    }],
    modelConfig: [{
        require: true,
        trigger: 'change',
        message: '模型配置不能为空'
    }],
    disPath: [{
        require: true,
        trigger: 'change',
        message: '代码生成器的路径不能为空'
    }]
}

const handleFinishAddAndUpdate = async (values: any) => {
    try {
        if (prop.id === "0") {
            const res = await AddCodeGeneratorAPI({ ...formState, fileConfig: fileConfig.value, modelConfig: modelConfig.value, distPath: distPath.value, userId: counter.userlogin._id })
            if (res.code == 0) {
                message.success('新增成功')
                router.push({ name: 'code-manager' })
            }
        } else {
            const res = await UpdateCodeGeneratorAPI({ ...formState, fileConfig: fileConfig.value, modelConfig: modelConfig.value, distPath: distPath.value, userId: counter.userlogin._id, _id: prop.id, status: 0 })
            message.success('修改成功')
            router.push({ name: 'code-manager' })
        }

    } catch (error: any) {
        message.error(error.message)
    }


};

const makerLoading = ref(false)
const makerTemplate = async () => {
    makerLoading.value = true
    const fileConfigObj = JSON.parse(fileConfig.value)
    const modelConfigObj = JSON.parse(modelConfig.value)
    const data = { name: formState.name, description: formState.description, version: formState.version, author: formState.author, modelConfig: modelConfigObj, fileConfig: fileConfigObj }
    const token = localStorage.getItem('token')
    const res = await MakerCodeGeneratorAPI({ zipTemplateFilePath: templateFilePath.value, meta: data }, token)
    saveAs(res, `${formState.name}.zip`)
    message.success('下载成功')
    templateFilePath.value = ''
    makerLoading.value = false
}

const RouterBack = () => {
    router.push({ name: 'code-manager' })
}

</script>

<style scoped>
.add-codegenerator {
    margin: 20px auto;
    padding: 20px;
    background-color: white;
}

.steps-content {
    width: 85%;
    margin: 16px auto;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: white;
    min-height: 200px;
}

.basic-information {
    margin: 16px auto;
    width: 450px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: white;
    min-height: 200px;
}

.steps-action {
    margin: 24px auto;
    width: 450px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>