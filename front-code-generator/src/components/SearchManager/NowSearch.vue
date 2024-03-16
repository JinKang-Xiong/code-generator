<template>
    <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState"
        @finish="onFinishSearch">
        <a-row :gutter="24" class="tab-content">

            <a-col :span="9">
                <a-form-item name="authoe" label="作者" :rules="[{ required: false, message: '请输入' }]">
                    <a-input v-model:value="formState.author" placeholder="请输入"></a-input>
                </a-form-item>
            </a-col>

            <a-col :span="9">
                <a-form-item name="tags" label="标签" :rules="[{ required: false, message: '请输入' }]">
                    <a-select v-model:value="formState.tags" mode="tags" style="width: 100%"
                        placeholder="请选择"></a-select>
                </a-form-item>
            </a-col>

            <a-col :span="5" style="text-align: right">
                <a-button type="primary" html-type="submit" @click="">查询</a-button>
                <a-button style="margin: 0 8px" @click="resetUser">重置</a-button>
            </a-col>

        </a-row>
    </a-form>
    <a-flex wrap="wrap" gap="large">
        <div style="width: 320px; margin: 0 auto;" v-if="dataSource.length < 1 ? true : false">
            <a-empty description="无数据"></a-empty>
        </div>

        <a-card v-else hoverable style="width: 256px" :bodyStyle="{ 'padding-bottom': '5px', 'height': '140px' }"
            v-for="(item, index) in dataSource" @click="RouterDetail(item._id)">
            <template #cover>
                <img style="height: 256px;" alt="example" :src="baseImgURL + item.picture" />
            </template>
            <template #actions>
                <a-row>
                    <a-col :span="18">
                        <a-typography-text type="secondary">{{ item.createTime }}</a-typography-text>
                    </a-col>
                    <a-col :span="4">
                        <a-avatar
                            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
                    </a-col>
                </a-row>
            </template>
            <a-card-meta :title="item.name">
                <template #description>
                    <a-typography-paragraph :ellipsis="ellipsis ? { rows: 2, } : false" :content="item.description" />
                </template>
            </a-card-meta>
            <div class="tag-content">
                <a-tag v-for="(el, index) in item.tags">{{ el }}</a-tag>
            </div>
        </a-card>
    </a-flex>
    <a-row justify="end">
        <a-pagination defaultPageSize="8" v-model:current="current" :total="total" @change="pageChangeData" />
    </a-row>
</template>



<script setup lang="ts">
import { BigSearchCodeGeneratorAPI, SmallSearchCodeGeneratorAPI } from '@/api';
import { reactive, ref, defineProps, watch, onMounted } from 'vue'
import { transferTime } from '../../utils/transfer'
import { baseImgURL } from '../../utils/constans'
import { useRouter } from 'vue-router';


const prop = defineProps(['searchValue'])
const router = useRouter()

onMounted(() => {
    feth({ pageNumber: 1, pageSize: 8 })
})

watch(() => prop.searchValue, (newValue, oldValue) => {
    console.log('监听器得值')
    console.log(newValue, oldValue);
    feth({ pageNumber: 1, pageSize: 8, name: newValue, description: newValue })
    current.value = 1

})

interface fethQuery {
    pageNumber: number
    pageSize: number
    name?: string;
    description?: string
}

const dataSource = ref<any>([])
const total = ref()
const ellipsis = ref(true);

const feth = async (query: fethQuery) => {
    const res = await BigSearchCodeGeneratorAPI(query)
    isSearch.value = true
    if (res.code === 0) {
        res.data.resultSer.forEach((el: any) => {
            el.createTime = transferTime(el.createTime)
        })
        dataSource.value = [...res.data.resultSer]
        total.value = res.data.total
    }
}


//#region 小搜索
const isSearch = ref(true)

interface FormState {
    author: string
    tags: string[]
}

const current = ref(1);

const pageChangeData = (pageNumber: any, pageSize: any) => {
    if (!prop.searchValue) {
        if (isSearch) {
            feth({ pageNumber, pageSize })
        } else {
            fethSmall({ ...formState, pageNumber, pageSize, name: prop.searchValue, description: prop.searchValue })
        }
    } else {
        if (isSearch) {
            feth({ pageNumber, pageSize, name: prop.searchValue, description: prop.searchValue })
        } else {
            fethSmall({ ...formState, pageNumber, pageSize, name: prop.searchValue, description: prop.searchValue })
        }
    }
    console.log(pageNumber + pageSize)

}

const formState = reactive<FormState>({
    author: '',
    tags: []
})

const onFinishSearch = (values: any) => {
    fethSmall({ ...values, pageNumber: 1, pageSize: 8, name: prop.searchValue, description: prop.searchValue })
}

interface FethSmall {

    pageNumber: number
    pageSize: number
    name?: string
    description?: string
    author?: string
    tags?: string[]
}

const fethSmall = async function (query: FethSmall) {
    const res = await SmallSearchCodeGeneratorAPI(query)
    isSearch.value = false
    if (res.code === 0) {
        res.data.resultSer.forEach((el: any) => {
            el.createTime = transferTime(el.createTime)
        })
        dataSource.value = [...res.data.resultSer]
        total.value = res.data.total
    }
}

const resetUser = () => {
    formState.author = ''
    formState.tags = []
    fethSmall({ ...formState, pageNumber: 1, pageSize: 8, name: prop.searchValue, description: prop.searchValue })

}
//#endregion


//#region
const RouterDetail = (id: string) => {
    router.push({ name: 'detail-code', params: { id } })
}


//#endregion


</script>


<style scoped>
.tag-content {
    margin-top: 20px;
}

.tab-content {
    background: white;
    margin-left: 0px;
    padding: 24px;
    padding-bottom: 4px;
    margin-bottom: 20px;
}

.card-content {
    display: flex;
}
</style>