<script setup lang="ts">
import Introduce from './Introduce/index.vue'
import Table from './table/index.vue'
import {onMounted} from "vue";
import {getSongListDetail} from "../../request";
import {useRoute} from "vue-router";
import {ref,Ref} from 'vue'
import {SongListDescript, SongList} from "../../interface";

const route = useRoute()
let song_d:Ref<SongListDescript|undefined> = ref({} as SongListDescript)
let songList:Ref<Array<SongList|undefined>> = ref([])
onMounted(() => {
  init()
})

function init() {
  getSongListDetail(Number(route.query.id)).then((res:any) => {
    song_d.value = res.playlist
    songList.value = res.playlist.tracks
  })
}
</script>
<template>
  <div class="list">
    <div class="title1">
      首页/推荐歌单页
    </div>
    <div class="list_introduce">
      <Introduce :song_d="song_d"></Introduce>
    </div>
    <div class="title1">
      首页/推荐歌单页
    </div>
    <div class="list_table">
     <Table :songList="songList"></Table>
    </div>
  </div>
</template>
<style lang="less" scoped>
.list {
  width: 90%;
  height: 100%;
  margin-left: 5%;
  //background-color: red;

  .title1 {
    height: 40px;
  }

  .list_introduce {
    width: 100%;
    height: 200px;
    //background-color: green;
  }

  .list_table {
    width: 100%;
    height: calc(100% - 80px - 200px);
    //background-color: yellow;
  }
}
</style>
