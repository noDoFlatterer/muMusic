<script setup lang="ts">
import {RecSongList} from "../../../interface";
import {toRefs} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
const props = defineProps<{
  Recommended_song_list: Array<RecSongList> | undefined
}>()
const {Recommended_song_list} = toRefs(props)
function goTo(item: RecSongList) {
  router.push({path: '/list',query:{id:item.id}})
}
</script>
<template>
  <div class="rec_box">
    <ul>
      <li v-for="(item,index) in Recommended_song_list" :key="index" @click="goTo(item)">
        <div class="rec_box_img">
          <img :src="item.picUrl" alt="">
          <div class="rec_box_img_mask">
            <el-icon :size="50" class="el_icon">
              <Headset/>
            </el-icon>
          </div>
        </div>
        <div class="rec_box_p">
          {{ item.name }}
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="less" scoped>
.rec_box {
  width: 100%;
  height: 100%;
  //background-color: red;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    li {
      width: 16%;
      //background-color: green;
      .rec_box_img {
        width: 100%;
        height: 70%;
        overflow: hidden;
        position: relative;
        z-index: 1;
        border-radius: 5px;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          //height: 100%;
          object-fit: fill;
          border-radius: 5px;
        }

        .rec_box_img_mask {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: none;
          text-align: center;
          line-height: 200px;

          .el_icon {
            color: red;
          }
        }
      }

      .rec_box_img:hover {
        img {
          width: 120%;
          //height: 120%;
          left: -10%;
          top: -10%;
          transition: all linear 0.5s;
        }

        .rec_box_img_mask {
          display: block;
          background: rgba(0, 0, 0, 0.5);
          transition: all linear 0.5s;
        }
      }

      .rec_box_p {
        width: 100%;
        height: 30%;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: none;
        //background-color: yellow;
      }
    }
  }
}
</style>
