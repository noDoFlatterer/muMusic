<script setup lang="ts">
import {useStore} from "vuex";
import {nextTick, onMounted, onUnmounted, Ref, ref, toRaw} from "vue";
import {useRoute} from "vue-router";
import {Song} from "../../interface";
import pubsub from "pubsub-js";
import {getSongLyric} from "../../request/index"
import {handleLyric} from "../../utils";

const route = useRoute()
const store = useStore()
//获取正在播放的歌曲
let songList = store.getters.getSongsList
// 获取当前状态
let Index = Number(route.query.Index)
let play = Boolean(Number(route.query.play))
let song: Ref<Song | undefined> = ref<Song>()
song.value = songList[Index]
// 旋转变量
let rotate_flag = ref(false)
if (play) {
  rotate_flag.value = true
}
let r_pid: any
let d_pid: any
let audio_time: any
let progress_c:any
onMounted(() => {
  // 如果歌曲正在播放
  play_music()
  // 订阅事件，歌曲的播放与暂停-->
  r_pid = pubsub.subscribe('rotate_flag', (msgName, data: number) => {
    rotate_flag.value = Boolean(data)
  })
  // 切歌订阅事件
  d_pid = pubsub.subscribe("next_song", (msgName, data) => {
    song.value = songList[Number(data)]
    play_music()
  })
  //订阅事件，获取当前音频播放时间-->
  audio_time = pubsub.subscribe("audio_time", (msgName, data) => {
    // 更新歌词状态-->
    lyric_locate(data)
  })
  // 订阅事件
  progress_c = pubsub.subscribe('progress_change',()=>{
    progress_change()
  })
  // 歌词高度矫正值-->
  setTimeout(() => {
    scroll_updated.value = (lyric_index.value + 1) * 20.8
    lyric_return()
  }, 1000)
})
/**
 * 播放音乐的工作
 */
let rotate_timer = 0
let whirl = ref<HTMLElement>()
// 储存歌词数组
let lyricArr = ref([])
let re_lyric = ref(false)
// 歌词进行到第几句
let lyric_index = ref(0)
let move_flag = 0
let lyric = ref<HTMLElement>()
let scroll_updated = ref(0)

function play_music() {
  // 之前的准备工作
  // 清除定时器，重置角度，歌词校正高度-->
  clearInterval(rotate_timer)
  let angle = 0
  scroll_updated.value = 0
  lyric_return()
  console.log('播放歌曲',scroll_updated.value,lyric_index.value)
  rotate_timer = setInterval(() => {
    if (rotate_flag.value) {
      whirl.value && (whirl.value.style.transform = `rotate(${++angle}deg)`)
    }
  }, 20)
  // 加载歌词,歌词区域重新刷新
  if (song.value) {
    getSongLyric(song.value.id).then((res: any) => {
      lyricArr.value = handleLyric(res.lrc.lyric)
      re_lyric.value = true
      nextTick(() => {
        re_lyric.value = false
      })
    })
  }
}

/**
 * 歌词定位
 * @param data
 */
function lyric_locate(data: any) {
  // 设置歌词定时器,实现歌词移动，变色
  lyricArr.value.forEach((item, index) => {
    let audio_temp = data.toFixed(0)
    // 符合条件进行渲染-->
    if ((audio_temp >= item[0]) && (audio_temp < item[2])) {
      lyric_index.value = index
      // 校正歌词-->
      let temp1: HTMLElement | null = document.getElementById(`${item[0]}`)
      if (temp1) {
        temp1.style.color = 'red'
      }
      // 对上一个进行褪色-->
      if (index !== 0) {
        let temp2: HTMLElement | null = document.getElementById(`${lyricArr.value[index - 1][0]}`)
        if (temp2) {
          temp2.style.color = 'white'
        }
      }
      // 防止歌词滚动过快，对上上个进行褪色
      if (index > 1) {
        let temp3: HTMLElement | null = document.getElementById(`${lyricArr.value[index - 2][0]}`)
        if (temp3) {
          temp3.style.color = 'white'
        }
      }
      // 发生改变歌词移动-->
      if (move_flag !== item[0]) {
        lyric.value && (lyric.value.scrollTop += 20.8)
        scroll_updated.value += 20.8
        move_flag = item[0]
      }
    }
  })
}

/**
 * 歌词回正
 */
function lyric_return() {
  setTimeout(() => {
    lyric.value && (lyric.value.scrollTop = scroll_updated.value)
  }, 1000)
}

/**
 * 响应进度改变事件
 */
function progress_change() {
  setTimeout(()=>{
    scroll_updated.value = (lyric_index.value + 1) * 20.8
    // 确定歌词进度,触发歌词回正
    // console.log('index:'+lyric_index.value+",高度:"+scroll_updated.value)
    lyric.value && (lyric.value.scrollTop = scroll_updated.value)
  },1000)
  //  褪色处理
  lyricArr.value.forEach((item, index)=>{
    let temp1: HTMLElement | null = document.getElementById(`${item[0]}`)
    if (temp1) {
      temp1.style.color = 'white'
    }
  })
}

onUnmounted(() => {
  clearInterval(rotate_timer)
  pubsub.unsubscribe(r_pid)
  pubsub.unsubscribe(audio_time)
  pubsub.unsubscribe(d_pid)
})
</script>
<template>
  <div id="play_box">
    <img class="bg_img" :src="song.songImgSrc" alt="">
    <div class="whirl_box">
      <div ref="whirl" class="whirl">
        <img alt="" :src="song.songImgSrc">
      </div>
    </div>
    <div class="lyric" ref="lyric" :onmouseleave="lyric_return">
      <div style="width: 100%;height: 50%"></div>
      <p style="color: white" v-for="(item,index) in lyricArr" :key="index" :id="item[0]">
        {{ item[1] }}
      </p>
      <div style="width: 100%;height: 50%"></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
#play_box {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  //margin-top: 10px;
  overflow: hidden;

  .bg_img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //object-fit: cover;
    filter: blur(20px);
  }

  .whirl_box {
    top: 150px;
    left: 200px;
    width: 300px;
    height: 300px;
    border-radius: 150px;
    overflow: hidden;
    background-image: linear-gradient(to bottom right, #060606, #968e8e, #060606);
    position: absolute;

    .whirl {
      margin: 30px 30px;
      width: 240px;
      height: 240px;
      border-radius: 120px;
      overflow: hidden;

      img {
        width: 100%;
        object-fit: cover;
      }
    }
  }

  .lyric {
    position: absolute;
    top: 20px;
    right: 100px;
    width: 800px;
    height: 600px;
    background-color: rgba(0, 0, 0, 0.2);
    overflow-y: scroll;
    text-align: center;
    border-radius: 5px;
  }

  .lyric::-webkit-scrollbar {
    /*滚动条的宽度*/
    width: 3px;
  }

  .lyric::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #cacacb;
  }

  .lyric::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #f0f0f0;
  }

}
</style>
