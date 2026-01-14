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
        // Get base URL correctly - production Heroku URL or localhost
        let socketUrl;
        if (import.meta.env.VITE_API_URL) {
            // Extract base URL from API URL (remove /api/v1)
            socketUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
        } else {
            socketUrl = 'http://localhost:5000';
        }
        
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            withCredentials: true
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to socket server:', socketUrl);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected after', attemptNumber, 'attempts');
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
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
