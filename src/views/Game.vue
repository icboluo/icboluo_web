<template>
  <div>
    <el-input v-model="id" :disabled="false" placeholder="请输入id"></el-input>

    <div>
      <el-container>
        <el-header>
          <div>
            GAME
            <el-button type="primary" @click="startGame">START</el-button>
          </div>
        </el-header>
        <el-container v-bind:style="{ height: '1300px' }">
          <el-aside width="200px">
            <div v-bind:style="{ height: '100px' }">
              <el-button type="primary" @click="findById">个人信息</el-button>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag>姓名 {{ player.name }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag>年龄 {{ player.age }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag>攻击 {{ player.attack }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag type="danger">血量 {{ player.blood }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '180px' }">
              <el-tag type="info">最大血量 {{ player.maxBlood }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '20px' }">
              <el-progress
                :text-inside="true"
                :stroke-width="26"
                :percentage="
                  '经验' + tableUtil.percentage(player.experience, player.curTotalExperience, 0)
                "
              >
              </el-progress>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag type="info">经验 {{ player.experience }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag type="info">总经验 {{ player.totalExperience }}</el-tag>
              <br />
            </div>
            <div v-if="player" v-bind:style="{ height: '100px' }">
              <el-tag type="info">级别 {{ player.level }}</el-tag>
              <br />
            </div>
          </el-aside>
          <el-main>
            <div>
              怪物{{ allMonster.length }}只
              <button @click="nextMonster">发现一只怪物</button>
            </div>
            <div>
              <el-row
                v-if="allMonster"
                v-for="(item, idx) in tableUtil.totalRow(allMonster)"
                :key="idx"
                :gutter="20"
              >
                <el-col v-for="(rowItem, rowIdx) in item" :key="rowIdx" :span="6">
                  <div class="grid-content bg-purple">
                    <div v-bind:style="{ height: '100px' }">
                      <el-tag>姓名 {{ rowItem.name }}</el-tag>
                      <br />
                    </div>
                    <div v-bind:style="{ height: '100px' }">
                      <el-tag>攻击 {{ rowItem.attack }}</el-tag>
                      <br />
                    </div>
                    <div v-bind:style="{ height: '100px' }">
                      <el-tag type="danger">血量 {{ rowItem.blood }}</el-tag>
                      <br />
                    </div>
                    <div v-bind:style="{ height: '100px' }">
                      <el-tag type="info">最大血量 {{ rowItem.maxBlood }}</el-tag>
                      <br />
                    </div>
                    <div>
                      <button @click="attack(rowItem.id)">战斗</button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-main>
          <el-aside width="400px">
            <button @click="reFresh">Cultivation Career</button>
            <div
              v-if="cultivationCareer"
              v-for="(item, idx) in cultivationCareer"
              :key="idx"
              v-bind:style="{ height: '100px' }"
            >
              {{ item.oper }}
            </div>
          </el-aside>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import request from '@/util/Request'
import tableUtil from '@/components/TableUtil.vue'
import constant from '@/util/Constant'

let id = ref()
let player = ref({
  age: 0,
  attack: 0,
  blood: 0,
  maxBlood: 0,
  experience: 0,
  totalExperience: 0,
  curTotalExperience: 0,
  level: 0,
  name
})
const monster = reactive({
  id: null,
  attack: 0,
  blood: 0,
  show: false
})
let allMonster = ref([])
let cultivationCareer = ref()
let timer = ref()

async function startGame() {
  const res = await request.get(constant.gameUrlPre + '/player/startGame')
  if (res.isSuccessOrPopBox()) {
    id.value = res.data
  }
}

async function findById() {
  let res = await request.get(constant.gameUrlPre + '/player/exhibit', { id: id.value })
  if (res.isSuccessOrPopBox()) {
    player.value = res.data
    await allMonsterFun()
  }
}

async function nextMonster() {
  monster.show = true
  let res = await request.get(constant.gameUrlPre + '/player/nextMonster')
  if (res.isSuccessOrPopBox()) {
    monster.id = res.data.id
    monster.attack = res.data.attack
    monster.blood = res.data.blood
    await allMonsterFun()
  }
}

async function attack(monsterId: string) {
  let res = await request.get(constant.gameUrlPre + '/player/attack', {
    playerId: id.value,
    monsterId: monsterId
  })
  if (res.isSuccessOrPopBox()) {
    await findById()
    await allMonsterFun()
  }
}

async function allMonsterFun() {
  let res = await request.get(constant.gameUrlPre + '/player/allMonster')
  if (res.isSuccessOrPopBox()) {
    allMonster.value = res.data
  }
}

async function cultivationCareerFunCycle() {
  let res = await request.get(constant.gameUrlPre + '/cultivationCareer/cultivationCareer', {
    id: id.value
  })
  if (res.isSuccessOrPopBox()) {
    cultivationCareer.value = res.data.list
  }
  await findById()
}

async function reFresh() {
  await cultivationCareerFunCycle()
  timer.value = window.setInterval(() => {
    setTimeout(cultivationCareerFunCycle, 0)
  }, 9000)
}

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped></style>
;
