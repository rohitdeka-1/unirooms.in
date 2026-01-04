import app from "./app.js";
import chalk from "chalk";
import connectDb from "./Db/db.js";
import config from "./Config/env.config.js";

const PORT = config.PORT;


connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(chalk.magenta(`Running on  http://localhost:${PORT}`));
        console.log(chalk.cyan('CORS Configuration:'));
        console.log(chalk.cyan('  - Production: https://unirooms-in.vercel.app'));
        console.log(chalk.cyan('  - Development: http://localhost:5173'));
    })
}).catch((err) => {
    console.log("ERROR")
})

