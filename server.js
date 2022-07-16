import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";
import jwt from "jsonwebtoken";
import { seedAdmin } from "./seeder/adminSeeder.js";
import { createProxyMiddleware } from "http-proxy-middleware";
const app = express();

//middleWare
app.use(cors());

app.use(
  createProxyMiddleware({
    target: "https://mern-social-app-frontend2022.herokuapp.com", //original url
    changeOrigin: true,
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
  })
);

//dbConnection
const dbUrl =
  "mongodb+srv://test:test@cluster0.i5wxb.mongodb.net/ReactNodeCRUD?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(dbUrl)
  .then((res) => {
    seedAdmin();

    app.listen(PORT, console.log(`YOU Are listening to port ${PORT}`));
  })
  .catch((err) => console.log(err));

//base routes
app.use(routes);
