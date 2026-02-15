import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { chatsAPI } from '@/lib/api';
import { Store, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdminChatListProps {
    isOpen: boolean;
    onClose: () => void;
    cotizacionId: string | null;
    onSelectChat: (chatId: string, title: string) => void;
}

export function AdminChatList({ isOpen, onClose, cotizacionId, onSelectChat }: AdminChatListProps) {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && cotizacionId) {
            loadChats();
        }
    }, [isOpen, cotizacionId]);

    const loadChats = async () => {
        if (!cotizacionId) return;
        setLoading(true);
        try {
            const data = await chatsAPI.getChatsByCotizacion(cotizacionId);
            setChats(data);
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chats Disponibles</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No hay chats iniciados para esta cotización</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                                    onClick={() => onSelectChat(chat.id, `Chat con ${chat.tienda.nombre}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Store className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">{chat.tienda.nombre}</h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(chat.createdAt), "d MMM, HH:mm", { locale: es })}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        Ver Mensajes
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
