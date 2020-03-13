import axios from 'axios';
import qs from 'qs';

let baseURL = 'https://admin.ndovel.com/';

let service = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

// 是否允许携带cookie
service.defaults.withCredentials = false;

service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default {
  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      service.post(url, qs.stringify(data)).then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err);
        },
      );
    });
  },
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      service
        .get(url, {
          params: params,
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  put(url, data = {}) {
    return new Promise((resolve, reject) => {
      service.put(url, qs.stringify(data)).then(
        response => {
          resolve(response.data);
        },
        err => {
          reject(err);
        },
      );
    });
  },
  delete(url, params = {}) {
    return new Promise((resolve, reject) => {
      service
        .delete(url, {
          params: params,
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
};
