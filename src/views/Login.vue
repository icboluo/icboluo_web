<template>
  <div>
    <el-radio-group v-model="radio1" size="small">
      <el-radio-button label="New York" />
      <el-radio-button label="Washington" />
      <el-radio-button label="Los Angeles" />
      <el-radio-button label="Chicago" />
    </el-radio-group>
    <div style="margin: 20px"></div>
    <el-form :label-position="radio2" label-width="80px">
      id
      <el-input v-model="userData.id" placeholder="Please input" />
      pwd
      <el-input
        v-model="userData.pwd"
        type="password"
        placeholder="Please input password"
        show-password
      />
      <el-button type="danger" @click="register"> register</el-button>
      <el-button type="danger" @click="login"> login</el-button>
    </el-form>
  </div>
  <Common ref="test" />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Common from '@/components/Common.vue'
import { reactive, ref } from 'vue'
import request, { axiosPost } from '@/util/Request'
import constant from '@/util/Constant'
import axiosInterceptor from '@/util/AxiosInterceptor'
import axios from 'axios'

const test = ref(Common)
const radio1 = ref('New York')
const radio2 = ref('New York')

const userData = reactive({
  id: '',
  pwd: ''
})
const router = useRouter()

function register() {
  console.log(axiosInterceptor.a)
  const response = axios.get(constant.userUrlPre + '/register', {
    params: {
      id: userData.id,
      pwd: userData.pwd
    }
  })
  response
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'register successful'
      })
    })
    .catch((error: any) => {
      return Promise.resolve(error)
    })
  test.value.test()
}

async function login() {
  let { data } = await axios.get(constant.userUrlPre + '/login', {
    params: {
      id: userData.id,
      pwd: userData.pwd
    }
  })
  if (data.code === '200' || data.code === '0') {
    ElMessage({
      type: 'success',
      message: 'login successful'
    })
    await router.push({
      path: '/frontPage'
    })
  }
}
</script>

<style scoped></style>
