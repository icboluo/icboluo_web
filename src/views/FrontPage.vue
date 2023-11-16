<template>
      <el-row class="tac">
        <el-col :span="12">
          <h5 class="mb-2">Default colors</h5>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group title="Group One">
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <el-icon><document /></el-icon>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="12">
          <h5 class="mb-2">Custom colors</h5>
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group title="Group One">
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <el-icon><document /></el-icon>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>


<!--  <div>-->
<!--    <el-container style="height: 1200px; border: 1px solid #eee">-->
<!--      <el-aside width="auto" style="background-color: rgb(238, 241, 246)">-->
<!--        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">-->
<!--          <el-radio-button :label="false">展开</el-radio-button>-->
<!--          <el-radio-button :label="true">收起</el-radio-button>-->
<!--        </el-radio-group>-->
<!--        &lt;!&ndash;                 unique-opened  是否只保持一个子菜单的展开-->
<!--                                 select函数  路由跳转的关键        	&ndash;&gt;-->
<!--        <el-menu-->
<!--          :default-active="$route.path"-->
<!--          :default-openeds="['1', '3']"-->
<!--          class="el-menu-vertical-demo"-->
<!--          @select="handleSelect"-->
<!--          @open="handleOpen"-->
<!--          @close="handleClose"-->
<!--          :collapse="isCollapse"-->
<!--        >-->
<!--          <el-sub-menu index="4">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-setting"></i>-->
<!--              <span slot="title">Note</span>-->
<!--            </template>-->
<!--            <el-menu-item-group>-->
<!--              <template slot="title">列表</template>-->
<!--              <el-menu-item index="/note">列表展示</el-menu-item>-->
<!--              <el-menu-item index="4-2">选项2</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-menu-item-group title="配置">-->
<!--              <el-menu-item index="4-3">选项3</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-sub-menu index="4-4">-->
<!--              <template slot="title">选项4</template>-->
<!--              <el-menu-item index="4-4-1">选项4-1</el-menu-item>-->
<!--            </el-sub-menu>-->
<!--          </el-sub-menu>-->
<!--          <el-sub-menu index="1">-->
<!--            <template slot="title"-->
<!--              ><i class="el-icon-message"></i> <span slot="title">Fund</span></template-->
<!--            >-->
<!--            <el-menu-item-group>-->
<!--              <template slot="title">分组一</template>-->
<!--              <el-menu-item index="/fund">fund</el-menu-item>-->
<!--              <el-menu-item index="1-2">选项2</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-menu-item-group title="分组2">-->
<!--              <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-sub-menu index="1-4">-->
<!--              <template slot="title">选项4</template>-->
<!--              <el-menu-item index="1-4-1">选项4-1</el-menu-item>-->
<!--            </el-sub-menu>-->
<!--          </el-sub-menu>-->
<!--          <el-sub-menu index="2">-->
<!--            <template slot="title"-->
<!--              ><i class="el-icon-menu"></i> <span slot="title">Game</span></template-->
<!--            >-->
<!--            <el-menu-item-group>-->
<!--              <template slot="title">分组一</template>-->
<!--              <el-menu-item index="/game">game</el-menu-item>-->
<!--              <el-menu-item index="2-2">选项2</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-menu-item-group title="分组2">-->
<!--              <el-menu-item index="2-3">选项3</el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--            <el-sub-menu index="2-4">-->
<!--              <template slot="title">选项4</template>-->
<!--              <el-menu-item index="2-4-1">选项4-1</el-menu-item>-->
<!--            </el-sub-menu>-->
<!--          </el-sub-menu>-->
<!--        </el-menu>-->
<!--      </el-aside>-->

<!--      <el-container>-->
<!--        <el-header style="text-align: right; font-size: 12px">-->
<!--          <el-dropdown>-->
<!--            <i class="el-icon-setting" style="margin-right: 15px"></i>-->
<!--            <el-dropdown-menu slot="dropdown">-->
<!--              <el-dropdown-item>查看</el-dropdown-item>-->
<!--              <el-dropdown-item>新增</el-dropdown-item>-->
<!--              <el-dropdown-item>删除</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--          </el-dropdown>-->
<!--          <span>王小虎</span>-->
<!--        </el-header>-->

<!--        <el-main style="background-color: rgb(238, 241, 246)">-->
<!--          <router-view></router-view>-->
<!--        </el-main>-->
<!--      </el-container>-->
<!--    </el-container>-->
<!--  </div>-->
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const labelPosition = ref('right')
const isCollapse = ref(true)
const formLabelAlign = reactive({
  name: '',
  region: '',
  type: ''
})
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
