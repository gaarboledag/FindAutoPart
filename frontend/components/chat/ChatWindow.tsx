import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { api, chatsAPI, cotizacionesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image as ImageIcon, Send, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Message {
    id: string;
    content: string;
    imageUrl?: string;
    senderId: string; // User ID
    createdAt: string;
    isRead: boolean;
    sender: {
        id: string;
        email: string;
        role: string;
    };
}

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    cotizacionId: string;
    tiendaId?: string; // Required for Taller to chat with specific Tienda
    currentUserId: string;
    title?: string;
}

export function ChatWindow({ isOpen, onClose, cotizacionId, tiendaId, currentUserId, title = 'Chat' }: ChatWindowProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize Chat
    useEffect(() => {
        if (!isOpen) return;

        let newSocket: Socket | null = null;
        let active = true;

        const initChat = async () => {
            try {
                // Get or create chat
                const chat = await chatsAPI.init(cotizacionId, tiendaId);
                if (!active) return;
                setChatId(chat.id);

                // Load messages
                const initialMessages = await chatsAPI.getMessages(chat.id);
                if (!active) return;
                setMessages(initialMessages);

                // Connect Socket
                // Clean up URL to ensure we connect to root, not /api
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/?$/, '');

                newSocket = io(baseUrl, {
                    path: '/socket.io/',
                    withCredentials: true,
                    transports: ['websocket', 'polling']
                });

                newSocket.on('connect', () => {
                    console.log('Connected to chat server');
                    newSocket.emit('joinChat', chat.id);
                });

                newSocket.on('newMessage', (message: Message) => {
                    setMessages((prev) => {
                        // Prevent duplicates just in case
                        if (prev.some(m => m.id === message.id)) return prev;
                        return [...prev, message];
                    });

                    // Scroll to bottom
                    if (scrollRef.current) {
                        setTimeout(() => {
                            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                        }, 100);
                    }
                });

                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err);
                });

                if (active) setSocket(newSocket);

            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        };

        initChat();

        return () => {
            active = false;
            // Disconnect immediately on cleanup
            if (newSocket) {
                console.log('Disconnecting chat socket');
                newSocket.disconnect();
            }
        };
    }, [isOpen, cotizacionId, tiendaId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!newMessage.trim() && !isUploading) || !chatId) return;

        try {
            await chatsAPI.sendMessage(chatId, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !chatId) return;

        setIsUploading(true);
        try {
            // 1. Get upload URL
            const { uploadUrl, publicUrl, key } = await cotizacionesAPI.getUploadUrl(file.name, file.type);

            // 2. Upload to R2
            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            // 3. Send message with public URL
            await chatsAPI.sendMessage(chatId, '', publicUrl);

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`relative max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border-gray-200 border rounded-bl-none'
                                        }`}
                                >
                                    {!isMe && (
                                        <p className="text-[10px] font-bold opacity-70 mb-1 text-blue-600">
                                            {msg.sender.role === 'TIENDA' ? 'TIENDA' : 'TALLER'}
                                        </p>
                                    )}
                                    {msg.imageUrl && (
                                        <img
                                            src={msg.imageUrl}
                                            alt="Shared"
                                            className="max-w-full rounded mb-2 cursor-pointer hover:opacity-90"
                                            onClick={() => window.open(msg.imageUrl, '_blank')}
                                        />
                                    )}
                                    {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                                    <span className={`text-[10px] block mt-1 text-right ${isMe ? 'opacity-70 text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <ImageIcon className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1"
                        />
                        <Button type="submit" disabled={(!newMessage.trim() && !isUploading) || isUploading}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
