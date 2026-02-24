require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch((err) => console.log(err));

/* =============================
   USER SCHEMA
============================= */
const UserSchema = new mongoose.Schema(
  {
    userNumber: String,
    name: String,
    email: String,
    phone: String,
    date: String, // ✅ REPLACED loginCode
    totalBill: {
      type: Number,
      default: 0,
    },
    role: String,
    status: String,
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

/* =============================
   LOGIN ROUTE
============================= */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "sanskargosai@gmail.com" && password === "Astha29") {
    return res.json({ token: "simple-token" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

/* =============================
   GET USERS
============================= */
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* =============================
   ADD USER (AUTO INCREMENT)
============================= */
app.post("/api/users", async (req, res) => {
  const lastUser = await User.findOne().sort({ _id: -1 });

  let nextNumber = "U10001";
  if (lastUser && lastUser.userNumber) {
    const num = parseInt(lastUser.userNumber.substring(1)) + 1;
    nextNumber = "U" + num;
  }

  const newUser = new User({
    userNumber: nextNumber,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    date: req.body.date,
    totalBill: req.body.totalBill,
    status: req.body.status || "Active",
  });

  await newUser.save();
  res.json(newUser);
});

/* =============================
   EDIT USER
============================= */

app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* =============================
   DELETE USER
============================= */
app.delete("/api/users/:id", async (req, res) => {
  const { password } = req.body;

  const ADMIN_PASSWORD = process.env.DELETE_PASSWORD;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User deleted successfully" });
});

/* =============================
   START SERVER
============================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
