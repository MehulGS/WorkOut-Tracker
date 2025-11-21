const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const Routes = require("./routes/index");


dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "*", // allow all origins explicitly
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("Gym Tracker API Running"));
app.use("/api", Routes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
