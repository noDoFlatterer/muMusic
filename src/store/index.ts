import {createStore} from "vuex";
import {Song} from "../interface";

const store = createStore({
        state() {
            return {
                // 储存播歌单列表
                songsList:[]
            }
        },
        getters: {
            /**
             * 获取歌单
             * @param state
             */
            getSongsList(state){
                return state.songsList
            }
        },
        mutations: {
            // 更新歌单
            updateSongs(state:any, songs: Array<Song>) {
                state.songsList.unshift(...songs)
            }

        },
        actions: {
            update_songs(context, songs: Array<Song>) {
                context.commit('updateSongs', songs)
                // 储存到本地
            }
        }

    }
)
export default store
