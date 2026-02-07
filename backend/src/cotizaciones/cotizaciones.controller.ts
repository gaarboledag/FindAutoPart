import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, CotizacionStatus } from '@prisma/client';

@ApiTags('cotizaciones')
@Controller('cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CotizacionesController {
    constructor(private readonly cotizacionesService: CotizacionesService) { }

    @Post()
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Create a new quotation' })
    async create(@CurrentUser() user: any, @Body() dto: CreateCotizacionDto) {
        const taller = await this.cotizacionesService['prisma'].taller.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!taller) {
            throw new Error('Workshop profile not found');
        }

        return this.cotizacionesService.create(taller.id, dto);
    }

    @Get()
    @Roles(Role.TALLER, Role.ADMIN)
    @ApiOperation({ summary: 'Get all quotations' })
    @ApiQuery({ name: 'status', required: false, enum: CotizacionStatus })
    findAll(@CurrentUser() user: any, @Query('status') status?: CotizacionStatus) {
        // If taller, filter by their ID
        if (user.role === Role.TALLER) {
            return this.cotizacionesService['prisma'].taller
                .findUnique({
                    where: { userId: user.userId },
                    select: { id: true },
                })
                .then((taller) => this.cotizacionesService.findAll(taller?.id, status));
        }

        return this.cotizacionesService.findAll(undefined, status);
    }

    @Get('available')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Get available quotations for store (based on coverage)' })
    async findAvailable(@CurrentUser() user: any) {
        const tienda = await this.cotizacionesService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.cotizacionesService.findAvailableForTienda(tienda.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get quotation by ID' })
    findOne(@Param('id') id: string) {
        return this.cotizacionesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Update quotation' })
    async update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: UpdateCotizacionDto,
    ) {
        const taller = await this.cotizacionesService['prisma'].taller.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!taller) {
            throw new Error('Workshop profile not found');
        }

        return this.cotizacionesService.update(id, taller.id, dto);
    }

    @Post(':id/close')
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Close quotation' })
    async close(@Param('id') id: string, @CurrentUser() user: any) {
        const taller = await this.cotizacionesService['prisma'].taller.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!taller) {
            throw new Error('Workshop profile not found');
        }

        return this.cotizacionesService.close(id, taller.id);
    }

    @Delete(':id')
    @Roles(Role.TALLER, Role.ADMIN)
    @ApiOperation({ summary: 'Delete quotation' })
    async remove(@Param('id') id: string, @CurrentUser() user: any) {
        const taller = await this.cotizacionesService['prisma'].taller.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!taller) {
            throw new Error('Workshop profile not found');
        }

        return this.cotizacionesService.remove(id, taller.id);
    }
}
