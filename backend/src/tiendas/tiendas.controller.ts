import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('tiendas')
@Controller('tiendas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TiendasController {
    constructor(private readonly tiendasService: TiendasService) { }

    @Post()
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Create store profile' })
    create(@CurrentUser() user: any, @Body() dto: CreateTiendaDto) {
        return this.tiendasService.create(user.userId, dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.TALLER)
    @ApiOperation({ summary: 'Get all stores' })
    findAll() {
        return this.tiendasService.findAll();
    }

    @Get('me')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Get own store profile' })
    findOwn(@CurrentUser() user: any) {
        return this.tiendasService.findByUserId(user.userId);
    }

    @Patch('me')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Update own store profile' })
    updateOwn(@CurrentUser() user: any, @Body() dto: UpdateTiendaDto) {
        return this.tiendasService.updateByUserId(user.userId, dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get store by ID' })
    findOne(@Param('id') id: string) {
        return this.tiendasService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.TIENDA)
    @ApiOperation({ summary: 'Update store profile' })
    update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: UpdateTiendaDto,
    ) {
        return this.tiendasService.update(id, user.userId, dto);
    }

    @Delete(':id')
    @Roles(Role.TIENDA, Role.ADMIN)
    @ApiOperation({ summary: 'Delete store profile' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.tiendasService.remove(id, user.userId);
    }
}
