import request from './request'
/**
 * 获取轮播图数据
 */
export const getSwiper = ()=>request({
    url: '/api/homepage/block/page',
    method: 'get'
})
/**
 * 获取歌单数据
 * @returns {*}
 */
export const getSongList = () => request({url: '/api/personalized?limit=6', method: 'get'})
/**
 * 获取歌单详细数据
 * @param id
 * @returns {*}
 */
export const getSongListDetail = (id:number) => request({url:'/api/playlist/detail?id='+id,method:'get'})
/**
 * 获取歌曲歌词
 * @param id
 * @returns {*}
 */
export const getSongLyric = (id:number) => request({url:'/api/lyric?id='+id,method:'get'})
