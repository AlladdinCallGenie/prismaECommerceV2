import express from "express";
import authRoutes from "./Routes/auth";
import adminRoutes from "./Routes/admin";
import logger from "morgan";
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(logger("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/user", userRoutes);

app.get("/", async (req, res) => {
  res.send("Hello, Prisma... ");
});

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
