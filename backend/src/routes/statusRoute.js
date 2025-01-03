import express from "express";
import { getStats } from "../controller/statusController.js"; // Adjust the path as needed

const router = express.Router();

// Route for fetching statistics
router.get("/stats", getStats);

export default router;
