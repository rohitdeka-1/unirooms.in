import app from "./app.js";
import chalk from "chalk";
import connectDb from "./Db/db.js";
import config from "./Config/env.config.js";

const PORT = config.PORT;


connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(chalk.magenta(`Running on  http://localhost:${PORT}`))
    })
}).catch((err) => {
    console.log("ERROR")
})

