import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: [
            'http://localhost:3000',
            'https://findpart-frontend.0wq0kx.easypanel.host',
            'https://findpart.iacol.online',
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true
    }
})
export class ChatsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinChat')
    handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
        client.join(`chat_${chatId}`);
        // console.log(`Client ${client.id} joined chat_${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    handleSendMessage(@MessageBody() payload: { chatId: string, message: any }) {
        this.server.to(`chat_${payload.chatId}`).emit('newMessage', payload.message);
    }
}
