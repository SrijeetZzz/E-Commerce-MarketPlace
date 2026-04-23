import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 🔥 SET TOKEN
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// 🔥 SUBSCRIBERS (queue requests during refresh)
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 🔥 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 🔥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 🚫 skip auth routes
    if (
      original.url.includes("/auth/login") ||
      original.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        setAccessToken(newToken);
        onRefreshed(newToken);

        isRefreshing = false;

        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch (err) {
        isRefreshing = false;
        setAccessToken(null);

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;