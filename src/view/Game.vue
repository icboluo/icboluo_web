<template>
  <div>
    <el-input v-model="id" placeholder="请输入id"></el-input>
    <el-button type="primary" @click="findById">find</el-button>
    <div>
      <el-tag>攻击 {{ this.player.attack }}</el-tag>
      <el-tag type="danger">血量 {{ this.player.blood }}</el-tag>
      <el-tag type="info">经验 {{ this.player.experience }}</el-tag>
      <el-tag type="info">级别 {{ this.player.level }}</el-tag>
      <el-tag type="info">最大血量 {{ this.player.maxBlood }}</el-tag>
    </div>
    <div>
      <button @click="nextMonster">发现一只怪物</button>
      <el-tag v-show="monster.show">攻击 {{ this.monster.attack }}</el-tag>
      <el-tag v-show="monster.show" type="danger">血量 {{ this.monster.blood }}</el-tag>
    </div>
    <div>
      <button @click="attack">进行攻击</button>
    </div>
  </div>
</template>

<script>
import Common, {getRequest} from '../components/Common'

export default {
  name: 'Game',
  data () {
    return {
      id: null,
      player: {
        attack: 0,
        blood: 0,
        experience: 0,
        level: 0,
        maxBlood: 0
      },
      monster: {
        id: null,
        attack: 0,
        blood: 0,
        show: false
      }
    }
  },
  methods: {
    findById () {
      getRequest(Common.noteUrlPre + '/player/' + this.id)
        .then(r => {
          this.player.attack = r.attack
          this.player.blood = r.blood
          this.player.experience = r.experience
        })
    },
    nextMonster () {
      this.monster.show = true
      getRequest(Common.noteUrlPre + '/player/nextMonster')
        .then(r => {
          this.monster.id = r.id
          this.monster.attack = r.attack
          this.monster.blood = r.blood
        })
    },
    attack () {
      getRequest(Common.noteUrlPre + '/player/' + this.id + '/attack',
        this.monster
      ).then(r => {
        this.monster.id = r.id
        this.monster.attack = r.attack
        this.monster.blood = r.blood
        this.findById()
        this.nextMonster()
      })
    }
  }
}
</script>

<style scoped>

</style>
