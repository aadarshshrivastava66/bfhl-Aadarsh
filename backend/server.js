const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const routes = require("./routes/ticketRoutes");

const app = express();

app.use(
  cors({
    origin: "https://bfhl-aadarsh.netlify.app",
  })
);

app.use(express.json());

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server Running on ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });