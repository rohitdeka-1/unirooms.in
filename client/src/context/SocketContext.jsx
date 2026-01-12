import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });

        newSocket.on('userCount', (count) => {
            setOnlineUsers(count);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const value = {
        socket,
        onlineUsers
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
