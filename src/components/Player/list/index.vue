<script setup lang="ts">
import {Song} from "../../../interface";

const props = defineProps<{
  songsData:Array<Song>
}>()
let {songsData} = props
</script>
<template>
  <el-table :data="songsData" height="600" style="width: 100%;">
    <el-table-column prop="songName" label="歌名" width="150"/>
    <el-table-column prop="songAuthor" label="歌手" width="150"/>
    <el-table-column prop="dt" label="时长"/>
  </el-table>
</template>
<style lang="less" scoped>

</style>
