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
    NotFoundException,
    ForbiddenException,
    Logger,
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
import { StorageService } from '../common/services/storage.service';

@ApiTags('cotizaciones')
@Controller('cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CotizacionesController {
    private readonly logger = new Logger(CotizacionesController.name);

    constructor(
        private readonly cotizacionesService: CotizacionesService,
        private readonly storageService: StorageService
    ) { }

    @Post('upload-url')
    @Roles(Role.TALLER, Role.TIENDA)
    @ApiOperation({ summary: 'Get presigned URL for image upload' })
    async getUploadUrl(@CurrentUser() user: any, @Body() body: { filename: string, contentType: string }) {
        return this.storageService.generatePresignedUrl(body.filename, body.contentType);
    }

    @Post()
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Create a new quotation' })
    async create(@CurrentUser() user: any, @Body() dto: CreateCotizacionDto) {
        const taller = await this.cotizacionesService['prisma'].taller.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!taller) {
            throw new NotFoundException('Workshop profile not found');
        }

        return await this.cotizacionesService.create(taller.id, dto);
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
            throw new NotFoundException('Store profile not found');
        }

        return this.cotizacionesService.findAvailableForTienda(tienda.id);
    }

    @Get('tienda/unread-count')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Get count of unviewed available quotations' })
    async getUnreadCount(@CurrentUser() user: any) {
        const tienda = await this.cotizacionesService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new NotFoundException('Store profile not found');
        }

        const count = await this.cotizacionesService.getUnreadCount(tienda.id);
        return { count };
    }

    @Get(':id')
    @Roles(Role.TALLER, Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Get quotation by ID' })
    async findOne(@Param('id') id: string, @CurrentUser() user: any) {
        const cotizacion = await this.cotizacionesService.findOne(id);

        if (!cotizacion) {
            throw new NotFoundException('Quotation not found');
        }

        // Access control: verify ownership or authorized access
        if (user.role === Role.TALLER) {
            const taller = await this.cotizacionesService['prisma'].taller.findUnique({
                where: { userId: user.userId },
                select: { id: true },
            });
            if (cotizacion.tallerId !== taller?.id) {
                throw new ForbiddenException('Access denied');
            }
        }

        // Stores can only view open quotations
        if (user.role === Role.TIENDA && cotizacion.status !== 'ABIERTA') {
            // Allow access if tienda has an existing offer on this quotation
            const tienda = await this.cotizacionesService['prisma'].tienda.findUnique({
                where: { userId: user.userId },
                select: { id: true },
            });
            const hasOffer = await this.cotizacionesService['prisma'].oferta.findUnique({
                where: {
                    cotizacionId_tiendaId: {
                        cotizacionId: id,
                        tiendaId: tienda?.id || '',
                    },
                },
            });
            if (!hasOffer) {
                throw new ForbiddenException('This quotation is no longer available');
            }
        }

        return cotizacion;
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
            throw new NotFoundException('Workshop profile not found');
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
            throw new NotFoundException('Workshop profile not found');
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
            throw new NotFoundException('Workshop profile not found');
        }

        return this.cotizacionesService.remove(id, taller.id);
    }

    @Post(':id/view')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Mark quotation as viewed' })
    async markAsViewed(@Param('id') id: string, @CurrentUser() user: any) {
        const tienda = await this.cotizacionesService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new NotFoundException('Store profile not found');
        }

        return this.cotizacionesService.markAsViewed(id, tienda.id);
    }
}
