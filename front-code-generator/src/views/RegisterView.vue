<template>
    <div class="register-div">
        <div class="top">
            <div class="header">
                <img class="login-logo" src="../assets/OIG2.jpg">
                <span>代码生成器</span>
            </div>
            <div class="desc">
                <a-typography-text type="secondary">加快你的项目开发效率</a-typography-text>
            </div>
        </div>
        <div class="main" v-if="!isSuccess">
            <p>注册</p>
            <a-form :model="formState" name="normal_login" :rules="rules" class="login-form" @finish="onFinish"
                @finishFailed="onFinishFailed">
                <!-- 
                <a-form-item label="" name="userAccount" :rules="[{ required: true, min: 6, message: '请输入你的账号!' }]">
                    <a-input v-model:value="formState.userAccount" placeholder="账号" size="large">

                    </a-input>
                </a-form-item> -->


                <a-form-item label="" name="userEmail"
                    :rules="[{ required: true, pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$', message: '请输入你的邮箱!' }]">
                    <a-input v-model:value="formState.userEmail" placeholder="邮箱" size="large">

                    </a-input>
                </a-form-item>

                <a-form-item label="" name="userPassword" :rules="[{ required: true, min: 6, message: '请输入你的密码!' }]">
                    <a-input-password v-model:value="formState.userPassword" placeholder="请至少输入6个字符" size="large">
                        <template #prefix>

                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item label="" name="checkUserPassword">
                    <a-input-password v-model:value="formState.checkUserPassword" placeholder="确认密码" size="large">
                        <template #prefix>

                        </template>
                    </a-input-password>
                </a-form-item>


                <a-form-item>
                    <a-row>
                        <a-col :span="12">
                            <a-button type="primary" html-type="submit" class="login-form-button" block="true" size="large">
                                注册
                            </a-button>
                        </a-col>
                        <a-col :span="12" style="text-align: right; line-height: 40px;">
                            <a @click="routerLogin">使用已有账户登录</a>
                        </a-col>
                    </a-row>
                </a-form-item>

            </a-form>
        </div>
        <div class="main_success" v-if="isSuccess">
            <a-result status="success" :title="resultSuccess"
                sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.">
                <template #extra>
                    <a-button key="console" @click="routerLogin">去登录</a-button>
                </template>
            </a-result>
        </div>
    </div>
</template>


<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { UserRegisterAPI } from '@/api';

const router = useRouter()

//#region 表单验证
interface FormState {
    userAccount: string;
    userEmail: string;
    userPassword: string;
    checkUserPassword: string

}
const formState = reactive<FormState>({
    userAccount: '',
    userEmail: '',
    userPassword: '',
    checkUserPassword: ''

});

const checkPassword = async (_rule: Rule, value: string) => {
    if (value != formState.userPassword) {
        return Promise.reject('两次输入的密码不相等')
    }
    return Promise.resolve()
}

const rules = {
    checkpassword: [{ required: true, validator: checkPassword, trigger: 'change' }]
}

const onFinish = async (values: any) => {
    const res = await UserRegisterAPI({ userAccount: values.userEmail, ...values })
    if (res.code == 0) {
        message.success(res.data)
        formState.userAccount = values.userEmail
        isSuccess.value = true

    } else if (res.code === 10001) {
        message.error(res.data)
    }

    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
//#endregion

//显示注册成功后的结果页
const isSuccess = ref(false)
//计算注册成功页的标题
const resultSuccess = computed(() => {
    return `你的账户：${formState.userAccount}注册成功`
})


//#region 路由跳转
const routerLogin = () => {
    router.push('/')
}

//#endregion

</script>


<style scoped>
.main {
    width: 368px;
    margin: 0 auto;
}

.main-success {
    width: 368px;
    margin: 0 auto;
}

.login-logo {
    width: 44px;
    height: 44px;
    margin-right: 16px;
    vertical-align: top;
}

.register-div {
    /* margin-top: 50px; */
    padding-top: 80px;
}

.top .header {
    text-align: center;
    height: 44px;
}

.header span {
    font-size: 33px;
    font-weight: 600;
    line-height: 44px;
}

.top .desc {
    text-align: center;
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 40px;
}
</style>