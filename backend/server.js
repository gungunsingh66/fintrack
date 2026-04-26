const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

// routes
app.use("/api/transactions", require("./routes/transactionRoutes"));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));