const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const { userRouter } = require("./routes/user");
const { ticketRouter } = require("./routes/ticket");
const { commentRouter } = require("./routes/comment");
const { categoryRouter } = require("./routes/category");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/comment", commentRouter);
app.use("/category", categoryRouter);

async function main() {
    await mongoose.connect(process.env.DB);
    app.listen(process.env.PORT, () => {
        console.log("Server is runnning on port " + process.env.PORT);
    });
}

main();