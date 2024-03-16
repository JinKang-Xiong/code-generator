import type { UserLoginDto } from './interface';

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }


  const userlogin = ref<UserLoginDto>({
    _id: '',
    userAccount: '',
    userName: '',
    userAvatar: '',
    userProfile: '',
    userEmail: '',
    userPhone: '',
    userRole: 0,
    userStatus: 0,
    userCodeHobby: [],
    isDelete: 0,
    createTime: '',
    updateTime: ''
  })

  const selectedKeysValue = ref<string[]>(['1'])

  return { count, doubleCount, increment, userlogin, selectedKeysValue }
})
