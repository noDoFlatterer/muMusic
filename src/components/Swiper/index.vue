<script setup lang="ts">
import {toRefs} from "vue";
import {Banners} from "../../interface";
const props = defineProps<{
  banners:Array<Banners>|undefined
}>()
const {banners} = toRefs(props)
</script>
<template>
  <div class="block text-center">
    <el-carousel height="350px">
      <el-carousel-item v-for="item in banners" :key="item">
        <img style="width: 100%;height: 100%" :src="item.pic" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<style lang="less" scoped>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
