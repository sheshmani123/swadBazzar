import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import CartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app configuration
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints 
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", CartRouter);
app.use("/api/order", orderRouter); // Corrected path

app.get("/", (req, res) => {
  res.send("app is working very fine ");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
