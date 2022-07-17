import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";
import jwt from "jsonwebtoken";
import { seedAdmin } from "./seeder/adminSeeder.js";
import bodyParser from "body-parser";
const app = express();

//middleWare

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

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
