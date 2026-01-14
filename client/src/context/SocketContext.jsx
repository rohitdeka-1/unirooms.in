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
    const [peakUsers, setPeakUsers] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
        
        console.log('🔌 Attempting to connect to:', socketUrl);
        
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected to:', socketUrl);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });

        newSocket.on('userStats', ({ current, peak }) => {
            setOnlineUsers(current);
            setPeakUsers(peak);
        });

        // Backwards compatibility for old event
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
        onlineUsers,
        peakUsers
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
