<script setup lang="ts">
import {SongList, Song} from '../../../interface'
import {computed, onMounted, ref, Ref, toRaw} from "vue";
import {fixSongLong} from "../../../utils";
import {useStore} from "vuex";
import pubsub from 'pubsub-js'
const store = useStore();
const props = defineProps<{
  songList: Array<SongList | undefined>
}>()
let songList = computed(() => {
  if (songList) {
    toRaw(props.songList).filter((item: any) => {
      item.dt = fixSongLong(Number(item.dt))
    })
  }
  return props.songList
})
const add = (row: any,column:any) => {
  let t = toRaw(row)
  let temp: Song = {
    id: t.id,
    songName: t.al.name,
    songSrc: conSongSrc(Number(t.id)),
    dt: t.dt,
    songAuthor:t.ar[0].name,
    songImgSrc:t.al.picUrl
  }
  // 提交action到store
  store.dispatch('update_songs', [temp])
  // 发布事件
  pubsub.publish("addSong")
}
/**
 * 拼接歌曲播放地址
 * @param id
 * @returns {string}
 */
function conSongSrc(id: number) {
  return "https://music.163.com/song/media/outer/url?id=" + id;
}
// 渲染表格时的函数
function tableRowClassName({row,rowIndex}:any){
  row.index = rowIndex
}
</script>
<template>
  <el-table :row-class-name="tableRowClassName" :data="songList" height="320" style="width: 100%" @row-dblclick="add">
    <el-table-column type="index" label="" width="200"/>
    <el-table-column prop="name" label="歌曲" width="400"/>
    <el-table-column prop="ar[0].name" label="歌手" width="200"/>
    <el-table-column prop="al.name" label="专辑" width="300"/>
    <el-table-column prop="dt" label="时长"/>
  </el-table>
</template>
<style lang="less" scoped>

</style>
