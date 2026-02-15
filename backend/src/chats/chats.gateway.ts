import {
    WebSocketGateway, WebSocketServer, SubscribeMessage,
    MessageBody, ConnectedSocket, OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? [process.env.FRONTEND_URL].filter(Boolean)
            : ['http://localhost:3000'],
        credentials: true,
    },
})
@Injectable()
export class ChatsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(ChatsGateway.name);

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    // Validate JWT on WebSocket connection
    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token
                || client.handshake.headers?.authorization?.split(' ')[1];

            if (!token) {
                this.logger.warn(`WS connection rejected: no token from ${client.id}`);
                client.emit('error', { message: 'Authentication required' });
                client.disconnect();
                return;
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // Attach user data to socket
            client.data.userId = payload.sub;
            client.data.role = payload.role;
            client.data.email = payload.email;
        } catch (error) {
            this.logger.warn(`WS auth failed for ${client.id}: ${error.message}`);
            client.emit('error', { message: 'Authentication failed' });
            client.disconnect();
        }
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(
        @MessageBody() chatId: string,
        @ConnectedSocket() client: Socket,
    ) {
        if (!client.data.userId) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        client.join(`chat_${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    handleSendMessage(
        @MessageBody() payload: { chatId: string; message: any },
        @ConnectedSocket() client: Socket,
    ) {
        if (!client.data.userId) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        // Use userId from verified token, NOT from client payload
        this.server.to(`chat_${payload.chatId}`).emit('newMessage', {
            ...payload.message,
            senderId: client.data.userId,
        });
    }
}
