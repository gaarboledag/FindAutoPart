import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
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
    namespace: '/', // Use root namespace or a specific one if needed, but root is easier for shared connection
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(EventsGateway.name);

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

            if (!token) {
                // Allow unauthenticated connections? Promoting strict auth for now.
                // client.disconnect(); 
                // actually, let's just not join them to privileged rooms if no token.
                return;
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // Join User Room
            const userId = payload.sub;
            client.data.userId = userId;
            client.data.role = payload.role;
            await client.join(`user_${userId}`);
            this.logger.log(`Client ${client.id} joined room: user_${userId}`);

            // Join Role Room (e.g., 'TIENDAS', 'TALLERES')
            if (payload.role) {
                const roleRoom = `${payload.role}S`; // TIENDAS, TALLERES, ADMINS
                await client.join(roleRoom);
                this.logger.log(`Client ${client.id} joined room: ${roleRoom}`);
            }

        } catch (error) {
            this.logger.warn(`Events Gateway Auth failed: ${error.message}`);
            // Don't disconnect, just don't join rooms.
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    // Generic method to emit events to specific users
    emitToUser(userId: string, event: string, data: any) {
        this.server.to(`user_${userId}`).emit(event, data);
    }

    // Generic method to emit events to roles
    emitToRole(role: 'TALLER' | 'TIENDA' | 'ADMIN', event: string, data: any) {
        this.server.to(`${role}S`).emit(event, data);
    }

    // Broadcast to all
    broadcast(event: string, data: any) {
        this.server.emit(event, data);
    }
}
