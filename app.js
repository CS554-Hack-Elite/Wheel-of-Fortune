import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import { VerifyToken } from "./middlewares/auth.js";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DATABASE);

app.use(VerifyToken);

app.use(express.json());

configRoutes(app);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("We've now got a server! ");
  console.log("Your routes will be running on http://localhost:4000");
});
