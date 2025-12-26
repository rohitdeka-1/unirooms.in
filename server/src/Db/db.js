import mongoose from "mongoose";
import chalk from "chalk";
import config from "../Config/env.config.js";

const MONGO_URI = config.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(chalk.magenta("MongoDB Connected"));
    } catch (err) {
        console.log(chalk.red("Error connecting DB: ", err));
        throw err;
    }
}

export default connectDb;