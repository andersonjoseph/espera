import axios from 'axios';

export class ApiClient {
  constructor(token) {
    ApiClient.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    ApiClient.instance.interceptors.request.use(async (config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    });
  }
}
