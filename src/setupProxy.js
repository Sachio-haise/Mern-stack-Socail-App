const { createProxyMiddleware } = require("http-proxy-middleware");
import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://mern-social-app-2022.herokuapp.com/api",
      changeOrigin: true,
    })
  );
};
