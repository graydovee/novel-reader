import axios from 'axios'
import $qs from 'qs'

if (process.env.NODE_ENV === 'development') {
    // axios.defaults.baseURL = 'https://admin.ndovel.com';
    axios.defaults.baseURL = 'http://localhost:8090';
} else {
    axios.defaults.baseURL = 'https://admin.ndovel.com';
}
// 允许携带cookie
axios.defaults.withCredentials = false

axios.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error)
    }
)

export default {
    post(url, data={}) {
        return new Promise((resolve, reject) => {
            axios.post(url, $qs.stringify(data))
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
        })
    },
    get(url, params={}) {
        return new Promise((resolve, reject) => {
            axios.get(url,{
                params: params
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
        })
    },
    put(url, data={}) {
        return new Promise((resolve, reject) => {
            axios.put(url, $qs.stringify(data))
            .then(response => {
                resolve(response.data);
            },err => {
                reject(err)
            })
        })
    },
    delete(url, params={}) {
        return new Promise((resolve, reject) => {
            axios.delete(url,{
                params: params
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}
