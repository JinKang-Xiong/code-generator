<template>
    <a-descriptions :column="2">
        <template #title>
            <ExclamationCircleOutlined />
            基本信息
        </template>
        <a-descriptions-item label="输入根路径">{{ fileConfig.inputRootPath }}</a-descriptions-item>
        <a-descriptions-item label="输出根路径">{{ fileConfig.outputRootPath }}</a-descriptions-item>
        <a-descriptions-item label="项目根路径">{{ fileConfig.sourceRootPath }}</a-descriptions-item>
        <a-descriptions-item label="文件类别">{{ fileConfig.type }}</a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <a-descriptions :column="1">
        <template #title>
            <FileOutlined />
            文件信息
        </template>
        <template v-for="item in fileConfig.files">
            <template v-if="item.type == 'group'">
                <a-descriptions-item>
                    <a-descriptions :title="item.groupName" :column="1">
                        <a-descriptions-item label="分组key">{{ item.groupKey }}</a-descriptions-item>
                        <a-descriptions-item label="分组名">{{ item.groupName }}</a-descriptions-item>
                        <a-descriptions-item label="条件">{{ item.condition }}</a-descriptions-item>
                        <a-descriptions-item label="组内文件">
                            <a-descriptions :column="1">
                                <template v-for="(el, index) in item.files">
                                    <a-descriptions-item>
                                        <a-descriptions :column="2">
                                            <a-descriptions-item label="输入路径">{{ el.inputPath }}</a-descriptions-item>
                                            <a-descriptions-item label="输出路径">{{ el.outputPath }}</a-descriptions-item>
                                            <a-descriptions-item label="文件类别">{{ el.type }}</a-descriptions-item>
                                            <a-descriptions-item label="文件生成类别">{{ el.generatorType }}</a-descriptions-item>
                                        </a-descriptions>
                                    </a-descriptions-item>
                                </template>
                            </a-descriptions>

                        </a-descriptions-item>
                        <!-- <a-descriptions-item> <a-divider></a-divider></a-descriptions-item> -->
                    </a-descriptions>
                </a-descriptions-item>
                <a-descriptions-item span="2"> <a-divider></a-divider></a-descriptions-item>


            </template>
            <template v-if="item.type === 'file'">
                <a-descriptions-item>
                    <a-descriptions :column="2">
                        <a-descriptions-item label="输入路径">{{ item.inputPath }}</a-descriptions-item>
                        <a-descriptions-item label="输出路径">{{ item.outputPath }}</a-descriptions-item>
                        <a-descriptions-item label="文件类别">{{ item.type }}</a-descriptions-item>
                        <a-descriptions-item label="文件生成类别">{{ item.generatorType }}</a-descriptions-item>
                        <!-- <a-descriptions-item span="2"> <a-divider></a-divider></a-descriptions-item> -->
                    </a-descriptions>

                </a-descriptions-item>
                <a-descriptions-item span="2"> <a-divider></a-divider></a-descriptions-item>


            </template>
        </template>
    </a-descriptions>
</template>
  
<script setup lang="ts">
import { ExclamationCircleOutlined, FileOutlined } from '@ant-design/icons-vue';
import { reactive, defineProps, onMounted, watch } from 'vue'


const prop = defineProps(['value'])






// interface FilesModel {
//     inputPath: string
//     outputPath: string
//     type: string
//     generatorType: string
// }


// interface GroupModel {
//     groupKey: string
//     groupName: string
//     type: string
//     condition: string
//     files: FilesModel[]
// }


interface FileConfig {
    inputRootPath: string
    fileName: string
    outputRootPath: string
    sourceRootPath: string
    type: string
    files: any
}

const fileConfig = reactive<FileConfig>({
    inputRootPath: '',
    fileName: '',
    outputRootPath: '',
    sourceRootPath: '',
    type: '',
    files: []
})



//字符串转换为对象
const transferFileConfig = (data: string) => {
    if (data) {
        const res = JSON.parse(data)
        console.log(res.inputRootPath)
        let tempGroup: any = []
        let tempFile: any = []
        res.files.forEach((el: any) => {
            if (el.type == 'group') {
                tempGroup.push(el)
            } else {
                tempFile.push(el)
            }
        })

        res.files = [...tempGroup, ...tempFile]

        fileConfig.inputRootPath = res.inputRootPath
        fileConfig.fileName = res.fileName
        fileConfig.outputRootPath = res.outputRootPath
        fileConfig.sourceRootPath = res.sourceRootPath
        fileConfig.type = res.type
        fileConfig.files = [...res.files]
    }

}






//监听事件
watch(() => prop.value, (newValue, oldValue) => {
    transferFileConfig(prop.value)
}, { immediate: true })

</script>

<style scoped></style>
  