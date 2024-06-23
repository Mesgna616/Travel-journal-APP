import Entry from "../models/Entry.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Helper function for detailed error logging
const logError = (err, location) => {
    console.error(`Error in ${location}:`, err.message);
    if (err.stack) {
        console.error(err.stack);
    }
};

export const createEntry = async (req, res, next) => {
    try {
        console.log("createEntry: Received request body:", req.body);

        const newEntry = new Entry(req.body);
        const savedEntry = await newEntry.save();

        console.log("createEntry: Saved new entry:", savedEntry);

        const user = await User.findById(savedEntry.author);
        if (!user) {
            throw new Error("User not found");
        }

        user.entries.push(savedEntry._id);
        await user.save();

        console.log("createEntry: Updated user with new entry:", user);

        res.status(200).json(savedEntry);
    } catch (err) {
        logError(err, "createEntry");
        res.status(500).json({ error: err.message }); // Send detailed error message to client
        next(err); // Optionally pass error to Express error handler if needed
    }
};

export const updateEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid entry ID" });
        }

        console.log("updateEntry: Updating entry with ID:", id);

        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: "Entry not found" });
        }

        res.status(200).json(updatedEntry);
    } catch (err) {
        logError(err, "updateEntry");
        res.status(500).json({ error: err.message }); // Send detailed error message to client
        next(err); // Optionally pass error to Express error handler if needed
    }
};

export const deleteEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid entry ID" });
        }

        console.log("deleteEntry: Deleting entry with ID:", id);

        const deletedEntry = await Entry.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ error: "Entry not found" });
        }

        await User.findOneAndUpdate(
            { entries: id },
            { $pull: { entries: id } },
            { new: true }
        );

        res.status(200).json({ message: "The entry has been deleted" });
    } catch (err) {
        logError(err, "deleteEntry");
        res.status(500).json({ error: err.message }); // Send detailed error message to client
        next(err); // Optionally pass error to Express error handler if needed
    }
};

export const getEntries = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        console.log("getEntries: Fetching entries for user ID:", userId);

        const entries = await Entry.find({ author: userId });
        res.status(200).json(entries);
    } catch (err) {
        logError(err, "getEntries");
        res.status(500).json({ error: err.message }); // Send detailed error message to client
        next(err); // Optionally pass error to Express error handler if needed
    }
};

export const getEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid entry ID" });
        }

        console.log("getEntry: Fetching entry with ID:", id);

        const entry = await Entry.findById(id);
        if (!entry) {
            return res.status(404).json({ error: "Entry not found" });
        }

        res.status(200).json(entry);
    } catch (err) {
        logError(err, "getEntry");
        res.status(500).json({ error: err.message }); // Send detailed error message to client
        next(err); // Optionally pass error to Express error handler if needed
    }
};
