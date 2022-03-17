import axios from "axios";
import join from "url-join";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config) => {
  const token = "Bearer " + localStorage.getItem("ACTO");
  config.headers.Authorization = token;

  if (!isAbsoluteURLRegex.test(config.url)) {
    config.url = join("https://api-grandlogistics.herokuapp.com", config.url);
  }

  return config;
});

export const HttpClient = axios;
