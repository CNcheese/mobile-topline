import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.interceptors.request.use(function (config) {
  // 判断登录，已登录则为用户添加token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function (response) {
  // 判断响应结果是否游data，有则返回data数据，没有不作处理，原样返回
  return response.data.data || response.data
}, function (error) {
  return Promise.reject(error)
})

export default request
