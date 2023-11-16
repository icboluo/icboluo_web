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

let test = ref(Common)
const radio1 = ref('New York')
const radio2 = ref('New York')

const data = reactive({
  id: '',
  pwd: ''
})

function register() {
  const promise = request.sendGet(constant.userUrlPre + '/register', {
    id: data.id,
    pwd: data.pwd
  })
  promise
    .then((res) => {
      ElMessage({
        type: 'success',
        message: 'register successful'
      })
    })
    .catch((error) => {
      return Promise.resolve(error)
    })
  test.value.test()
}

function login() {
  const promise = request.sendGet(constant.userUrlPre + '/login', {
    id: data.id,
    pwd: data.pwd
  })
  promise
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'login successful'
      })
      const router = useRouter()
      router.push({
        path: '/frontPage'
      })
    })
    .catch((err) => {
      return Promise.resolve(err)
    })
}
</script>

<style scoped></style>
