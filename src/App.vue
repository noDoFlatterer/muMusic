<script setup lang="ts">
import Header from './components/Header/index.vue'
import Player from './components/Player/index.vue'
import {getHeight,getWidth} from "./utils";
import {onMounted, ref} from 'vue'
let box = ref<HTMLElement>()
let main =ref<HTMLElement>()
onMounted(()=>{
  // 执行初始化函数
  init()
  // 窗口发生变化，重新计算值
  window.onresize = ()=>{
    init()
  }
})
/**
 * 初始化函数
 */
function init() {
  if(box.value&&main.value){
    box.value.style.height = getHeight()+'px'
    box.value.style.width = getWidth()+'px'
    main.value.style.height = getHeight()-40-60+'px'
  }
}
</script>
<template>
  <div ref="box" class="box">
    <Header></Header>
    <div ref="main" class="main">
      <router-view></router-view>
    </div>
    <div class="player_box">
      <Player></Player>
    </div>
  </div>
</template>

<style lang="less">
.box{
  .player_box{
    width: 100%;
    height: 60px;
    z-index: 100;
  }
}
*{
  user-select: none;
}
</style>
