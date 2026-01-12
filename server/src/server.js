import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import chalk from "chalk";
import connectDb from "./Db/db.js";
import config from "./Config/env.config.js";

const PORT = config.PORT;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: ['https://unirooms-in.vercel.app', 'http://localhost:5173', 'https://unirooms.in'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

 let connectedUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    console.log(chalk.green(`User connected. Total users: ${connectedUsers}`));
    
     io.emit('userCount', connectedUsers);
    
    socket.on('disconnect', () => {
        connectedUsers--;
        console.log(chalk.yellow(`User disconnected. Total users: ${connectedUsers}`));
        io.emit('userCount', connectedUsers);
    });
});

connectDb().then(() => {
    httpServer.listen(PORT, () => {
        console.log(chalk.magenta(`Running on  http://localhost:${PORT}`));
        console.log(chalk.cyan('CORS Configuration:'));
        console.log(chalk.cyan('  - Production: https://unirooms-in.vercel.app'));
        console.log(chalk.cyan('  - Development: http://localhost:5173'));
        console.log(chalk.green('Socket.IO ready for real-time connections'));
    })
}).catch((err) => {
    console.log("ERROR")
})

