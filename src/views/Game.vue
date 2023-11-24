<template>
  <div>
    <div>
      <el-container>
        <el-header>
          <el-dropdown split-button type="primary" @click="myRole">
            所有角色
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="(item) in dropdownShow">
                  <el-dropdown-item @click="findById(item.id)">
                    {{ item }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          GAME
          <el-button type="primary" @click="addRole">增加角色</el-button>
        </el-header>
        <el-container v-bind:style="{ height: '1300px' }">
          <el-aside width="200px">
            <div v-bind:style="{ height: '100px' }">
              <el-text type="primary" @click="findById(player.id)">个人信息</el-text>
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
                :percentage="'经验'+alUtil.percentage(player.experience, player.curTotalExperience, 0)"
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
                v-for="(item, idx) in alUtil.toDoubleArray(allMonster)"
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
import { onUnmounted, reactive, ref } from "vue";
import request from "@/util/Request";
import constant from "@/util/Constant";
import alUtil from "@/util/AlUtil";

let dropdownShow = ref([{
  id: 0,
  name: ""
}]);
let player = reactive({
  id: 0,
  age: 0,
  attack: 0,
  blood: 0,
  maxBlood: 0,
  experience: 0,
  totalExperience: 0,
  curTotalExperience: 0,
  level: "",
  name: ""
});

let allMonster = ref([]);
let cultivationCareer = ref();
let timer = ref();

async function myRole() {
  const res = await request.simpleGet(constant.gameUrlPre + "/player/myRole");
  dropdownShow.value = res;
}

async function addRole() {
  await request.simpleGet(constant.gameUrlPre + "/player/addRole");
}

async function findById(id?: number) {
  if (id) {
    player.id = id;
  }
  let res = await request.simpleGet(constant.gameUrlPre + "/player/exhibit", { id: player.id });
  player.id = res.id;
  player.age = res.age;

  player.attack = res.attack;
  player.blood = res.blood;
  player.maxBlood = res.maxBlood;
  player.experience = res.experience;
  player.totalExperience = res.totalExperience;
  player.curTotalExperience = res.curTotalExperience;
  player.level = res.level;
  player.name = res.name;
  await allMonsterFun();
}

async function nextMonster() {
  await request.simpleGet(constant.gameUrlPre + "/player/nextMonster");
  await allMonsterFun();
}

async function attack(monsterId: string) {
  await request.simpleGet(constant.gameUrlPre + "/player/attack", {
    playerId: player.id,
    monsterId: monsterId
  });
  await findById();
  await allMonsterFun();
}

async function allMonsterFun() {
  let res = await request.simpleGet(constant.gameUrlPre + "/player/allMonster");
  allMonster.value = res;
}

async function cultivationCareerFunCycle() {
  let res = await request.simpleGet(constant.gameUrlPre + "/cultivationCareer/cultivationCareer", {
    id: player.id
  });
  cultivationCareer.value = res.list;
  await findById();
}

async function reFresh() {
  await cultivationCareerFunCycle();
  timer.value = window.setInterval(() => {
    setTimeout(cultivationCareerFunCycle, 0);
  }, 9000);
}

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped></style>
;
