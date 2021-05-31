<template>
  <div>
    <div style="width: 500px;height: 600px;border-right: 1px solid #000;float:left">
      <div>timeNoteAmount: {{this.timeNoteAmount}}</div>
      <div>weekTimeAmount: {{this.weekTimeAmount}}</div>
      <div>monthTimeAmount: {{this.monthTimeAmount}}</div>
      <div>totalTimeAmount: {{this.totalTimeAmount}}</div>
      <form action="http://localhost:1514/selectByFiled" method="get">
        <label>
          <input type="text" name="filed" class="input-type">
        </label>
        <br>
        查询: <input type="submit"/><!--提交按钮-->
      </form>
      <div>message: {{this.message}}</div>
      <div>
        <form action="http://localhost:1514/add" method="post" >
          problem <label>
          <input type="text" name="problem" class="input-type">
          <br>
        </label>
          result <label>
          <input type="text" name="result" class="input-type">
          <br>
        </label>
          scope <label>
          <input type="text" name="scope">
          <br>
        </label>
          新增 <input type="submit"/>
        </form>
      </div>
    </div>
    <div style="margin-left: 100px;">
      <ul>
        <li class="left">problem</li>
        <li>{{this.object.problem}}</li>
        <li class="left">finish time</li>
        <li>{{this.object.finishTime}}</li>
        <li class="left">scop</li>
        <li>{{this.object.belongToScope}}</li>
        <li class="left">type</li>
        <li>{{this.object.type}}</li>
      </ul>
      <button @click="finish">finish</button>
      <button @click="onlyUpdate">onlyUpdate</button>
      <button @click="notFinish">notFinish</button>
      <button @click="onlyRead">onlyRead</button>
      <br>
      <button @click="result">result</button>
      <div v-if="showResult">{{this.object.result}}</div>
      <br>
    </div>
    <div>
      <form action="http://localhost:1514/update" method="post" >
        problem <label>
        <input type="text" name="problem" class="input-type">
        <br>
      </label>
        result <label>
        <input type="text" name="result" class="input-type">
        <br>
      </label>
        scope <label>
        <input type="text" name="belongToScope">
        <br>
      </label>
        更新 <input type="submit"/>
      </form>
    </div>
  </div>
</template>

<script>
import Common from '../components/Common'

export default {
  comments: {Common},
  data () {
    return {
      data: {},
      code: {},
      message: {},
      showResult: false,
      object: {},
      timeNoteAmount: {},
      weekTimeAmount: {},
      monthTimeAmount: {},
      totalTimeAmount: {}
    }
  },
  mounted: function () {
    this.$axios.get(Common.urlPre + '/selectProblem')
      .then(r => {
        this.data = r.data.data
        this.object = r.data.data.object
        this.message = r.data.message
        this.code = r.data.code
        this.amount()
      }).catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    public: function (url) {
      this.$axios.get(Common.urlPre + url)
        .then(r => {
          this.message = r.data.message
          this.code = r.data.code
        }).catch(function (error) {
          console.log(error)
        })
      location.reload()
    },
    finish: function () {
      this.public('/updateFinishTime')
    },
    onlyUpdate: function () {
      this.public('/onlyUpdateTime')
    },
    notFinish: function () {
      this.public('/updateNotFinishTime')
    },
    onlyRead: function () {
      this.public('/toOnlyRead')
    },
    amount: function () {
      this.$axios.get(Common.urlPre + '/selectAmount')
        .then(r => {
          var map = r.data.data.object
          console.log(map)
          console.log(this)
          this.timeNoteAmount = map.timeNoteAmount
          this.weekTimeAmount = map.weekTimeAmount
          this.monthTimeAmount = map.monthTimeAmount
          this.totalTimeAmount = map.totalTimeAmount
        }).catch(function (error) {
          console.log(error)
        })
    },
    result: function () {
      this.showResult = true
    }
  }
}
</script>

<style scoped>
  .left {
    float: left;
    width: 200px
  }

  .input-type {
    width: 400px;
    height: 50px
  }
</style>
