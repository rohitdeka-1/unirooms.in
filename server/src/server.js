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

// Track connected users and peak (high score)
let connectedUsers = 0;
let peakUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    
    // Update peak if current exceeds it
    if (connectedUsers > peakUsers) {
        peakUsers = connectedUsers;
    }
    
    // Emit both current and peak count
    io.emit('userStats', { current: connectedUsers, peak: peakUsers });
    
    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('userStats', { current: connectedUsers, peak: peakUsers });
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

