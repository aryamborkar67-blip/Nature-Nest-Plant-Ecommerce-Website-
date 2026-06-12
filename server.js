import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize App
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

const User = mongoose.model("User", userSchema);

// Handle Form Submission
app.post("/register", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newUser = new User({ name, email, phone });
        await newUser.save();
        res.status(201).json({ message: "✅ User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));