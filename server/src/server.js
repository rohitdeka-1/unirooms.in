import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import chalk from "chalk";
import connectDb from "./Db/db.js";
import config from "./Config/env.config.js";

const PORT = config.PORT;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['https://unirooms-in.vercel.app', 'http://localhost:5173', 'https://unirooms.in'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

let connectedUsers = 0;
let peakUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    console.log('✅ User connected. Total:', connectedUsers);
    
    if (connectedUsers > peakUsers) {
        peakUsers = connectedUsers;
    }
    
    io.emit('userStats', { current: connectedUsers, peak: peakUsers });
    
    socket.on('disconnect', () => {
        connectedUsers--;
        console.log('❌ User disconnected. Total:', connectedUsers);
        io.emit('userStats', { current: connectedUsers, peak: peakUsers });
    });
});

connectDb().then(() => {
    httpServer.listen(PORT, () => {
        console.log(chalk.magenta(`Running on  http://localhost:${PORT}`));
        console.log(chalk.cyan('CORS Configuration:'));
        console.log(chalk.cyan('  - Production: https://unirooms-in.vercel.app'));
        console.log(chalk.cyan('  - Development: http://localhost:5173'));
        console.log(chalk.green('✅ Socket.IO initialized and ready'));
    })
}).catch((err) => {
    console.log("ERROR")
})

