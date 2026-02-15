import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatsGateway } from './chats.gateway';
import { Role } from '@prisma/client';

@Injectable()
export class ChatsService {
    private readonly logger = new Logger(ChatsService.name);

    constructor(
        private prisma: PrismaService,
        private chatsGateway: ChatsGateway
    ) { }

    async initChat(cotizacionId: string, tiendaId: string) {
        // Check if chat exists
        let chat = await this.prisma.chat.findUnique({
            where: {
                cotizacionId_tiendaId: {
                    cotizacionId,
                    tiendaId
                }
            }
        });

        if (!chat) {
            // Get Taller ID from Cotizacion
            const cotizacion = await this.prisma.cotizacion.findUnique({
                where: { id: cotizacionId },
                select: { tallerId: true }
            });

            if (!cotizacion) {
                throw new BadRequestException('Quotation not found');
            }

            chat = await this.prisma.chat.create({
                data: {
                    cotizacionId,
                    tiendaId,
                    tallerId: cotizacion.tallerId
                }
            });
            this.logger.debug(`Chat created: ${chat.id}`);
        }

        return chat;
    }

    async getMessages(chatId: string) {
        return this.prisma.chatMessage.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, email: true, role: true }
                }
            }
        });
    }

    async sendMessage(chatId: string, userId: string, content: string, imageUrl?: string) {
        const message = await this.prisma.chatMessage.create({
            data: {
                chatId,
                senderId: userId,
                content,
                imageUrl
            },
            include: {
                sender: { select: { id: true, email: true, role: true } }
            }
        });

        // Notify gateway for real-time update
        this.chatsGateway.server.to(`chat_${chatId}`).emit('newMessage', message);

        return message;
    }

    async getChatsByCotizacion(cotizacionId: string, user: any) {
        const whereClause: any = { cotizacionId };

        // Security: ensure user is related to the chat
        if (user.role === Role.TIENDA) {
            const tienda = await this.prisma.tienda.findUnique({ where: { userId: user.userId } });
            if (!tienda) throw new BadRequestException('Store not found');
            whereClause.tiendaId = tienda.id;
        } else if (user.role === Role.TALLER) {
            const taller = await this.prisma.taller.findUnique({ where: { userId: user.userId } });
            if (!taller) throw new BadRequestException('Workshop not found');
            whereClause.tallerId = taller.id;
        }

        const chats = await this.prisma.chat.findMany({
            where: whereClause,
            include: {
                tienda: { select: { id: true, nombre: true } },
                taller: { select: { id: true, nombre: true } },
                messages: {
                    where: {
                        isRead: false,
                        senderId: { not: user.userId }
                    },
                    select: { id: true }
                }
            }
        });

        // Map to cleaner structure
        return chats.map(chat => ({
            ...chat,
            unreadCount: chat.messages.length
        }));
    }

    async markMessagesAsRead(chatId: string, userId: string) {
        await this.prisma.chatMessage.updateMany({
            where: {
                chatId,
                senderId: { not: userId },
                isRead: false
            },
            data: { isRead: true }
        });
        return { success: true };
    }
}
