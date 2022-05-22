import express from "express";
import cors from "cors";
import { dbConnector } from "./db.js";
import authRouter from "./controllers/auth.js";
import courseRouter from "./controllers/course.js";
import leavesRouter from "./controllers/leave.js";

import dotenv from "dotenv";

const app = express();
const dotCon = dotenv.config({ path: "configure.env" });
// some necessary stuff
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//connecting to db
dbConnector();

app.get("/", (req, res) => {
  res.send({ message: "App is active" });
});


// MAIN ROUTES APIs
app.use("/auth", authRouter);
app.use("/course", courseRouter);
app.use("/leaves", leavesRouter);

// App port
const PORT = process.env.PORT || 8000;
// const host = "192.168.120.64"

// activating server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
