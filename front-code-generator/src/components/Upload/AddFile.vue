<template>
    <div style="width: 80%; margin: 0px auto; margin-bottom: 20px;">
        <a-alert message="如果不需要使用在线制作功能，可不填写" type="warning" closable />
    </div>
    <div class="add-model">
        <template v-for="(item, index) in fileConfig.files">
            <a-card v-if="!item.hasOwnProperty('groupKey')" size="small" title="表单" style="margin: 16px auto;">
                <template #extra>
                    <CloseOutlined @click="removeFiles(item)" style="cursor: pointer;"></CloseOutlined>
                </template>
                <a-form layout='vertical' :model="item">
                    <a-space>
                        <a-form-item label="输入路径" name="inputPath" :rules="{
            required: true,
            message: '请输入输入路径',
        }">
                            <a-input v-model:value="item.inputPath" />
                        </a-form-item>
                        <a-form-item label="输出路径" name="outputPath" :rules="{
            required: true,
            message: '请输入输出路径',
        }">
                            <a-input v-model:value="item.outputPath" />
                        </a-form-item>
                        <a-form-item label="类型" name="type" :rules="{
            required: true,
            message: '请输入类型',
        }">
                            <a-input v-model:value="item.type" />
                        </a-form-item>
                        <a-form-item label="模板文件类型" name="generatorType" :rules="{
            required: true,
            message: '请输入模板文件类型',
        }">
                            <a-input v-model:value="item.generatorType" />
                        </a-form-item>
                    </a-space>

                </a-form>
            </a-card>

            <a-card v-if="item.hasOwnProperty('groupKey')" size="small" title="分组" style="margin: 16px auto;">

                <template #extra>
                    <CloseOutlined @click="removeFiles(item)" style="cursor: pointer;"></CloseOutlined>
                </template>
                <a-form layout='vertical' :model="item">
                    <a-space>
                        <a-form-item label="分组键">
                            <a-input v-model:value="item.groupKey" />
                        </a-form-item>
                        <a-form-item label="分组名称">
                            <a-input v-model:value="item.groupName" />
                        </a-form-item>
                        <a-form-item label="类型">
                            <a-input v-model:value="item.type" />
                        </a-form-item>
                        <a-form-item label="条件">
                            <a-input v-model:value="item.condition" />
                        </a-form-item>
                    </a-space>
                </a-form>
                <p>分组字段</p>
                <a-form layout='vertical' ref="formRef" name="dynamic_form_nest_item" :model="item" @finish="onFinish">
                    <a-space v-for="(file, modelindex) in item.files" :key="modelindex"
                        style="display: flex; margin-bottom: 8px" align="center">
                        <a-form-item label="输入路径" :name="['files', modelindex, 'inputPath']" :rules="{
            required: true,
            message: '请输入输入路径',
        }">
                            <a-input v-model:value="file.inputPath" />
                        </a-form-item>
                        <a-form-item label="输出路径" :name="['files', modelindex, 'outputPath']" :rules="{
            required: true,
            message: '请输入输出路径',
        }">
                            <a-input v-model:value="file.outputPath" />
                        </a-form-item>
                        <a-form-item label="类型" :name="['files', modelindex, 'type']" :rules="{
            required: true,
            message: '请输入类型',
        }">
                            <a-input v-model:value="file.type" />
                        </a-form-item>
                        <a-form-item label="模板类型" :name="['files', modelindex, 'generatorType']" :rules="{
            required: true,
            message: '请输入模板类型',
        }">
                            <a-input v-model:value="file.generatorType" />
                        </a-form-item>

                        <a-button danger type="text" @click="removeFile(file, index)"> 删除 </a-button>
                    </a-space>
                    <a-form-itema-form-item>
                        <a-button type=" dashed" block @click="addModel(index)">
                            <PlusOutlined />
                            添加组内字段
                        </a-button>
                    </a-form-itema-form-item>
                </a-form>
            </a-card>

        </template>

        <div>
            <a-row>
                <a-col :span="24">
                    <a-button type="dashed" block @click="addItem">
                        <PlusOutlined />
                        增加字段
                    </a-button>
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px;">
                <a-col :span="24">
                    <a-button type="dashed" block @click="addGroup">
                        <PlusOutlined />
                        增加分组
                    </a-button>
                </a-col>
            </a-row>
        </div>


    </div>
</template>

<script setup lang="ts">
import { CloseOutlined } from '@ant-design/icons-vue';

import { reactive, ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { Form } from 'ant-design-vue';

const prop = defineProps(['value'])
const emit = defineEmits(['update:value'])

const formItemContext = Form.useInjectFormItemContext()
const triggerChange = (changedValue: any) => {
    emit('update:value', changedValue)
    formItemContext.onFieldBlur()
}

onMounted(() => {
    const dataObject = JSON.parse(prop.value)
    console.log('挂载成功')
    if (dataObject.hasOwnProperty('files')) {
        console.log('又属性')
        fileConfig.files = [...dataObject.files]
    }
})


interface FileConfig {
    files: any
}

interface GroupFile {
    groupKey: string;
    groupName: string
    type: string
    condition: string
    files: Files[]
}

interface Files {
    inputValue: string;
    type: string;
    outputValue: string;
    generatorType: string
}

let fileConfig = reactive<any>({
    files: []
})

const addItem = () => {
    console.log('点击增加');

    fileConfig.files.push({
        inputPath: '',
        type: '',
        outputPath: '',
        generatorType: '',
    })
}

const addGroup = () => {
    console.log('点击增加');
    fileConfig.files.push({
        groupKey: '',
        groupName: '',
        type: '',
        condition: '',
        files: []
    })
}



const formRef = ref<FormInstance>();
// const dynamicValidateForm = reactive<{ model: File[] }>({
//     model: [],
// });
const removeFile = (item: any, modelsindex: any) => {
    const index = fileConfig.files[modelsindex].files.indexOf(item);
    if (index !== -1) {
        fileConfig.files[modelsindex].files.splice(index, 1);
    }
};

const removeFiles = (item: any) => {
    const index = fileConfig.files.indexOf(item);
    if (index !== -1) {
        fileConfig.files.splice(index, 1);
    }
};

const addModel = (index: any) => {
    fileConfig.files[index].files.push({
        inputPath: '',
        type: '',
        outputPath: '',
        generatorType: '',
    })
};
const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    // console.log('dynamicValidateForm.users:', dynamicValidateForm.model);
};

watch(fileConfig, (newValue, oldValue) => {
    console.log('监听到modelConfig的变化')
    const dataStr = JSON.stringify(fileConfig)
    triggerChange(dataStr)
})



</script>


<style scoped>
.add-model {
    background-color: white;
    width: 80%;
    margin: 0px auto;
}
</style>