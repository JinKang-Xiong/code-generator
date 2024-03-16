<template>
  <div class="code-manager">
    <a-typography-title :level="4">生成器管理</a-typography-title>
    <div class="usermanage-search">
      <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState"
        @finish="onFinishSearch">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item name="name" label="名称" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="formState.name" placeholder=""></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="6"> <a-form-item name="description" label="描述" :rules="[{ required: false, message: '请输入' }]">
              <a-input v-model:value="formState.description" placeholder=""></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="tags" label="标签" :rules="[{ required: false, message: '请输入' }]">
              <a-select v-model:value="formState.tags" mode="tags" style="width: 100%" placeholder="Tags Mode"
                @change="handleChange"></a-select>
            </a-form-item>
          </a-col>

          <a-col :span="5" style="text-align: right" v-show="!expand">
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button style="margin: 0 8px" @click="resetUser">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="usermanage-list-header">
      <a-row justify="space-between">
        <a-col :span="2" style="line-height: 32px;">
          <span style="font-size: 16px; font-weight: 500;">查询表格</span>
        </a-col>
        <a-col :span="1">
          <a-button type="primary" @click="showModal">新增</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="usermanage-list">
      <a-table :columns="columns" :row-key="(record: any) => record.id" :data-source="dataSource" :loading="loading"
        :pagination="pagination" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'picture'">
            <div style="width: 80px ;height: 80px;  overflow: hidden;">
              <a-image :width="80" :height="80" :src="baseImgURL + record.picture" />
            </div>
          </template>
          <template v-if="column.dataIndex === 'tags'">
            <a-space>
              <a-tag v-for="item in record.tags">{{ item }}</a-tag>
            </a-space>
          </template>
          <!-- <template v-if="column.dataIndex === 'gender'">
                    {{ text == '1' ? '男' : '女' }}
                </template> -->
          <template v-if="column.dataIndex === 'edit'">
            <a @click="editShow(record._id)">编辑</a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm v-if="dataSource.length" title="确定删除吗" okText="确定" cancelText="取消"
              @confirm="onDelete(record._id)">
              <a>注销</a>
            </a-popconfirm>
          </template>
        </template>

      </a-table>
    </div>
  </div>

</template>

<script setup lang="ts">
import { SearchCodeGeneratorAPI, AddCodeGeneratorAPI, FindCodeGeneratorById, UpdateCodeGeneratorAPI, DeleteCodeGeneratorAPI } from '../../api'
import type { SerachCodeGenerator } from '../../api/interface'
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useCounterStore } from '../../stores/counter';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { baseImgURL } from '@/utils/constans';
const counter = useCounterStore()
// const prop = defineProps(['id'])
const router = useRouter()

onMounted(() => {
  // console.log("数据=" + counter.userlogin._id)
  console.log(counter.userlogin._id)
  feth({ pageNumber: current.value, pageSize: pageSize.value, userId: counter.userlogin._id })

})


watch(() => counter.userlogin._id, (newValue, oldVlaue) => {
  console.log('监听事件');

  console.log(newValue, oldVlaue)

  feth({ pageNumber: current.value, pageSize: pageSize.value, userId: counter.userlogin._id })

})



//#region 搜索功能
const expand = ref(false);
const formRef = ref();

interface ForState {
  name: string,
  description: string,
  tags: string[]
}

const formState = reactive<ForState>({
  name: '',
  description: '',
  tags: []
});
const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('formState: ', formState);
  current.value = 1;
  pageSize.value = 10;
  feth({ pageNumber: current.value, pageSize: pageSize.value, ...values, userId: counter.userlogin._id })
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const resetUser = () => {
  console.log("点击重置");

  formState.name = ''
  formState.description = ''
  formState.tags = []
  current.value = 1;
  pageSize.value = 10;
  feth({ pageNumber: current.value, pageSize: pageSize.value, userId: counter.userlogin._id })
}

//#endregion


//#region 新增用户功能
const visible = ref(false);
const showModal = () => {
  router.push({ name: 'add-code', params: { id: 0 } })
};

const formRefAdd = ref();

interface FormStateAdd {
  name: string,
  description: string,
  basePackage: string,
  version: string,
  author: string,
  tags: string[],
  picture: string
  fileConfig: string,
  modelConfig: string,
  distPath: string,
  [key: string]: any
}

