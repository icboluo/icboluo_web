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
      <el-input v-model="data.id" placeholder="Please input" />
      pwd
      <el-input
        v-model="data.pwd"
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
import request from '@/util/Request'
import constant from '@/util/Constant'
import axiosInterceptor from '@/util/AxiosInterceptor'

const test = ref(Common)
const radio1 = ref('New York')
const radio2 = ref('New York')

const data = reactive({
  id: '',
  pwd: ''
})
const router = useRouter()

function register() {
  console.log(axiosInterceptor.a)
  const response = request.axiosGet(constant.userUrlPre + '/register', {
    id: data.id,
    pwd: data.pwd
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
  const res = await request.get(constant.userUrlPre + '/login', {
    id: data.id,
    pwd: data.pwd
  })
  if (res.isSuccessOrPopBox()) {
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
