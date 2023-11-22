// 定义组件
const btn = {
  template: `
    <div>
      <button @click="count++">你点我了！我记住了,你点了{{count}}次！</button>
    </div>
    `,
  data(){
    return {
      count: 0
    }
  }
};
// 注册组件，全局注册
Vue.component("counter", btn);