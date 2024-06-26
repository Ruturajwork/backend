import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json()); // body parsing

const corsOptions = {
  origin: 'https://rshopstore.vercel.app',
  credentials: true // if you're using cookies or sessions
};

app.use(cors(corsOptions));

app.options('/test-cors', cors(corsOptions), (req, res) => {
  res.status(200).send('CORS enabled');
});

app.get('/test-cors', cors(corsOptions), (req, res) => {
  res.status(200).send('CORS enabled');
});

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

// Paypal client ID Route
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Create a static folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


  app.get("/", (req, res) => {
    res.send("API is running");
  });


// Error middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
