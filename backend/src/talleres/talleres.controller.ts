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
import { TalleresService } from './talleres.service';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('talleres')
@Controller('talleres')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TalleresController {
    constructor(private readonly talleresService: TalleresService) { }

    @Post()
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Create taller profile' })
    create(@CurrentUser() user: any, @Body() createTallerDto: CreateTallerDto) {
        return this.talleresService.create(user.userId, createTallerDto);
    }

    @Get('me')
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Get current user taller profile' })
    getMe(@CurrentUser() user: any) {
        return this.talleresService.findByUserId(user.userId);
    }

    @Patch('me')
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Update current user taller profile' })
    updateMe(@CurrentUser() user: any, @Body() dto: UpdateTallerDto) {
        return this.talleresService.updateByUserId(user.userId, dto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all workshops (Admin only)' })
    findAll() {
        return this.talleresService.findAll();
    }



    @Get(':id')
    @ApiOperation({ summary: 'Get workshop by ID' })
    findOne(@Param('id') id: string) {
        return this.talleresService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.TALLER)
    @ApiOperation({ summary: 'Update workshop profile' })
    update(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: UpdateTallerDto,
    ) {
        return this.talleresService.update(id, user.userId, dto);
    }

    @Delete(':id')
    @Roles(Role.TALLER, Role.ADMIN)
    @ApiOperation({ summary: 'Delete workshop profile' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.talleresService.remove(id, user.userId);
    }
}
