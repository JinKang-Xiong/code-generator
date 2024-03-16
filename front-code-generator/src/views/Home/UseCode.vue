<template>
    <div class="detail-basic">
        <a-row>
            <a-col :span="16">
                <a-space :size="30">
                    <a-typography-title :level="3">{{ formStateDes.name }}</a-typography-title>
                    <a-tag v-for="item in formStateDes.tags">
                        {{ item }}
                    </a-tag>
                </a-space>
                <!-- <a-typography-paragraph>{{ formState.description }}</a-typography-paragraph>
                <a-typography-paragraph type="secondary">创建时间：{{ formState.createTime }}</a-typography-paragraph>
                <a-typography-paragraph type="secondary">基础包：{{ formState.basePackage }}</a-typography-paragraph>
                <a-typography-paragraph type="secondary">版本：{{ formState.version }}</a-typography-paragraph>
                <a-typography-paragraph type="secondary">作者：{{ formState.author }}</a-typography-paragraph> -->
                <a-form :model="formState">
                    <template v-for="item in listForm.models">

                        <template v-if="!item.hasOwnProperty('groupKey')">
                            <a-form-item :label="item.description">
                                <a-input v-if="item.type === 'string'" v-model:value="formState[item.fieldName]" />
                                <a-radio-group v-if="item.type === 'boolean'" v-model:value="formState[item.fieldName]">
                                    <a-radio value="true">是</a-radio>
                                    <a-radio value="false">否</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </template>

                        <template v-if="item.hasOwnProperty('groupKey')">
                            <a-collapse v-model:activeKey="activeKey" collapsible="header">
                                <a-collapse-panel :key="item.groupKey" :header="item.groupName">
                                    <template v-for="el in item.model">

                                        <a-form-item :label="el.description">
                                            <a-input v-if="el.type === 'string'"
                                                v-model:value="formState[el.fieldName]" />
                                            <a-radio-group v-if="el.type === 'boolean'"
                                                v-model:value="formState[el.fieldName]">
                                                <a-radio value="true">是</a-radio>
                                                <a-radio value="false">否</a-radio>
                                            </a-radio-group>
                                        </a-form-item>

                                    </template>
                                </a-collapse-panel>
                            </a-collapse>
                        </template>
                    </template>
                </a-form>



                <a-divider />
                <a-space>
                    <a-button type="primary" @click="useCodeGenerator" :loading="useLoading">
                        <DownloadOutlined v-if="!useLoading"></DownloadOutlined>
                        生成代码
                    </a-button>
                    <a-button @click="RouterDetail">
                        <CreditCardOutlined />查看详情
                    </a-button>
                </a-space>
            </a-col>
            <a-col :span="8">
                <a-image :width="300" :src="baseImgURL + formStateDes.picture" />
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">

import { reactive, defineProps, onMounted, ref } from 'vue'
import { DownloadOutlined, CreditCardOutlined } from '@ant-design/icons-vue';
import FileConfig from '../../components/Detail/FileConfig.vue'
import ModelConfig from '@/components/Detail/ModelConfig.vue';
import { FindCodeGeneratorById, DownLoadAPI, UseCodeGeneratorAPI } from '@/api'
import { baseImgURL } from '@/utils/constans';
import { saveAs } from 'file-saver'
import { Tag, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const prop = defineProps(['id'])

onMounted(() => {
    fetch()
})


const activeKey = ref(false)
const formState = reactive<any>({
    // isNeed: null,
    // loopSet: null,
    // strName: ''
})

const formStateDes = reactive<any>({
    name: '',
    tags: [],
    picture: ''
})

let listForm = reactive<any>({
    models: []
})

const fetch = async () => {
    try {
        const res = await FindCodeGeneratorById({ _id: prop.id })
        if (res.code === 0) {
            formStateDes.name = res.data.name
            formStateDes.picture = res.data.picture
            formStateDes.tags = res.data.tags
            const modelConfig = res.data.modelConfig
            const dataObject = JSON.parse(modelConfig)
            let groupArr: any = []
            let fileArr: any = []

            dataObject.models.forEach((el: any) => {
                if (el.hasOwnProperty('groupKey')) {
                    let item: any = {
                        groupKey: el.groupKey,
                        groupName: el.groupName,
                        model: []
                    }

                    el.model.forEach((elModel: any) => {
                        let itemModel = {
                            fieldName: elModel.fieldName,
                            type: elModel.type,
                            description: elModel.description
                        }

                        formState[elModel.fieldName] = elModel.defaultValue

                        item.model.push(itemModel)
                    })
                    groupArr.push(item)
                } else {
                    let itemFile: any = {
                        fieldName: el.fieldName,
                        type: el.type,
                        description: el.description
                    }

                    formState[el.fieldName] = el.defaultValue

                    fileArr.push(itemFile)
                }
            })

            listForm.models = [...fileArr, ...groupArr]
        }

    } catch (error) {

    }
}

const useLoading = ref(false)

const useCodeGenerator = async () => {
    useLoading.value = true
    const token = localStorage.getItem('token')
    // const filepath = formState.distPath
    try {
        const res = await UseCodeGeneratorAPI({ id: prop.id, data: formState }, token)
        console.log(res)
        saveAs(res, 'out-generator.zip')
        message.success('下载成功')
        useLoading.value = false

    } catch (error) {

    }
}

const RouterDetail = () => {
    router.push({ name: 'detail-code', params: { id: prop.id } })
}

</script>


<style scoped>
.detail-basic {
    max-width: 1152px;
    margin: 50px auto;
    height: 345px;
    background-color: white;
    padding: 24px;
}
</style>