/**
 * 轮播图接口
 */
export interface Banners {
    pic: string
}

/**
 * 首页歌单接口
 */
export interface RecSongList {
    id: number,
    picUrl: string,
    name: string
}

/**
 * 歌单详情
 */
export interface SongListDescript {
    tags: Array<string>,
    description: string,
    name: string,
    coverImgUrl: string,
    creator: {
        avatarUrl: string
    }
}

export interface SongList {

}

/**
 * 歌曲接口
 */
export interface Song {
    id: number,
    songName:string,
    songAuthor:string,
    songImgSrc:string,
    songSrc:string,
    dt:string
}
