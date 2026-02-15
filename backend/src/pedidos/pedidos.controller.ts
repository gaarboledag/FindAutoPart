import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('pedidos')
@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    @Post()
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Create order from selected offer' })
    async create(@CurrentUser() user: any, @Body() dto: CreatePedidoDto) {
        const taller = await this.pedidosService['prisma'].taller.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!taller) {
            throw new Error('Workshop profile not found');
        }

        return this.pedidosService.create(taller.id, dto);
    }

    @Get()
    @Roles(Role.TALLER, Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Get all orders (filtered by role)' })
    findAll(@CurrentUser() user: any, @Query('status') status?: string) {
        return this.pedidosService.findAll(user.userId, user.role, status);
    }

    @Get(':id')
    @Roles(Role.TALLER, Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Get order by ID' })
    findOne(@Param('id') id: string) {
        return this.pedidosService.findOne(id);
    }

    @Patch(':id/status')
    @Roles(Role.TIENDA, Role.TALLER)
    @ApiOperation({ summary: 'Update order status' })
    async updateStatus(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: UpdatePedidoStatusDto,
    ) {
        return this.pedidosService.updateStatus(id, user.userId, user.role, dto);
    }

    @Post(':id/cancel')
    @Roles(Role.TALLER, Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Cancel order' })
    cancel(@Param('id') id: string, @CurrentUser() user: any) {
        return this.pedidosService.cancel(id, user.userId, user.role);
    }
}
