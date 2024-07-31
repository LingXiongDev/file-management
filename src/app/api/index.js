import axios from "axios";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
    return Promise.reject(response.data);
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default {
  async get(url, params) {
    return instance.get(url, { params: params });
  },
  async post(url, body, params) {
    return instance.post(url, body, { params: params });
  },
  async patch(url, body, params) {
    return instance.patch(url, body, { params: params });
  },
  async put(url, body, params) {
    return instance.put(url, body, { params: params });
  },
  async delete(url, params, ...rest) {
    return instance.delete(url, { params: params, ...rest });
  },
};
