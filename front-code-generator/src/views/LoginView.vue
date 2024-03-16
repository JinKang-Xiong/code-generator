<template>
    <div class="login-div">
        <div class="top">
            <div class="header">
                <img class="login-logo" src="../assets/logo1.png">
                <span>代码生成器</span>
            </div>
            <div class="desc">
                <a-typography-text type="secondary">加快你的项目开发效率</a-typography-text>
            </div>
        </div>
        <div class="main">
            <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
                @finishFailed="onFinishFailed">
                <a-form-item label="" name="userAccount" :rules="[{ required: true, message: '请输入你的账户!' }]">
                    <a-input v-model:value="formState.userAccount" placeholder="账户" size="large">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="" name="userPassword" :rules="[{ required: true, message: '请输入你的密码!' }]">
                    <a-input-password v-model:value="formState.userPassword" placeholder="密码" size="large">
                        <template #prefix>
                            <LockOutlined class="site-form-item-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-row>
                        <a-col :span="8">
                            <a-form-item name="remember" no-style>
                                <a-checkbox v-model:checked="formState.remember">自动登录</a-checkbox>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" push="8" style="text-align: right;">
                            <a class="login-form-forgot" href="">忘记密码</a>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item>
                    <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button"
                        block="true" size="large">
                        登录
                    </a-button>
                    <!-- <a href="">register now!</a> -->
                </a-form-item>

                <a-form-item>
                    <a-row>
                        <a-col :span="8">
                            <p class="login-other">其他登录方式</p>
                        </a-col>
                        <a-col :span="8" push="8" style="text-align: right;">
                            <a class="login-form-forgot" @click="routerRegister">注册账户</a>
                        </a-col>
                    </a-row>
                </a-form-item>

            </a-form>
        </div>
    </div>
</template>


<script setup lang="ts">
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue'
import { UserLoginAPI } from '@/api';

const router = useRouter()


//#region 表单验证
interface FormState {
    userAccount: string;
    userPassword: string;
    remember: boolean;
}
const formState = reactive<FormState>({
    userAccount: '',
    userPassword: '',
    remember: false,
});
const onFinish = async (values: any) => {
    const res = await UserLoginAPI(values)
    if (res.code === 0) {
        localStorage.setItem('token', res.data.token)
        message.success('登录成功')
        router.push('/home/search-manager')
    } else {
        message.error('账号或密码错误，登录失败')
    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
    return !(formState.userAccount && formState.userPassword);
});
//#endregion


//#region 路由跳转
const routerRegister = () => {
    router.push('/register')
}
//#endregion

</script>


<style scoped>
.main {
    width: 368px;
    margin: 0 auto;
}

.login-logo {
    width: 44px;
    height: 44px;
    margin-right: 16px;
    vertical-align: top;
}

.login-div {
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