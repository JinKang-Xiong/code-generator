<template>
    <div class="search-manager">
        <header>
            <div class="search-content">
                <a-input-search v-model:value="value" placeholder="搜索代码生成器" enter-button="搜索" size="large"
                    @search="onSearch" />
            </div>
        </header>
        <main>
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="最新">
                    <NowSearch :search-value="searchText"></NowSearch>
                </a-tab-pane>
                <!-- <a-tab-pane key="2" tab="推荐" force-render>Content of Tab Pane 2</a-tab-pane> -->
            </a-tabs>
        </main>
    </div>

</template>

<script setup lang="ts">
// import NowSearch from '../../components/SearchManager/NowSearch.vue'
import NowSearch from '@/components/SearchManager/NowSearch.vue';

const activeKey = ref('1');


import { ref } from 'vue';
const value = ref<string>('');
const searchText = ref<string>('')

const onSearch = (searchValue: string) => {
    console.log('use value', searchValue);
    console.log('or use this.value', value.value);
    searchText.value = searchValue
};


</script>


<style scoped>
.search-content {
    width: 722px;
    margin: 0px auto;
}

.search-manager {
    max-width: 1152px;
    margin: 50px auto;
}
</style>