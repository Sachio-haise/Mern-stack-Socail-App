const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/", {
      target: "https://mern-social-app-2022.herokuapp.com",
      // secure: false,
      changeOrigin: true,
    })
  );
};