const formStateAdd = reactive<FormStateAdd>({
  name: '',
  description: '',
  basePackage: '',
  version: '',
  author: '',
  tags: [],
  picture: '',
  fileConfig: '',
  modelConfig: '',
  distPath: '',
})



const handleFinishAdd = async (values: any) => {
  const res = await AddCodeGeneratorAPI({ ...formStateAdd, userId: counter.userlogin._id })
  if (res.code === 0) {
    message.success('新增成功')
    visible.value = !visible.value
    for (let key in formStateAdd) {
      if (key === 'tags') {
        formStateAdd[key] = []
      } else {
        formStateAdd[key] = ''
      }
    }
  } else {
    message.error('新增失败')
  }

};

//#endregion


// #region 表格的数据和函数
const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true
  },
  {
    title: '基础包',
    dataIndex: 'basePackage',
    ellipsis: true
  },
  {
    title: '版本',
    dataIndex: 'version'
  },
  {
    title: '作者',
    dataIndex: 'author',
    ellipsis: true,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 130
  },
  {
    title: '图片',
    dataIndex: 'picture',
    ellipsis: true
  },
  {
    title: '文件配置',
    dataIndex: 'fileConfig',
    ellipsis: true
  },
  {
    title: '模型配置',
    dataIndex: 'modelConfig',
    ellipsis: true
  },
  {
    title: '代码生成器产物路径',
    dataIndex: 'distPath',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    ellipsis: true,
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    ellipsis: true,
  },
  {
    title: '编辑',
    dataIndex: 'edit'
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];
const current = ref(1)
const pageSize = ref(10)
const loading = ref(true)
const dataSource = ref<any>([])
const total = ref()
const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}));

const handleTableChange = (pag: any, filters: any, sorter: any) => {
  console.log(pag);
  console.log(filters);
  console.log(sorter);
  current.value = pag.current;
  pageSize.value = pag.pageSize;
  const pageObject = {
    pageNumber: pag.current,
    pageSize: pag.pageSize
  }
  feth({ ...pageObject, ...formState, userId: counter.userlogin._id })
};

async function feth(param: SerachCodeGenerator) {
  loading.value = true;
  console.log(param);
  const res = await SearchCodeGeneratorAPI(param)
  loading.value = false
  if (res.code == 0 && res.data.resultSer) {
    dataSource.value = [...res.data.resultSer]
  }
  total.value = res.data.total


}

// #endregion 


// #region 编辑和注销的功能

// interface FormStateEdit extends FormStateAdd {
//   _id: string,
//   status: number
// }

// let formStateEdit = reactive<FormStateEdit>({
//   _id: '',
//   name: '',
//   description: '',
//   basePackage: '',
//   version: '',
//   author: '',
//   tags: [],
//   picture: '',
//   fileConfig: '',
//   modelConfig: '',
//   distPath: '',
//   status: 0
// })
// const editVisible = ref(false)

const editShow = async (id: string) => {
  router.push({ name: 'add-code', params: { id } })

  // const res = await FindCodeGeneratorById({ _id: id })
  // if (res.code === 0) {
  //   formStateEdit = { ...res.data }

  //   editVisible.value = !editVisible.value
  // }
}

// const handleOkEdit = async () => {
//   const res = await UpdateCodeGeneratorAPI({ ...formStateEdit, userId: counter.userlogin._id })
//   if (res.code === 0) {
//     message.success('修改成功')
//     editVisible.value = !editVisible.value
//     feth({ pageNumber: current.value, pageSize: pageSize.value, userId: counter.userlogin._id })
//   } else {
//     message.error('修改失败')
//   }

// }

const onDelete = async (id: string) => {
  const res = await DeleteCodeGeneratorAPI({ _id: id })
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }


  feth({ pageNumber: current.value, pageSize: pageSize.value, userId: counter.userlogin._id })
};
// #endregion

</script>

<style scoped>
.usermanage-list-header {
  background-color: white;
  height: 50px;
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.usermanage-search {
  background: white;
  margin-left: 0px;
  padding: 24px;
  padding-bottom: 4px;
  margin-bottom: 20px;
}

.code-manager {
  margin: 40px auto;
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
</style>
