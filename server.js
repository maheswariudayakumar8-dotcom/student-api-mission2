const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const Student = require("./models/Student");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// MongoDB Connection
mongoose.connect(
  "mongodb://maheswariudayakumar8_db_user:test1234@ac-pfjcpbj-shard-00-00.uhpsjgi.mongodb.net:27017,ac-pfjcpbj-shard-00-01.uhpsjgi.mongodb.net:27017,ac-pfjcpbj-shard-00-02.uhpsjgi.mongodb.net:27017/?ssl=true&replicaSet=atlas-3vosuz-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB error:", err));

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.send("User Registered Successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user._id },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// CREATE STUDENT
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET ALL STUDENTS
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (err) {
    res.status(500).send(err);
  }
});

// UPDATE STUDENT
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send(updatedStudent);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE STUDENT
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.send("Deleted successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/profile", auth, (req, res) => {
  res.send("Protected Profile Data");
});

// SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});