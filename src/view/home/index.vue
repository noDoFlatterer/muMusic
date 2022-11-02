<script setup lang="ts">
import Swiper from '../../components/Swiper/index.vue'
import RecommendList from './RecommendList/index.vue'
import {onMounted} from "vue";
import {getSwiper, getSongList} from "../../request";
import {ref, Ref} from 'vue'
import {Banners, RecSongList} from "../../interface";

let banners: Ref<Array<Banners> | undefined> = ref([])
let Recommended_song_list: Ref<Array<RecSongList> | undefined> = ref([])
onMounted(() => {
  init()
})

/**
 * 初始化函数，获取轮播图数据，歌单列表数据
 */
function init() {
  getSwiper().then(res => {
    let temp = res.data.blocks[0].extInfo.banners
    temp.map((item1: any) => {
      banners.value?.push({
        pic: item1.pic
      })
    })
  })
  getSongList().then((res: any) => {
    Recommended_song_list.value = res.result
  })
}
</script>
<template>
  <div class="box">
    <!--    轮播图-->
    <div class="swiper">
      <Swiper :banners="banners"></Swiper>
    </div>
    <div style="height: 40px;font-size: 20px;
    font-weight: normal;
    line-height: 40px;">推荐歌单
    </div>
    <!--    歌单展示-->
    <div class="song_list">
      <RecommendList :Recommended_song_list="Recommended_song_list"></RecommendList>
    </div>
  </div>
</template>
<style lang="less" scoped>
.swiper {
  height: 350px;
  overflow: hidden;
}

.box {
  width: 80%;
  height: 98%;
  margin-left: 10%;

  .song_list {
    width: 100%;
    height: calc(100% - 380px);
  }
}
</style>

