import express from "express";
import authRoutes from "./Routes/auth";
import adminRoutes from "./Routes/admin";
import userRoutes from "./Routes/user";
import productRoutes from "./Routes/products";
import cartRoutes from "./Routes/cart";
import orderRoutes from "./Routes/order";
import { errorHandler } from "./Utils/errorHandler";
import logger from "morgan";
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(logger("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
