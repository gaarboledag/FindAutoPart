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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RepuestosService } from './repuestos.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { UpdateRepuestoDto } from './dto/update-repuesto.dto';
import { SearchRepuestosDto } from './dto/search-repuestos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('repuestos')
@Controller('repuestos')
export class RepuestosController {
    constructor(private readonly repuestosService: RepuestosService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new part in catalog' })
    async create(@CurrentUser() user: any, @Body() dto: CreateRepuestoDto) {
        // Get tienda ID from user
        const tienda = await this.repuestosService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.repuestosService.create(tienda.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all parts or filter by store' })
    findAll(@Query('tiendaId') tiendaId?: string) {
        return this.repuestosService.findAll(tiendaId);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search parts with filters' })
    search(@Query() dto: SearchRepuestosDto) {
        return this.repuestosService.search(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get part by ID' })
    findOne(@Param('id') id: string) {
        return this.repuestosService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update part' })
    async update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: UpdateRepuestoDto,
    ) {
        const tienda = await this.repuestosService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.repuestosService.update(id, tienda.id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA, Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete part' })
    async remove(@Param('id') id: string, @CurrentUser() user: any) {
        const tienda = await this.repuestosService['prisma'].tienda.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });

        if (!tienda) {
            throw new Error('Store profile not found');
        }

        return this.repuestosService.remove(id, tienda.id);
    }
}
