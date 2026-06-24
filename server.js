const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB (your working SRV/non-SRV fix already done)
mongoose.connect("mongodb://maheswariudayakumar8_db_user:test1234@ac-pfjcpbj-shard-00-00.uhpsjgi.mongodb.net:27017,ac-pfjcpbj-shard-00-01.uhpsjgi.mongodb.net:27017,ac-pfjcpbj-shard-00-02.uhpsjgi.mongodb.net:27017/?ssl=true&replicaSet=atlas-3vosuz-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB error:", err));

// Model
const Student = require("./models/Student");

// CREATE
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.send(student);
  } catch (err) {
    res.send(err);
  }
});
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(updatedStudent);
  } catch (err) {
    res.send(err);
  }
});

// READ
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

// SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.send("Deleted successfully");
  } catch (err) {
    res.send(err);
  }
});