import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
// 引入ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router).use(store).use(ElementPlus).mount('#app')
