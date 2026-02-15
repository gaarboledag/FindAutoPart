'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    unreadCounts: Record<string, number>; // chatId -> unreadCount
    totalUnread: number;
    markAsRead: (chatId: string) => void;
    joinChat: (chatId: string) => void;
    setActiveChatId: (chatId: string | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Simple "Pop" sound base64
const NOTIFICATION_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Placeholder, will replace with better one or just use a simple beep logic if needed

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const { user, isAuthenticated } = useAuthStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const activeChatIdRef = useRef<string | null>(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Tranquil notification sound
        audioRef.current.volume = 0.5;
    }, []);

    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }
    };

    // Initialize Socket
    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/?$/, '');
        const token = localStorage.getItem('access_token');

        const newSocket = io(baseUrl, {
            path: '/socket.io/',
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('Global socket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Global socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Global socket connection error:', err);
        });

        // Global message listener for notifications
        newSocket.on('newMessage', (message: any) => {
            if (message.senderId !== user.id) {
                // Check against ref
                if (message.chatId !== activeChatIdRef.current) {
                    playNotificationSound();
                    setUnreadCounts(prev => ({
                        ...prev,
                        [message.chatId]: (prev[message.chatId] || 0) + 1
                    }));
                    toast.info(`Nuevo mensaje de ${message.senderName || 'Usuario'}`, {
                        description: message.content,
                        action: {
                            label: 'Ver',
                            onClick: () => {
                                // Logic to navigate or open chat would go here
                                // For now just toast
                            }
                        }
                    });
                }
            }
        });

        // Real-time Business Events
        newSocket.on('newCotizacion', (data: any) => {
            // Only for Tiendas (already filtered by room but good to double check or just handle)
            if (user.role === 'TIENDA') {
                playNotificationSound();
                toast.success('Nueva Cotización Disponible', {
                    description: `${data.marca} ${data.modelo} - ${data.titulo}`,
                    duration: 5000,
                });
            }
        });

        newSocket.on('newOferta', (data: any) => {
            if (user.role === 'TALLER') {
                playNotificationSound();
                toast.success('Nueva Oferta Recibida', {
                    description: `Tienda ${data.tienda?.nombre} ha enviado una oferta para ${data.cotizacion?.titulo || 'tu cotización'}`,
                    duration: 5000,
                });
            }
        });

        newSocket.on('newPedido', (data: any) => {
            playNotificationSound();
            const isTienda = user.role === 'TIENDA';
            toast.success('Nuevo Pedido Recibido', {
                description: isTienda
                    ? `Tienes un nuevo pedido de Taller ${data.taller?.nombre}`
                    : `Tu pedido a ${data.tienda?.nombre} ha sido creado`, // Should not happen for Talle via socket usually as they create it, but good fallback
                duration: 5000,
            });
        });

        newSocket.on('pedidoUpdate', (data: any) => {
            playNotificationSound();
            toast.info(`Actualización de Pedido`, {
                description: `El estado del pedido #${data.id.slice(-4)} ha cambiado a ${data.status}`,
                duration: 5000,
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, user]);


    // Fetch initial unread counts
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchUnread = async () => {
            try {
                if (user.role === 'TIENDA') {
                    const response = await api.get('/cotizaciones/tienda/unread-count');
                    // This endpoint returns total count, not per chat map. 
                    // We might need to adjust this to track "global total" primarily if map is unavailable.
                    // But context exposes `unreadCounts` map. Let's just track a 'global' key for now if map is hard.
                    // Or keep it empty and rely on real-time increments? No, persistence is key.
                    // Let's rely on component fetching for detailed counts and just use this for total badge.
                    // setUnreadCounts({ 'global_tienda': response.data.count });
                }
            } catch (error) {
                console.error("Error fetching unread counts", error);
            }
        };

        fetchUnread();
        // Removed polling as real-time updates are now handled by socket for unread counts
        // const interval = setInterval(fetchUnread, 60000); // Poll every minute as backup sync
        // return () => clearInterval(interval);
    }, [isAuthenticated, user]);


    const markAsRead = React.useCallback((chatId: string) => {
        // Logic to clear unread for a chat
        setUnreadCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[chatId]; // Or set to 0 if we want to keep the key
            return newCounts;
        });
        // Optionally, emit to backend that chat is read
        if (socket && isConnected) {
            socket.emit('markChatAsRead', chatId);
        }
    }, [socket, isConnected]);

    const joinChat = React.useCallback((chatId: string) => {
        if (socket && isConnected) {
            socket.emit('joinChat', chatId);
        }
    }, [socket, isConnected]);

    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    const contextValue = React.useMemo(() => ({
        socket,
        isConnected,
        unreadCounts,
        totalUnread,
        markAsRead,
        joinChat,
        setActiveChatId
    }), [socket, isConnected, unreadCounts, totalUnread, markAsRead, joinChat]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
