import express from "express";
import authRoutes from "./Routes/auth";
import adminRoutes from "./Routes/admin";
import userRoutes from "./Routes/user";
import productRoutes from "./Routes/products";
import cartRoutes from "./Routes/cart";
import orderRoutes from "./Routes/order";
import { errorHandler } from "./Utils/errorHandler";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Config/swagger";
import logger from "morgan";
const PORT = 3001;
const app = express();

app.use(
  cors({
    origin: "*", // for dev only
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(logger("dev"));

app.use("/api/auth", authRoutes); //Done
app.use("/api/admin", adminRoutes); //Done
app.use("/api/user", userRoutes); //Done
app.use("/api/products", productRoutes); //Done
app.use("/api/cart", cartRoutes); //Done
app.use("/api/order", orderRoutes); //Done

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});
