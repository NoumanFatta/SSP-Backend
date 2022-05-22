import mongoose from "mongoose";
import dotenv from "dotenv";

// dot env parser
const dotCon = dotenv.config({ path: "configure.env" });

const { DB_USERNAME, DB_CLUSTER, DB_PASSWORD, DB_DATABASE } = process.env;

const dbUri = "'mongodb+srv://noumanfatta:bhoolgaya@cluster0.gqtlc.mongodb.net/sspDB?retryWrites=true&w=majority'"

export const dbConnector = () => {
  mongoose.connect(dbUri, () => {
    console.log("Data base conneced Successfully");
  });
};
