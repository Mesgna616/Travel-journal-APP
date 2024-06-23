// controllers/entry.js

import Entry from "../models/Entry.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createEntry = async (req, res, next) => {
  try {
    const newEntry = new Entry(req.body);
    const savedEntry = await newEntry.save();

    const user = await User.findById(savedEntry.author);
    if (!user) {
      throw new Error("User not found");
    }

    user.entries.push(savedEntry._id);
    await user.save();

    res.status(200).json(savedEntry);
  } catch (err) {
    next(err); // Pass error to Express error handler
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

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
    next(err); // Pass error to Express error handler
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

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
    next(err); // Pass error to Express error handler
  }
};

export const getEntries = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const entries = await Entry.find({ author: userId });
    res.status(200).json(entries);
  } catch (err) {
    next(err); // Pass error to Express error handler
  }
};

export const getEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }

    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.status(200).json(entry);
  } catch (err) {
    next(err); // Pass error to Express error handler
  }
};
