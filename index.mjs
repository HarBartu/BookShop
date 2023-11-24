import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { deserializeUser } from "./routes/middleware/deserializeUser.mjs";
import sessionRoutes from "./routes/auth.mjs"
import userRoutes from "./routes/api.mjs"

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/api/", userRoutes);
app.use("/api/session", sessionRoutes);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
