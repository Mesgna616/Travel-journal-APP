import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoute from "./routes/user.js";
import entryRoute from "./routes/entry.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5500;

// Function to connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongoDB.");
  } catch (error) {
    console.error("Error connecting to mongoDB:", error);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected!");
});

// Middleware configurations
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allows cookies to be sent with requests
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server and connect to the database
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  connect();
});
