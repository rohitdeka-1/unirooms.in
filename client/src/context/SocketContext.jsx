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
        // Determine socket URL based on environment
        let socketUrl;
        if (import.meta.env.VITE_API_URL) {
            // If env var is set, use it
            socketUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
        } else if (window.location.hostname === 'localhost') {
            // Local development
            socketUrl = 'http://localhost:5000';
        } else {
            // Production fallback - use your Heroku URL
            socketUrl = 'https://unirooms-01cba0aba98a.herokuapp.com';
        }
        
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
