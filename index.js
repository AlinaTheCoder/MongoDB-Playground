import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT ?? 3000;
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from './routes/task.routes.js'
import logger from "./middlewares/logger_middleware.js";
connectDB();

// middleware to parse JSON bodies
app.use(express.json());
app.use(logger); // custom logger middleware

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
