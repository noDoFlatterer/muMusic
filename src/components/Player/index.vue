<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ReactiveEffect, ref, Ref, toRaw} from "vue";
import {Song} from "../../interface";
import {useStore} from "vuex";
import pubsub from 'pubsub-js'
import {computeSong_time} from "../../utils";
import {ElMessage} from "element-plus";
import PlayList from './list/index.vue';
import {useRouter} from "vue-router";

const router = useRouter()
const store = useStore()
// 正在播放的歌曲
let song = reactive({
  id: 0,
  songName: '暂无',
  songAuthor: '暂无',
  songImgSrc: "./wu.jpg",
  // 歌曲链接-->
  songSrc: "",
  dt: '00:00'
})
// 播放对的歌曲在歌单的位置
let Index: Ref<number> = ref(0)
// 播放列表
let songs: Ref<Array<Song>> = ref([])
// 获取store的歌曲列表
songs.value = store.getters.getSongsList
// 是否播放歌曲标识
let play: Ref<boolean> = ref(false)
//获取audio
let audio: Ref<HTMLAudioElement | undefined> = ref<HTMLAudioElement>()

/**
 * 控制播放与暂停
 */
function playOrPause() {
  // 播放转暂停
  if (play.value) {
    play.value = false
    audio.value?.pause()
    pubsub.publish('rotate_flag', 0)
  } else {
    // 暂停转播放
    if (songs.value.length) {
      play.value = true
      audio.value?.play()
      pubsub.publish('rotate_flag', 1)
    }
  }
}

let isDown = false;

/**
 * 歌曲播放进度条拖拽，点击功能
 */
function drag() {
  // 拖动元素
  let progress_in = document.getElementById('progress_in')
  let progress = document.getElementById('progress')
  let x = 0;
  let y = 0;
  let l = 0;
  let t = 0;
  if (progress_in && progress) {
    progress_in.onmousedown = function (e) {
      //获取x坐标和y坐标
      x = e.clientX;
      y = e.clientY;
      //获取左部和顶部的偏移量
      if (progress_in) {
        l = progress_in.offsetLeft;
        t = progress_in.offsetTop;
        //设置样式
        progress_in.style.cursor = 'move';
      }
      //开关打开
      isDown = true;
    }
    progress.onmouseleave = (e) => {
      if (isDown) {
        //在这里调整拖拽进度
        let temp: string | undefined = progress_in?.style.width
        if (temp && audio.value) {
          let a: number = Number(temp.slice(0, -2))
          let d = (a / 710 * (audio.value?.duration)).toFixed(0)
          audio.value.currentTime && (audio.value.currentTime = Number(d))
          // 发布歌曲进度改变事件
          send_progress_change()
        }
      }
      isDown = false
    }
    progress.onclick = (e) => {
      if (progress_in) {
        progress_in.style.width = e.offsetX + 'px'
        isDown = true
        if (isDown) {
          //在这里调整拖拽进度
          let temp: string | undefined = progress_in?.style.width
          if (temp && audio.value) {
            let a: number = Number(temp.slice(0, -2))
            let d = (a / 710 * (audio.value?.duration)).toFixed(0)
            audio.value.currentTime && (audio.value.currentTime = Number(d))
            // 发布歌曲进度改变事件
            send_progress_change()
          }
        }
        isDown = false
      }
    }
  }
  document.onmousemove = (e) => {
    if (isDown && progress_in) {
      if (e.offsetX >= 710) {
        progress_in.style.width = '710px'
      } else {
        progress_in.style.width = e.offsetX + 'px'
      }
    } else {
      return;
    }
  }
  document.onmouseup = function () {
    //开关关闭
    isDown = false;
    if (progress_in) {
      progress_in.style.cursor = 'default';
    }
  }

}

// 播放歌曲进度条定时器
let timer_progress: Ref<number> = ref(0)
// 正在播放正在进行的时间
let song_now_time: Ref<string> = ref<string>("00:00")
let progress_in = ref<HTMLElement>()

/**
 *播放音乐
 */
function play_music(song_temp: Song) {
  if (audio.value) {
    audio.value.pause()
    song.songImgSrc = song_temp.songImgSrc
    song.songSrc = song_temp.songSrc
    song.dt = song_temp.dt
    song.songName = song_temp.songName
    song.songAuthor = song_temp.songAuthor
    song.id = song_temp.id
    audio.value.load()
    audio.value.play()
    play.value = true
  }
  //歌曲进度条-->
  timer_progress.value = setInterval(() => {
    // 进度条长度-->
    // 歌曲当前播放时长-->
    if (audio.value && progress_in.value) {
      song_now_time.value = computeSong_time(audio.value.currentTime)
      if (!isDown) {
        progress_in.value.style.width = ((audio.value.currentTime / audio.value.duration) * 710).toFixed(0) + 'px'
      }
    }
  }, 1000)
}

