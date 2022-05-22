<template>
  <div>
    <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="left">左对齐</el-radio-button>
      <el-radio-button label="right">右对齐</el-radio-button>
      <el-radio-button label="top">顶部对齐</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px;"></div>
    <el-form :label-position="labelPosition" label-width="80px">
      <el-form-item label="id">
        <el-input v-model="id"></el-input>
      </el-form-item>
      <el-form-item label="pwd">
        <el-input v-model="pwd"></el-input>
      </el-form-item>

      <el-button type="danger" @click="register">
        register
      </el-button>
      <el-button type="danger" @click="login">
        login
      </el-button>
    </el-form>

  </div>
</template>

<script>
import Common, {getRequest} from '../components/Common'
import {Message} from 'element-ui'

export default {
  data () {
    return {
      labelPosition: 'right',
      id: null,
      pwd: null
    }
  },
  methods: {
    register () {
      getRequest(
        Common.userUrlPre + '/register',
        {
          id: this.id,
          pwd: this.pwd
        }
      ).then(() => {
        Message.success({
          message: 'register successful'
        })
      }, err => {
        return Promise.resolve(err)
      }
      )
    },
    login () {
      getRequest(
        Common.userUrlPre + '/login',
        {
          id: this.id,
          pwd: this.pwd
        }
      ).then(() => {
        Message.success({
          message: 'login successful'
        })
        this.$router.push(
          {
            path: '/frontPage'
          }
        )
      }, err => {
        return Promise.resolve(err)
      }
      )
    }
  }
}
</script>

<style scoped>

</style>
