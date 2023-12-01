import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { deserializeUser } from "./routes/middleware/deserializeUser.mjs";
import sessionRoutes from "./routes/auth.mjs";
import userRoutes from "./routes/api.mjs";
import Sequelize from "sequelize";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use("/api/", userRoutes);
app.use("/api/session", sessionRoutes);

const port = process.env.port || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
