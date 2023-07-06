import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import userRouter from "./routes/user.js";
config();

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
