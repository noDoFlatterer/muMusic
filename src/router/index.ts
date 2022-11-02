import {createRouter, createWebHistory, Router, RouteRecordRaw} from "vue-router";
import home from './home'

let routes: Array<RouteRecordRaw> = [
    ...home
]
let router: Router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
