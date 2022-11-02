import axios from 'axios'
const request = axios.create({
    // baseURL:'xxx',
    timeout:1000
})
request.interceptors.request.use(
    // 这里暂时不做处理
    config =>{
        return config
    },
    error => {
        console.log(error)
        console.log("request请求失败")
        return Promise.reject(error)
    }
)
request.interceptors.response.use(
    response=>{
        const res = response.data
        // 这里先限制一个条件
        if(res.code == 200){
            console.log("请求成功")
            return res
        }else {
            return Promise.reject("请求失败")
        }
    },
    error=>{
        console.log(error)
        return Promise.reject(error)
    }
)
export default request
