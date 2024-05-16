<template>
  <div class="common-layout">
    <el-container style="height: 1200px">
      <el-aside width="auto" style="background-color: rgb(238, 241, 246)">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <!--                 unique-opened  是否只保持一个子菜单的展开
                                 select函数  路由跳转的关键        	-->
        <el-menu
          :default-active="$route.path"
          :default-openeds="['1', '3']"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
        >
          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span>Note</span>
            </template>
            <el-menu-item-group>
              <template slot="title">列表</template>
              <el-menu-item index="/note">列表展示</el-menu-item>
              <el-menu-item index="/tableList">TableList</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="配置">
              <el-menu-item index="/pictureGraph">图形</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="4-4">
              <template #title>选项4</template>
              <el-menu-item index="4-4-1">选项4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <icon-menu />
              </el-icon>
              <span>Fund</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/fund">fund</el-menu-item>
              <el-menu-item index="/fundMetric">metric</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="/fundData">detail</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <setting />
              </el-icon>
              <span>Game</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/game">game</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" disabled>
            <el-icon>
              <document />
            </el-icon>
            <template #title>Navigator Three</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <span>王小虎</span>
        </el-header>

        <el-main style="background-color: rgb(238, 241, 246)">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const router = useRouter()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

function handleSelect(path: any) {
  router.push(path)
}
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
