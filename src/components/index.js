/*
 * @Description:
 * @Version: 2.0
 * @Autor: fyf
 * @Date: 2021-09-29 18:04:57
 * @LastEditors: fyf
 * @LastEditTime: 2022-03-18 14:05:06
 */

import regionComponent from "./region/region-component.vue";

const region = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
  install: function(Vue) {
    Vue.component("region-component", regionComponent);
  }
};
// 导出
export default region;
