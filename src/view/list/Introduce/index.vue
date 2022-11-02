<script setup lang="ts">
import {SongListDescript} from "../../../interface";
import {computed} from 'vue'
const props = defineProps<{
  song_d:SongListDescript|undefined
}>()
let songDescription = computed(()=>{
  return props.song_d
})
let a_img = computed(()=>{
  return props.song_d?.creator?.avatarUrl
})
function addAll(){
  console.log('添加全部歌曲')
}
</script>
<template>
  <div class="introduce">
    <div class="introduce_img">
      <img style="width: 100%" :src="songDescription.coverImgUrl" alt="">
    </div>
    <div class="introduce_p">
      <div class="introduce_p_1">
        {{songDescription.name}}
      </div>
      <div class="introduce_p_2">
        <img :src="a_img" alt="">
        <div>云音乐私人雷达官方账号</div>
      </div>
      <div class="introduce_p_3">
        <span @click="addAll">播放全部 | +</span>
      </div>
      <div class="introduce_p_tags">
        标签：
        <span v-for="(item,index) in song_d.tags" :key="index">{{item}}</span>
      </div>
      <div class="introduce_p_description">
        {{"介绍: "+song_d.description}}
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.introduce {
  width: 100%;
  height: 100%;

  .introduce_img {
    float: left;
    width: 200px;
    height: 100%;
    //background-color: #42b983;
    border-radius: 20px;
    overflow: hidden;
  }

  .introduce_p {
    float: left;
    margin-left: 10px;
    height: 100%;

    .introduce_p_1 {
      height: 24px;
      line-height: 24px;
      font-size: 20px;
      font-weight: normal;
    }

    .introduce_p_2 {
      margin-top: 3px;
      height: 20px;
      font-size: 12px;
      color: #0c73c2;
      font-family: Arial, Helvetica, sans-serif;

      img {
        float: left;
        height: 20px;
        width: 20px;
        border-radius: 10px;
      }

      div {
        margin-left: 5px;
        float: left;
        line-height: 20px;
      }
    }

    .introduce_p_3 {
      margin-top: 5px;

      span {
        padding: 0 10px 3px 5px;
        color: white;
        background-color: green;
        border-radius: 10px;
      }
    }

    .introduce_p_tags {
      margin-top: 8px;

      span {
        padding: 0 5px;
        //background-color: green;
        //border-radius: 10px;
        color:#79bbff;
      }
    }
    .introduce_p_description{
      margin-top: 8px;
      width: 600px;
      height: 106px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      //background-color: green;
    }
  }
}
</style>
