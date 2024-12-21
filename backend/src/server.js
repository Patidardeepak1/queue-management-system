import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/index.js"; // Import the connection file
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import bookingRoute from "./routes/bookingRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import { scheduleSlotManagement } from "./utils/scheduler.js";
dotenv.config();
connectDB(); // Connect to the database

// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the scheduler
scheduleSlotManagement();

const app = express();

app.use(cors({ origin: "https://queue-management-system-jade.vercel.app" }));
app.use(express.json());

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

//Use the user routes
app.use("/api/users", userRoutes);

// Use the business routes
app.use("/api/businesses", businessRoutes);

//fecthing business for booking
app.use("/api/booking", bookingRoute);

app.get("/", (req, res) => {
  res.send("Queue Management API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
