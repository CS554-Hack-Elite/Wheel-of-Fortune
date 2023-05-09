import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import { VerifyToken } from "./middlewares/auth.js";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import fileUpload from "express-fileupload";
import fs from "fs";

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("client/src/images"));
app.use(fileUpload());
app.use(VerifyToken);

app.use(express.json());

configRoutes(app);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  if (!fs.existsSync("client/images/proof")) {
    fs.mkdir("client/images/proof", { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  if (!fs.existsSync("client/images/coupon_logo")) {
    fs.mkdir("client/images/coupon_logo", { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  if (!fs.existsSync("client/images/business_logo")) {
    fs.mkdir("client/images/business_logo", { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  console.log("We've now got a server! ");
  console.log("Your routes will be running on http://localhost:4000");
});
