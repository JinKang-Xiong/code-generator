<template>
    <div class="add-model">
        <template v-for="(item, index) in modelConfig.models">


            <a-card v-if="!item.hasOwnProperty('groupKey')" size="small" title="表单" style="width: 80%;margin: 16px auto;">
                <template #extra>
                    <CloseOutlined @click="removeModels(item)" style="cursor: pointer;"></CloseOutlined>
                </template>
                <a-form layout='vertical' :model="item">
                    <a-space>
                        <a-form-item label="字段名" name="fieldName" :rules="{
                            required: true,
                            message: '请输入字段名',
                        }">
                            <a-input v-model:value="item.fieldName" />
                        </a-form-item>
                        <a-form-item label="类型" name="type" :rules="{
                            required: true,
                            message: '请输入类型',
                        }">
                            <a-input v-model:value="item.type" />
                        </a-form-item>
                        <a-form-item label="描述" name="description" :rules="{
                            required: true,
                            message: '请输入描述',
                        }">
                            <a-input v-model:value="item.description" />
                        </a-form-item>
                        <a-form-item label="默认值" name="defaultValue" :rules="{
                            required: true,
                            message: '请输入默认值',
                        }">
                            <a-input v-model:value="item.defaultValue" />
                        </a-form-item>
                        <a-form-item label="缩写" name="abbr" :rules="{
                            required: true,
                            message: '请输入缩写',
                        }">
                            <a-input v-model:value="item.abbr" />
                        </a-form-item>
                    </a-space>

                </a-form>
            </a-card>

            <a-card v-if="item.hasOwnProperty('groupKey')" size="small" title="分组" style="width: 80%;margin: 16px auto;">
                <template #extra>
                    <CloseOutlined @click="removeModels(item)" style="cursor: pointer;"></CloseOutlined>
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
                        <a-form-item label="描述">
                            <a-input v-model:value="item.description" />
                        </a-form-item>
                        <a-form-item label="默认值">
                            <a-input v-model:value="item.defaultValue" />
                        </a-form-item>
                        <a-form-item label="简写">
                            <a-input v-model:value="item.abbr" />
                        </a-form-item>
                        <a-form-item label="条件">
                            <a-input v-model:value="item.condition" />
                        </a-form-item>
                    </a-space>
                </a-form>
                <p>分组字段</p>
                <a-form layout='vertical' ref="formRef" name="dynamic_form_nest_item" :model="item" @finish="onFinish">
                    <a-space v-for="(model, modelindex) in item.model" :key="modelindex"
                        style="display: flex; margin-bottom: 8px" align="center">
                        <a-form-item label="字段名" :name="['model', modelindex, 'fieldName']" :rules="{
                            required: true,
                            message: '请输入字段名',
                        }">
                            <a-input v-model:value="model.fieldName" />
                        </a-form-item>
                        <a-form-item label="类型" :name="['model', modelindex, 'type']" :rules="{
                            required: true,
                            message: '请输入类型',
                        }">
                            <a-input v-model:value="model.type" />
                        </a-form-item>
                        <a-form-item label="描述" :name="['model', modelindex, 'description']" :rules="{
                            required: true,
                            message: '请输入描述',
                        }">
                            <a-input v-model:value="model.description" />
                        </a-form-item>
                        <a-form-item label="默认值" :name="['model', modelindex, 'defaultValue']" :rules="{
                            required: true,
                            message: '请输入默认值',
                        }">
                            <a-input v-model:value="model.defaultValue" />
                        </a-form-item>
                        <a-form-item label="缩写" :name="['model', modelindex, 'abbr']" :rules="{
                            required: true,
                            message: '请输入缩写',
                        }">
                            <a-input v-model:value="model.abbr" />
                        </a-form-item>

                        <a-button danger type="text" @click="removeModel(model, index)"> 删除 </a-button>
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
                <a-col :span="20" offset="2">
                    <a-button type="dashed" block @click="addItem">
                        <PlusOutlined />
                        增加字段
                    </a-button>
                </a-col>
            </a-row>
            <a-row style="margin-top: 20px;">
                <a-col :span="20" offset="2">
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
    if (dataObject.hasOwnProperty('models')) {
        console.log('又属性')
        modelConfig.models = [...dataObject.models]
    }
})


interface ModelConfig {
    models: any
}

interface GroupModel {
    groupKey: string;
    groupName: string
    type: string
    description: string
    defaultValue: string
    abbr: string
    condition: string
    model: Model[]
}

interface Model {
    fieldName: string;
    type: string;
    description: string;
    defaultValue: string
    abbr: string

}

let modelConfig = reactive<any>({
    models: []
})

const addItem = () => {
    console.log('点击增加');

    modelConfig.models.push({
        fieldName: '',
        type: '',
        description: '',
        defaultValue: '',
        abbr: ''
    })
}

const addGroup = () => {
    console.log('点击增加');
    modelConfig.models.push({
        groupKey: '',
        groupName: '',
        type: '',
        description: '',
        defaultValue: '',
        abbr: '',
        condition: '',
        model: []
    })
}



const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ model: Model[] }>({
    model: [],
});
const removeModel = (item: Model, modelsindex: any) => {
    const index = modelConfig.models[modelsindex].model.indexOf(item);
    if (index !== -1) {
        modelConfig.models[modelsindex].model.splice(index, 1);
    }
};

const removeModels = (item: any) => {
    const index = modelConfig.models.indexOf(item);
    if (index !== -1) {
        modelConfig.models.splice(index, 1);
    }
};

const addModel = (index: any) => {
    modelConfig.models[index].model.push({
        fieldName: '',
        type: '',
        description: '',
        defaultValue: '',
        abbr: ''
    })
};
const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    console.log('dynamicValidateForm.users:', dynamicValidateForm.model);
};

watch(modelConfig, (newValue, oldValue) => {
    console.log('监听到modelConfig的变化')
    const dataStr = JSON.stringify(modelConfig)
    triggerChange(dataStr)
})



</script>
  
 
<style scoped>
.add-model {
    background-color: white;
}
</style>
  