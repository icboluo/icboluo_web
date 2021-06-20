<template>
  <div>
    <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="left">左对齐</el-radio-button>
      <el-radio-button label="right">右对齐</el-radio-button>
      <el-radio-button label="top">顶部对齐</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px;"></div>
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="名称">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-input v-model="formLabelAlign.region"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>
      <el-button type="primary" @click="note">
        note
      </el-button>
      <el-button type="danger" @click="note2">
        note2
      </el-button>
      <el-button type="danger" @click="fund">
        fund
      </el-button>
    </el-form>

  </div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    }
  },
  methods: {
    note () {
      this.$router.push(
        {
          path: '/note'
        }
      )
    },
    note2 () {
      this.$router.push(
        {
          path: '/note2'
        }
      )
    },
    fund () {
      this.$router.push(
        {
          path: '/fund'
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
