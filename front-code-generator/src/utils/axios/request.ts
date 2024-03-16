import { baseURL, headers } from "./config";

import axios from 'axios'

const service = axios.create({
    baseURL,
    timeout: 120000,
    headers
})


//request请求拦截器
service.interceptors.request.use((config) => {
    console.log('请求拦截器经过')
    return config
}, (error) => {
    Promise.reject(error)
})


//response响应拦截器
service.interceptors.response.use(
    (res) => {
        console.log('Node服务器响应拦截器')

        const status = res.status || 201 || 200
        const message = res.data.message
        console.log(res)
        if (status == 201 || status == 200) {
            console.log(res)
            console.log(res.data)
            return res.data
        } else {
            console.warn('响应错误')
            return message
        }
    },
    (error) => {
        return error
    }
)



export default service


