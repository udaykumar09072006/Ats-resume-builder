import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Resume Builder API is running",
    status: "ok",
  });
});

app.use("/api/users", userRouter);
app.use("/api/ai", aiRouter);
app.use("/api/resumes", resumeRouter);

connectDb().catch((error) => {
  console.error("Database connection failed:", error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
