/// <reference types="vite/client" />
// 解决无法识别vue组件的问题，导致导包异常，还需要更新tsconfig.json配置
declare module '*.vue' {
  import {DefineComponent} from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
