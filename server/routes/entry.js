// routes/entry.js

import express from "express";
import {
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry,
  getEntry,
} from "../controllers/entry.js";

const router = express.Router();

// Define routes for CRUD operations
router.post("/", createEntry);           // Create new entry
router.put("/:id", updateEntry);         // Update existing entry
router.delete("/:id", deleteEntry);      // Delete entry
router.get("/author/:userId", getEntries); // Get entries by author ID
router.get("/:id", getEntry);            // Get entry by ID

export default router;
