<template>
  <div>
    <el-container style="height: 1200px; border: 1px solid #eee">
      <el-aside width="auto" style="background-color: rgb(238, 241, 246)">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <!--                 unique-opened  是否只保持一个子菜单的展开
                                 select函数  路由跳转的关键        	-->
        <el-menu :default-active="$route.path"
                 :default-openeds="['1', '3']"
                 class="el-menu-vertical-demo"
                 @select="handleSelect"
                 @open="handleOpen" @close="handleClose" :collapse="isCollapse">

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">Note</span>
            </template>
            <el-menu-item-group>
              <template slot="title">列表</template>
              <el-menu-item index="/note">列表展示</el-menu-item>
              <el-menu-item index="4-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="配置">
              <el-menu-item index="4-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="4-4">
              <template slot="title">选项4</template>
              <el-menu-item index="4-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>
              <span slot="title">Fund</span></template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/fund">fund</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>
              <span slot="title">Game</span></template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/game">game</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>

        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>王小虎</span>
        </el-header>

        <el-main style="background-color: rgb(238,241,246)">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import router from '../router'

export default {
  name: 'FrontPage',
  data () {
    return {
      router: router,
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
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
