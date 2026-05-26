const express = require("express");

const mongoose = require(
  "mongoose"
);

const cors = require("cors");

require("dotenv").config();

const routes = require(
  "./routes/ticketRoutes"
);

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", routes);

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log(
      "MongoDB Connected"
    );

    app.listen(
      process.env.PORT,
      () => {
        console.log(
          `Server Running ${process.env.PORT}`
        );
      }
    );
  })
  .catch((err) =>
    console.log(err)
  );