let dingyue1: any
onMounted(() => {
  // 进度条拖拽功能
  drag()
  // 订阅事件,添加歌曲并播放歌曲
  dingyue1 = pubsub.subscribe("addSong", (msgName) => {
    //播放歌曲
    play_music(songs.value[Index.value])
  })
  // 监听歌曲播放完毕,自动播放下一首
  audio.value?.addEventListener('ended', () => {
    next_song(1)
    pubsub.publish('next_song', Index.value)
    // pubsub.publish('bug_1')
  })

})

/**
 * 切歌
 */
function next_song(t: number) {
  if (t > 0) {
    //下一首
    if (model_flag.value) {
      if (++Index.value >= songs.value.length - 1) {
        Index.value = 0
      }
    }
    play_music(songs.value[Index.value])
    pubsub.publish('next_song', Index.value)
  } else {
    if (model_flag) {
      if (--Index.value < 0) {
        Index.value = songs.value.length - 1
      }
    }
    play_music(songs.value[Index.value])
    pubsub.publish('next_song', Index.value)
  }
}

/**
 * 控制音量
 */
let volume_in: Ref<HTMLElement | undefined> = ref<HTMLElement>()
let volume_out: Ref<HTMLElement | undefined> = ref<HTMLElement>()
// 是否有音量标识
let ban_vo_flag: Ref<boolean> = ref<boolean>(true)

function control_volume(e: any) {
  if (volume_in.value && volume_out.value) {
    volume_in.value && (volume_in.value.style.width = e.offsetX + 'px')
    audio.value && (audio.value.volume = e.offsetX / 70)
    ban_vo_flag.value = true
  }
}


/**
 * 音量禁止
 */
function ban_volume() {
  // 有转无
  if (ban_vo_flag.value) {
    audio.value && (audio.value.volume = 0)
    volume_in.value && (volume_in.value.style.width = "0px")
    ban_vo_flag.value = false
  } else {
    ban_vo_flag.value = true
    volume_in.value && (volume_in.value.style.width = "35px")
    audio.value && (audio.value.volume = 0.5)
  }
}

/**
 * 歌曲播放模式的转换
 */
let model_flag = ref<boolean>(true)

function model_change() {
  if (model_flag.value) {
    //顺序转单曲
    model_flag.value = false
    ElMessage({
      message: '已为你切换单曲播放模式',
      type: 'success',
    })
  } else {
    // 单曲转顺序
    model_flag.value = true
    ElMessage({
      message: '已为你切换顺序播放模式',
      type: 'success',
    })
  }
}

/**
 * 歌曲播放列表的展示
 */
let play_list_flag = ref<boolean>(false)

function show_list() {
  if (play_list_flag.value) {
    play_list_flag.value = false
    ElMessage({
      message: '已为你关闭播放列表',
      type: 'success',
    })
  } else {
    // 展示歌单
    ElMessage({
      message: '已为你打开播放列表',
      type: 'success',
    })
    play_list_flag.value = true

  }
}

/**
 * 跳转到
 */
function goTo() {
  if (songs.value.length) {
    let status_song: any = song
    status_song.Index = Index.value
    status_song.play = play.value
    // 发布事件，发送实时音频播放信息-->
    send_audio_time()
    router.push({
      path: '/play',
      query: {
        Index: Index.value,
        play: Number(play.value)
      }
    })
  }
}


/**
 * 发布事件封装函数，发布当前播放进度
 */
let send_audio_timer = ref(0)

function send_audio_time() {
  // 清除定时器-->
  clearInterval(send_audio_timer.value)
  // 重新发布功能-->
  send_audio_timer.value = setInterval(() => {
    if (audio.value) {
      pubsub.publish("audio_time", Number(audio.value.currentTime.toFixed(3)) * 1000)
    }
  }, 500)
}

/**
 * 歌曲进度触发事件
 */
function send_progress_change(){
  pubsub.publish('progress_change')
}
onUnmounted(() => {
  pubsub.unsubscribe(dingyue1)
  clearInterval(timer_progress.value)
})
</script>
<template>
  <div class="player">
    <audio ref="audio">
      <source :src="song.songSrc"
              type="audio/mpeg">
    </audio>
    <div class="player_img" @click="goTo">
      <img :src="song.songImgSrc" alt=""/>
    </div>
    <div class="player_describe">
      <p>{{ song.songAuthor.length > 10 ? song.songAuthor.slice(0, 10) : song.songAuthor }}</p>
      <p>{{ song.songName.length > 5 ? song.songName.slice(0, 5) : song.songName }}</p>
    </div>
    <!--    歌曲控制-->
    <div class="player_controls">
      <!--      上一首-->
      <div class="control" @click="next_song(-1)">
        <el-icon>
          <ArrowLeft/>
        </el-icon>
      </div>
      <!--      暂停与播放-->
      <div class="control" @click="playOrPause">
        <el-icon v-if="play">
          <VideoPause/>
        </el-icon>
        <el-icon v-else>
          <VideoPlay/>
        </el-icon>
      </div>
      <!--      下一首-->
      <div class="control" @click="next_song(1)">
        <el-icon>
          <ArrowRight/>
        </el-icon>
      </div>

    </div>
    <!--      播放进度条-->
    <div class="progress_box">
      <div class="progress_left progress_time">
        {{ song_now_time }}
      </div>
      <div class="progress" id="progress">
        <div class="progress_in" id="progress_in" ref="progress_in"></div>
      </div>
      <div class="progress_right progress_time">
        {{ song.dt }}
      </div>
    </div>
    <!--    音量-->
    <div class="volume_box">
      <div class="volume_icon" @click="ban_volume">
        <el-icon size="30px" v-if="ban_vo_flag">
          <BellFilled/>
        </el-icon>
        <el-icon v-else size="30px">
          <MuteNotification/>
        </el-icon>
      </div>
      <div class="volume_out" @click="control_volume" ref="volume_out">
        <div class="volume_in" ref="volume_in"></div>
      </div>
    </div>
    <!--    模式-->
    <div class="model">
      <div class="model_icon" @click="model_change">
        <el-icon size="30px" v-if="model_flag">
          <Refresh/>
        </el-icon>
        <el-icon size="30px" v-else>
          <Warning/>
        </el-icon>
      </div>
    </div>
    <!--    播放列表-->
    <div class="play_list">
      <div class="list_icon" @click="show_list">
        <el-icon size="30px" v-if="play_list_flag">
          <List/>
        </el-icon>
        <el-icon size="30px" v-else>
          <Tickets/>
        </el-icon>
      </div>
      <div class="show_play_list" v-if="play_list_flag">
        <PlayList :songsData="songs"></PlayList>
      </div>
    </div>
  </div>

</template>
<style lang="less" scoped>
.player {
  width: 100%;
  height: 100%;
  background-color: #f6f6f8;

  .player_img {
    float: left;
    margin-left: 20px;
    height: 100%;
    width: 70px;
    //background-color: red;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      padding: 5px;
      //background-color: yellow;
      box-sizing: border-box;
    }
  }

  .player_describe {
    float: left;
    height: 100%;
    width: 150px;
    //background-color: green;
    padding: 10px;
    box-sizing: border-box;

    p {
      font-size: 14px;
    }
  }

  .player_controls {
    float: left;
    margin-left: 20px;
    width: 150px;
    height: 100%;
    overflow: hidden;
    //background-color: red;
    .control {
      box-sizing: border-box;
      display: inline-block;
      width: 50px;
      height: 60px;
      padding: 10px 10px;
      cursor: pointer;

      i {
        text-align: center;
        line-height: 40px;
        font-size: 40px;
      }
    }
  }

  .progress_box {
    float: left;
    width: 800px;
    height: 100%;
    //background-color: red;
    .progress_time {
      width: 40px;
      height: 100%;
      float: left;
      line-height: 60px;

    }

    .progress {
      float: left;
      width: calc(100% - 90px);
      margin-top: 20px;
      margin-left: 5px;
      height: 20px;
      background-color: #cbcbcb;
      border-radius: 10px;

      .progress_in {
        width: 100px;
        height: 100%;
        border-radius: 10px;
        background-color: red;
      }
    }
  }

  .volume_box {
    float: left;
    width: 100px;
    height: 100%;
    //background-color: red;
    .volume_icon {
      float: left;
      width: 30px;
      height: 30px;
      margin-top: 15px;
      //line-height: 60px;
    }

    .volume_out {
      float: left;
      width: 70px;
      height: 10px;
      background-color: green;
      margin-top: 25px;

      .volume_in {
        width: 35px;
        height: 100%;
        background-color: red;
      }
    }
  }

  .model {
    float: left;
    margin-left: 30px;
    width: 60px;
    height: 100%;
    //background-color: red;
    .model_icon {
      width: 30px;
      height: 30px;
      margin: 15px;
    }
  }

  .play_list {
    position: relative;
    float: right;
    width: 60px;
    height: 100%;
    //background-color: red;
    .list_icon {
      width: 30px;
      height: 30px;
      margin: 15px;
    }

    .show_play_list {
      position: absolute;
      width: 460px;
      height: 600px;
      background-color: red;
      z-index: 100;
      top: -600px;
      left: -400px;
      overflow: hidden;
      background-color: #f6f6f8;
    }
  }
}
</style>
