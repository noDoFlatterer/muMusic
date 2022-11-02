import {RouteRecordRaw} from "vue-router";

let home:Array<RouteRecordRaw> = [
    {
        path:'/',
        redirect:'/home'
    },
    {
        path:'/home',
        component:()=>import('../view/home/index.vue')
    },
    {
        path:'/list',
        name:'List',
        component:()=>import('../view/list/index.vue')
    },
    {
        path:'/play',
        component:()=>import('../view/play/index.vue')
    }
]
export default home
