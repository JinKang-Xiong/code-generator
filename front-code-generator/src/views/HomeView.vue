<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="header-inner">
        <a-flex justify="space-between" align="flex-start">
          <div class="header-inner-left">
            <div class="logo">
              <a-space>
                <img style="height: 32px;" src="../assets/logo1.png"></img>
                <span style="  font-size: 19px;font-weight: 600;">
                  代码生成器
                </span>
              </a-space>

            </div>
            <a-menu v-model:selectedKeys="selectedKeys" triggerSubMenuAction="click" theme="light" mode="horizontal"
              :style="{ lineHeight: '50px' }">
              <a-menu-item key="1" @click="RouterSearchManager">
                <HomeOutlined />首页
              </a-menu-item>
              <a-menu-item key="3" @click="RouterCodeManager">
                <ProfileOutlined />代码生成器管理
              </a-menu-item>
              <a-menu-item key="4" @click="RouterAddCode">
                <PlusOutlined />创建生成器
              </a-menu-item>
            </a-menu>
          </div>
          <div class="header-inner-right" style="cursor: pointer;">
            <a-dropdown>
              <a-space>
                <a-avatar>
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
                <span>{{ counter.userlogin.userName }}</span>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="loginOut">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-flex>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div :style="{ minHeight: '280px' }">
        <router-view></router-view>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Generator Code ©2024 Created by Code
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/stores/counter';
import { HomeOutlined, ProfileOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons-vue';

const router = useRouter()
const counter = useCounterStore()

const selectedKeys = ref<string[]>(['1']);

const RouterCodeManager = () => {
  router.push({ name: 'code-manager' })
}
const RouterSearchManager = () => {
  router.push('/home/search-manager')
}
const RouterAddCode = () => {
  router.push({ name: 'add-code', params: { id: 0 } })
}

const loginOut = () => {
  localStorage.removeItem('token')
  router.push('/')
}

</script>

<style scoped>
.header-inner {
  max-width: 1152px;
  margin: 0 auto;
}

.ant-layout-header {
  height: 50px;
  padding-inline: 50px;
  color: rgba(0, 0, 0, 0.88);
  line-height: 50px;
  background-color: #fff;
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

.layout .logo {
  float: left;
  width: 150px;
  height: 50px;

}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

/* [data-theme='dark'] .site-layout-content {
  background: #141414;
} */
</style>
