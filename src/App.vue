<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: fyf
 * @Date: 2022-03-18 13:29:43
 * @LastEditors: fyf
 * @LastEditTime: 2022-03-18 13:37:49
-->
<template>
  <div id="app">
    <region-component></region-component>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
