<template>
    <div class="detail-code">
        <div class="detail-basic">
            <a-row>
                <a-col :span="16">
                    <a-space :size="30">
                        <a-typography-title :level="3">{{ formState.name }}</a-typography-title>
                        <a-tag v-for="item in formState.tags">
                            {{ item }}
                        </a-tag>
                    </a-space>
                    <a-typography-paragraph>{{ formState.description }}</a-typography-paragraph>
                    <a-typography-paragraph type="secondary">创建时间：{{ formState.createTime }}</a-typography-paragraph>
                    <a-typography-paragraph type="secondary">基础包：{{ formState.basePackage }}</a-typography-paragraph>
                    <a-typography-paragraph type="secondary">版本：{{ formState.version }}</a-typography-paragraph>
                    <a-typography-paragraph type="secondary">作者：{{ formState.author }}</a-typography-paragraph>
                    <a-divider />
                    <a-space>
                        <a-button type="primary" @click="RouterUseCode">立即使用</a-button>
                        <a-button @click="downLoadFile">
                            <DownloadOutlined />下载
                        </a-button>
                    </a-space>
                </a-col>
                <a-col :span="8">
                    <a-image :width="300" :src="baseImgURL + formState.picture" />
                </a-col>
            </a-row>
        </div>

        <div class="detail-other">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="文件配置">
                    <FileConfig :value="formState.fileConfig"></FileConfig>
                </a-tab-pane>
                <a-tab-pane key="2" tab="模型配置" force-render>
                    <ModelConfig :value="formState.modelConfig"></ModelConfig>
                </a-tab-pane>
                <a-tab-pane key="3" tab="作者信息">
                    <a-space :size="20">
                        <a-avatar :size="64"
                            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png">

                        </a-avatar>
                        {{ formState.author }}
                    </a-space>
                    <!-- <a-row>
                    <a-col :span="2">
                        <a-avatar :size="64">
                            <template #icon>
                                <UserOutlined />
                            </template>
</a-avatar>
</a-col>
<a-col :span="8">
    {{ formState.author }}
</a-col>
</a-row> -->
                </a-tab-pane>
            </a-tabs>

        </div>
    </div>

</template>


<script setup lang="ts">
import { reactive, defineProps, onMounted, ref } from 'vue'
import { DownloadOutlined } from '@ant-design/icons-vue';
import FileConfig from '../../components/Detail/FileConfig.vue'
import ModelConfig from '@/components/Detail/ModelConfig.vue';
import { FindCodeGeneratorById, DownLoadAPI } from '@/api'
import { baseImgURL } from '@/utils/constans';
import { saveAs } from 'file-saver'
import { Tag, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const prop = defineProps(['id'])
const activeKey = ref('1');

onMounted(() => {
    fetch()
})


interface FormState {
    name: string,
    description: string,
    createTime: string,
    basePackage: string,
    version: string,
    author: string,
    tags: string[],
    picture: string,
    fileConfig: string,
    modelConfig: string,
    distPath: string

}

const formState = reactive<FormState>({
    name: '',
    description: '',
    createTime: '',
    basePackage: '',
    version: '',
    author: '',
    tags: [],
    picture: '',
    fileConfig: '',
    modelConfig: '',
    distPath: ''
})

const fetch = async () => {
    try {
        const res = await FindCodeGeneratorById({ _id: prop.id })
        if (res.code === 0) {
            let date = new Date(res.data.createTime)
            formState.createTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            formState.name = res.data.name
            formState.description = res.data.description
            formState.basePackage = res.data.basePackage
            formState.version = res.data.version
            formState.author = res.data.author
            formState.tags = res.data.tags
            formState.picture = res.data.picture
            formState.fileConfig = res.data.fileConfig
            formState.modelConfig = res.data.modelConfig
            formState.distPath = res.data.distPath
        }

    } catch (error) {

    }
}

const downLoadFile = async () => {
    const token = localStorage.getItem('token')
    const filepath = formState.distPath
    try {
        const res = await DownLoadAPI({ filepath, id: prop.id }, token)
        console.log(res)
        saveAs(res, filepath.slice(filepath.lastIndexOf('/') + 1))
        message.success('下载成功')

    } catch (error) {

    }
}

const RouterUseCode = () => {
    router.push({ name: 'use-code', params: { id: prop.id } })
}



</script>


<style scoped>
.detail-code {
    max-width: 1152px;
    margin: 50px auto;
}

.detail-basic {
    height: 345px;
    background-color: white;
    padding: 24px;
}

.detail-other {
    background-color: white;
    padding: 24px;
    margin-top: 25px;
}
</style>