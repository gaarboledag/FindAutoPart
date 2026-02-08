import { Controller, Get, Post, Body, Param, UseGuards, Req, Put } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('chats')
@Controller('chats')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) { }

    @Post('init')
    @Roles(Role.TALLER, Role.TIENDA)
    async initChat(@Body() body: { cotizacionId: string; tiendaId?: string }, @Req() req) {
        try {
            console.log('Init chat request:', { body, user: req.user });
            // If Taller, needs tiendaId. If Tienda, gets its own ID.
            let tiendaId = body.tiendaId;

            if (req.user.role === Role.TIENDA) {
                const tienda = await this.chatsService['prisma'].tienda.findUnique({ where: { userId: req.user.userId } });
                if (!tienda) {
                    console.error('Store profile not found for user:', req.user.userId);
                    throw new Error('Store profile not found');
                }
                tiendaId = tienda.id;
            }

            if (!tiendaId) {
                console.error('Tienda ID missing in request');
                throw new Error('Tienda ID required');
            }

            return await this.chatsService.initChat(body.cotizacionId, tiendaId);
        } catch (error) {
            console.error('Error initializing chat:', error);
            throw error;
        }
    }

    @Get(':id/messages')
    @Roles(Role.TALLER, Role.TIENDA)
    async getMessages(@Param('id') id: string) {
        return this.chatsService.getMessages(id);
    }

    @Post(':id/messages')
    @Roles(Role.TALLER, Role.TIENDA)
    async sendMessage(@Param('id') id: string, @Body() body: { content: string, imageUrl?: string }, @Req() req) {
        return this.chatsService.sendMessage(id, req.user.userId, body.content, body.imageUrl);
    }

    @Get('cotizacion/:id')
    @Roles(Role.TALLER, Role.TIENDA)
    async getChatsByCotizacion(@Param('id') id: string, @Req() req) {
        return this.chatsService.getChatsByCotizacion(id, req.user);
    }

    @Put(':id/read')
    @Roles(Role.TALLER, Role.TIENDA)
    async markAsRead(@Param('id') id: string, @Req() req) {
        return this.chatsService.markMessagesAsRead(id, req.user.userId);
    }
}
