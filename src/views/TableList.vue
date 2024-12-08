<template>
  <BaseTable
    :table-info="tableInfo"
    @handler-cur-change="handlerCurChange"
    @handlerSizeChange="handlerSizeChange"
  >
    <template v-slot:buttonSlot="butt"> {{ butt.fieldVal }}+ {{ butt.idx }}</template>
  </BaseTable>
  <el-upload
    ref="uploadInstance"
    class="upload-demo"
    :show-file-list="false"
    :limit="1"
    :auto-upload="false"
    :on-exceed="handleExceed"
    :on-change="importFile"
  >
    <template #trigger>
      <el-button type="primary">导入</el-button>
    </template>
  </el-upload>
  <el-button @click="simpleExport">导出</el-button>
</template>

<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { simpleUpload } from '../util/Request.ts'
import constant from '../util/Constant.ts'
import { TableInfo } from '../components/BaseTable.vue'

onMounted(() => {
  invoking()
})

function handlerCurChange(curPage: number) {
  ElMessage.success(curPage + '')
}

function handlerSizeChange(pageSize: number) {
  ElMessage.success(pageSize + '')
}

const uploadInstance = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadInstance.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadInstance.value!.handleStart(file)
}

const importFile = async (file: any) => {
  if (file.status !== 'ready') {
    return
  }
  const formData = new FormData()
  formData.append('file', file.raw)
  await simpleUpload(constant.noteUrlPre + '/excel/importStudent', formData)
  ElMessage.info('导入成功')
}

function simpleExport() {

}

const tableInfo = reactive<TableInfo>({
  header: [
    {
      fieldName: 'date',
      showName: 'Date',
      width: '50%'
    },
    {
      fieldName: 'name',
      showName: 'Name',
      isButtonSlot: true
    },
    {
      fieldName: 'address',
      showName: 'Address',
      className: 'color1'
    }
  ],
  pageInfo: { total: 336, list: [] }
})

function invoking() {
  tableInfo.pageInfo.list = [
    {
      date: '2016-05-03',
      name: 'Tom1',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2017-05-02',
      name: 'Tom2',
      address: 'No. 190, Grove St, Los Angeles'
    },
    {
      date: '2018-05-04',
      name: 'Tom3',
      address: 'No. 191, Grove St, Los Angeles'
    },
    {
      date: '2019-05-01',
      name: 'Tom4',
      address: 'No. 192, Grove St, Los Angeles'
    }
  ]
}
</script>

<style scoped></style>
