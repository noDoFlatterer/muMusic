/**
 * 获取浏览器宽度
 */
import {Song} from "../interface";

export function getWidth():number{
    // 滚动条宽度
    let temp = window.innerWidth - document.body.clientWidth
    // 屏幕去除滚动条的宽度
    return Math.floor(window.screen.width - temp)
}

/**
 * 获取浏览器高度
 */
export function getHeight():number{
    return  Math.floor(window.innerHeight)
}
/**
 * 修改时间格式
 * @param dt   4.5
 * @returns {string} 04:30
 */
export const fixSongLong = (dt:number):string => {
    dt = Number((dt / 1000 / 60).toFixed(2))
    let temp:string = (dt * 60 % 60).toFixed(0)
    let arr = String(dt).split('.')
    arr[0] = arr[0].length > 1 ? arr[0] : "0" + arr[0]
    arr[1] = temp.length > 1 ? temp : "0" + temp
    return arr.join(':')
}
/**
 * 计算歌曲当前时间
 * @param time
 * @returns {string}
 */
export const computeSong_time = (time:number) => {
    time = Number(time.toFixed(0))
    let m = Math.floor(time / 60) + ""
    m = m.length > 1 ? m : "0" + m
    let s = Math.floor(time % 60) + ""
    s = s.length > 1 ? s : "0" + s
    return m + ":" + s
}
/**
 * 存值,并清空原来的旧值
 * @param {*} songList 歌单列表
 */
export const setSongsList = (songsList:Array<Song>) => {
    sessionStorage.removeItem('songsList')
    sessionStorage.setItem('songsList', JSON.stringify(songsList))
}
/**
 *
 * @returns *[]
 */
export const getSongsList = () => {
    if (sessionStorage.getItem('songsList')) {
        // return sessionStorage.getItem('songsList')
        return []
    } else {
        return []
    }
}
/**
 * 存歌单id
 */
// export const setSongListId = (id) => {
//     sessionStorage.setItem('songListId', JSON.stringify(id))
// }
/**
 * 取歌单id
 */
// export const getSongListId = () => {
//     return JSON.parse(sessionStorage.getItem('songListId'))
// }
/**
 * 歌词分割字符串,形成数组
 * @param {*} lyric
 * @returns [[开始时间,'歌词'，'结束时间']]
 */
export const handleLyric = function (lyric:string):any {
    if (lyric == '') return lyric
    let res:Array<any> = []
    let temp:Array<any> = []
    // 分割字符串
    lyric.split(/\[|\]|\n/).forEach(item => {
        if (item !== '')
            temp.push(item)
    });
    // 处理字符
    temp.forEach((item, index) => {
        if (item.indexOf('.') == -1) {
            if (index == temp.length - 1) {
                let pre = dealTime(temp[index - 1])
                res.push([pre, temp[index], 1000000])
            } else {
                let pre = dealTime(temp[index - 1])
                res.push([pre, temp[index], dealTime(temp[index + 1])])
            }
        }
    })

    function dealTime(time:any) {
        let temp_time = 0
        if(time===undefined)return 0
        time.split(/:|\./).forEach((item:any, index:number) => {
            if (index === 0) {
                temp_time += parseInt(item) * 60 * 1000
            } else if (index == 1) {
                temp_time += parseInt(item) * 1000
            } else {
                temp_time += parseInt(item)
            }
        })
        return temp_time
    }

    // console.log(res);
    return res
}
/**
 * 对字符串进行截取并拼接 ...
 * @param p  原字符串
 * @param num  保留数量
 * @param b    是否拼接 ...
 * @returns {*}  返回处理过的字符串
 */
// export const clip = function (p, num, b) {
//     if (p.length <= num) return p
//     p = p.slice(0, num)
//     return b ? p + "..." : p
// }
