import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('ofertas')
@Controller('ofertas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OfertasController {
    constructor(private readonly ofertasService: OfertasService) { }

    @Post('cotizacion/:cotizacionId')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Submit an offer for a quotation' })
    async create(
        @Param('cotizacionId') cotizacionId: string,
        @CurrentUser() user: any,
        @Body() dto: CreateOfertaDto,
    ) {
        const tienda = await this.ofertasService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.ofertasService.create(tienda.id, cotizacionId, dto);
    }

    @Get('my-offers')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Get all my offers' })
    async getMyOffers(@CurrentUser() user: any) {
        const tienda = await this.ofertasService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.ofertasService.findByTienda(tienda.id);
    }

    @Get('cotizacion/:cotizacionId')
    @Roles(Role.TALLER, Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Get all offers for a quotation' })
    findByCotizacion(@Param('cotizacionId') cotizacionId: string) {
        return this.ofertasService.findByCotizacion(cotizacionId);
    }

    @Get('cotizacion/:cotizacionId/compare')
    @Roles(Role.TALLER, Role.ADMIN)
    @ApiOperation({ summary: 'Compare offers for a quotation' })
    getComparison(@Param('cotizacionId') cotizacionId: string) {
        return this.ofertasService.getComparison(cotizacionId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get offer by ID' })
    findOne(@Param('id') id: string) {
        return this.ofertasService.findOne(id);
    }

    @Delete(':id')
    @Roles(Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Delete offer' })
    async remove(@Param('id') id: string, @CurrentUser() user: any) {
        const tienda = await this.ofertasService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.ofertasService.remove(id, tienda.id);
    }
}
