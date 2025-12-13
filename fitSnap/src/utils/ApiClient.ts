import axios from "axios";

const ApiClient = axios.create({
    baseURL : "http://localhost:3000/api",
    headers : {
        "accept" : "application/json"
    }
})

ApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error));

export default ApiClient