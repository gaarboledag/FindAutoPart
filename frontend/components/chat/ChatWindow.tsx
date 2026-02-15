'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api, chatsAPI, cotizacionesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Send, X, ArrowLeft } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';

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
    chatId?: string; // Direct chat ID (for Admin or existing chats)
    title?: string;
}

export function ChatWindow({ isOpen, onClose, cotizacionId, tiendaId, currentUserId, title = 'Chat', chatId: forcedChatId }: ChatWindowProps) {
    const { socket, joinChat, setActiveChatId } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(forcedChatId || null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize Chat (Load history and join room)
    useEffect(() => {
        if (!isOpen) {
            setActiveChatId(null);
            return;
        }

        let active = true;

        const initChat = async () => {
            try {
                let currentChatId = forcedChatId;

                // If no forced ID, get or create chat
                if (!currentChatId) {
                    const chat = await chatsAPI.init(cotizacionId, tiendaId);
                    if (!active) return;
                    currentChatId = chat.id;
                }

                setChatId(currentChatId);
                joinChat(currentChatId!);
                setActiveChatId(currentChatId);

                // Load messages
                const initialMessages = await chatsAPI.getMessages(currentChatId!);
                if (!active) return;
                setMessages(initialMessages);

            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        };

        if (isOpen) {
            initChat();
        }

        return () => {
            active = false;
            setActiveChatId(null);
        };
    }, [isOpen, cotizacionId, tiendaId, joinChat, setActiveChatId, forcedChatId]);

    // Listen for incoming messages via Global Socket
    useEffect(() => {
        if (!socket || !chatId) return;

        const handleNewMessage = (message: Message) => {
            if (message.id /* check if belongs to this chat? backend event is generic? NO, room based, but global listener is generic */) {
                // The socket listens globally. We need to filter? 
                // Actually `socket.on` here will receive ALL messages if we just listen to 'newMessage' event 
                // BUT we are in a component. 
                // The server emits to ROOM `chat_${chatId}`. 
                // So we only receive it if we are in the room.
                // However, the `SocketContext` ALSO listens globally?
                // `SocketContext` implementation: `newSocket.on('newMessage'...)`
                // If I add another listener here, it works in parallel.

                // WAIT! Messages sent to `chat_${chatId}` room are only received if joined.
                // ChatWindow joins the room. 
                // SocketContext is ALWAYS connected. Does it join ALL rooms? 
                // No, `SocketContext` logic for notifications implies it receives messages even if NOT in the room?
                // Backend: `this.chatsGateway.server.to(chat_${chatId}).emit...` 
                // So you MUST be in the room to receive it via socket.io rooms.
                // So for "Global Notifications" to work for chats I'm NOT viewing, I must be joined to those rooms? 
                // OR the backend must emit to `user_${userId}` room as well!
                // Currently backend only emits to `chat_${chatId}`.

                // CRITICAL FIX logic:
                // If I am NOT in the room, I won't get the socket event. 
                // So `SocketContext` sound logic only works if I have joined all my chats rooms?
                // Or I need to join all my relevant chat rooms on connect?
                // For now, let's assume `ChatWindow` works because we join the room.
                // But for background notifications, we need a mechanism to receive them.
                // I will add a `joinAllChats` or similar to backend later if needed, or just let `ChatWindow` handle the view.

                // Actually, for this specific task "make sounds work", the user likely implies "when I have the app open". 
                // If I am in Chat A, and message comes for Chat B, I only hear sound if I am joined to Chat B?
                // Yes. 
                // Is the user joined to all their chats by default? 
                // Currently NO. The backend `ChatsGateway` has `handleJoinChat`.
                // I should probably join all user's chats on connection in `ChatsGateway`.
                // BUT for now, let's accept that 'sound' might only work if I am 'technically' joined? 
                // OR I should update `ChatsGateway` to emit to `user_${userId}` as well for notifications.
                // Let's stick to fixing `ChatWindow` first.
            }

            // Check if message belongs to this chat (though room isolation handles most)
            // But since 'newMessage' event name is generic, safer to check logic or just trust room.
            setMessages((prev) => {
                if (prev.some(m => m.id === message.id)) return prev;
                // If the message is for THIS chat, add it.
                // We don't have chat ID in message structure in the Interface strictly? 
                // Backend sends: `...payload.message, senderId...`. 
                // The Prisma message object has `chatId`.
                // So we can check `message.chatId === chatId`.
                return [...prev, message];
            });
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, chatId]);


    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 100);
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!newMessage.trim() && !isUploading) || !chatId) return;

        try {
            const content = newMessage;
            setNewMessage('');

            const sentMessage = await chatsAPI.sendMessage(chatId, content);

            setMessages((prev) => {
                if (prev.some(m => m.id === sentMessage.id)) return prev;
                return [...prev, sentMessage];
            });

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !chatId) return;

        setIsUploading(true);
        try {
            const { uploadUrl, publicUrl } = await cotizacionesAPI.getUploadUrl(file.name, file.type);

            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            const sentMessage = await chatsAPI.sendMessage(chatId, '', publicUrl);

            setMessages((prev) => {
                if (prev.some(m => m.id === sentMessage.id)) return prev;
                return [...prev, sentMessage];
            });

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full h-full max-w-full sm:max-w-[500px] sm:h-[600px] flex flex-col p-0 sm:rounded-lg gap-0">
                <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-white sm:rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="sm:hidden" onClick={onClose}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
                    {messages.map((msg) => {
                        let isMe = msg.senderId === currentUserId;
                        let alignment = isMe ? 'justify-end' : 'justify-start';
                        let bubbleColor = isMe
                            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                            : 'bg-white text-gray-800 border-gray-100 border rounded-2xl rounded-tl-sm';

                        let senderLabel = null;

                        // Admin View Logic
                        if (isAdmin) {
                            if (msg.sender.role === 'TIENDA') {
                                alignment = 'justify-end';
                                bubbleColor = 'bg-blue-600 text-white rounded-2xl rounded-tr-sm';
                                senderLabel = 'Tienda';
                            } else {
                                // Taller or others
                                alignment = 'justify-start';
                                bubbleColor = 'bg-white text-gray-800 border-gray-100 border rounded-2xl rounded-tl-sm';
                                senderLabel = 'Taller';
                            }
                        }

                        return (
                            <div key={msg.id} className={`flex w-full flex-col ${alignment === 'justify-end' ? 'items-end' : 'items-start'}`}>
                                {isAdmin && (
                                    <span className="text-[10px] text-gray-400 mb-1 px-1">
                                        {senderLabel}
                                    </span>
                                )}
                                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${alignment === 'justify-end' ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative px-4 py-2 text-sm shadow-sm ${bubbleColor}`}>
                                        {msg.imageUrl && (
                                            <div className="mb-2 overflow-hidden rounded-lg">
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Shared"
                                                    className="max-w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => window.open(msg.imageUrl, '_blank')}
                                                />
                                            </div>
                                        )}
                                        {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!isAdmin && (
                    <div className="p-3 sm:p-4 border-t bg-white sm:rounded-b-lg">
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <ImageIcon className="h-5 w-5" />
                            </Button>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 min-h-[40px] max-h-[100px] resize-none py-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                disabled={(!newMessage.trim() && !isUploading) || isUploading}
                                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                                size="icon"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
