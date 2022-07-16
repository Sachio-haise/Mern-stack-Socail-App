const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://mern-social-app-2022.herokuapp.com",
      changeOrigin: true,
    })
  );
};
