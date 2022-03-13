<template>
  <div>
    <el-input v-model="id" placeholder="请输入id"></el-input>
    <el-button type="primary" @click="findById">find</el-button>
    <div>
      <button @click="nextMonster">发现一只怪物</button>
    </div>

    <div>
      <el-container>
        <el-header>GAME</el-header>
        <el-container v-bind:style="{height:'800px'}">
          <el-aside width="200px">
            <div v-bind:style="{height:'100px'}">
              个人信息
              <br>
            </div>
            <div v-bind:style="{height:'100px'}">
              <el-tag>年龄 {{ this.player.age }}</el-tag>
              <br>
            </div>
            <div v-bind:style="{height:'100px'}">
              <el-tag>攻击 {{ this.player.attack }}</el-tag>
              <br>
            </div>
            <div v-bind:style="{height:'100px'}">
              <el-tag type="danger">血量 {{ this.player.blood }}</el-tag>
              <br>
            </div>
            <div v-bind:style="{height:'100px'}">
              <el-tag type="info">经验 {{ this.player.experience }}</el-tag>
              <br>
            </div>
            <div v-bind:style="{height:'100px'}">
              <el-tag type="info">级别 {{ this.player.level }}</el-tag>
              <br>
            </div>
            <div v-bind:style="{height:'100px'}">
              <el-tag type="info">最大血量 {{ this.player.maxBlood }}</el-tag>
              <br>
            </div>
          </el-aside>
          <el-main>
            怪物{{ allMonster.length }}只
            <div>
              <el-row v-if="allMonster" v-for="(item,idx) in tableUtil.totalRow(allMonster)" :key="idx" :gutter="20">
                <el-col v-for="(rowItem,rowIdx) in item" :key="rowIdx" :span="6">
                  <div class="grid-content bg-purple">
                    <div v-bind:style="{height:'100px'}">
                      <el-tag>攻击 {{ rowItem.attack }}</el-tag>
                      <br>
                    </div>
                    <div v-bind:style="{height:'100px'}">
                      <el-tag type="danger">血量 {{ rowItem.blood }}</el-tag>
                      <br>
                    </div>
                    <div v-bind:style="{height:'100px'}">
                      <el-tag type="info">最大血量 {{ rowItem.maxBlood }}</el-tag>
                      <br>
                    </div>
                    <div>
                      <button @click="attack(rowItem.id)">战斗</button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import Common, {getRequest} from '../components/Common'
import TableUtil from '../components/TableUtil'

export default {
  name: 'Game',
  data () {
    return {
      tableUtil: TableUtil,
      id: null,
      player: {
        age: 0,
        attack: 0,
        blood: 0,
        experience: 0,
        level: null,
        maxBlood: 0
      },
      monster: {
        id: null,
        attack: 0,
        blood: 0,
        show: false
      },
      allMonster: []
    }
  },
  methods: {
    findById () {
      getRequest(Common.noteUrlPre + '/player/' + this.id)
        .then(r => {
          this.player = r
        })
      this.allMonsterFun()
    },
    nextMonster () {
      this.monster.show = true
      getRequest(Common.noteUrlPre + '/player/nextMonster')
        .then(r => {
          this.monster.id = r.id
          this.monster.attack = r.attack
          this.monster.blood = r.blood
        })
      this.allMonsterFun()
    },
    attack (monsterId) {
      getRequest(Common.noteUrlPre + '/player/attack', {
        playerId: this.id, monsterId: monsterId
      }
      ).then(r => {
        this.findById()
      })
    },
    allMonsterFun () {
      getRequest(Common.noteUrlPre + '/player/allMonster').then(r => {
        this.allMonster = r
      })
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

</style>
