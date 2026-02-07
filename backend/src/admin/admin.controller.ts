import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get platform statistics (Admin only)' })
    getStats() {
        return this.adminService.getStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Patch('users/:id/toggle-status')
    @ApiOperation({ summary: 'Toggle user active status (Admin only)' })
    @ApiParam({ name: 'id', description: 'User ID' })
    toggleUserStatus(@Param('id') id: string) {
        return this.adminService.toggleUserStatus(id);
    }

    @Get('activity')
    @ApiOperation({ summary: 'Get recent platform activity (Admin only)' })
    getRecentActivity() {
        return this.adminService.getRecentActivity();
    }

    @Get('users/:id/metrics')
    @ApiOperation({ summary: 'Get user metrics and activity (Admin only)' })
    @ApiParam({ name: 'id', description: 'User ID' })
    getUserMetrics(@Param('id') id: string) {
        return this.adminService.getUserMetrics(id);
    }

    @Get('analytics')
    @ApiOperation({ summary: 'Get platform analytics with date filtering (Admin only)' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO format)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO format)' })
    getPlatformAnalytics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.adminService.getPlatformAnalytics(startDate, endDate);
    }

    // ========================================
    // COTIZACIONES MANAGEMENT
    // ========================================

    @Get('cotizaciones')
    @ApiOperation({ summary: 'Get all cotizaciones with filters (Admin only)' })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'tallerId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    getAllCotizaciones(
        @Query('status') status?: string,
        @Query('tallerId') tallerId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAllCotizaciones({
            status,
            tallerId,
            startDate,
            endDate,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }

    @Get('cotizaciones/:id')
    @ApiOperation({ summary: 'Get cotización by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'Cotización ID' })
    getCotizacionById(@Param('id') id: string) {
        return this.adminService.getCotizacionById(id);
    }

    @Patch('cotizaciones/:id/status')
    @ApiOperation({ summary: 'Update cotización status (Admin only)' })
    @ApiParam({ name: 'id', description: 'Cotización ID' })
    updateCotizacionStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.adminService.updateCotizacionStatus(id, status);
    }

    @Delete('cotizaciones/:id')
    @ApiOperation({ summary: 'Delete cotización (Admin only)' })
    @ApiParam({ name: 'id', description: 'Cotización ID' })
    deleteCotizacion(@Param('id') id: string) {
        return this.adminService.deleteCotizacion(id);
    }

    // ========================================
    // OFERTAS MANAGEMENT
    // ========================================

    @Get('ofertas')
    @ApiOperation({ summary: 'Get all ofertas with filters (Admin only)' })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'tiendaId', required: false })
    @ApiQuery({ name: 'cotizacionId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    getAllOfertas(
        @Query('status') status?: string,
        @Query('tiendaId') tiendaId?: string,
        @Query('cotizacionId') cotizacionId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAllOfertas({
            status,
            tiendaId,
            cotizacionId,
            startDate,
            endDate,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }

    @Get('ofertas/:id')
    @ApiOperation({ summary: 'Get oferta by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'Oferta ID' })
    getOfertaById(@Param('id') id: string) {
        return this.adminService.getOfertaById(id);
    }

    @Patch('ofertas/:id/status')
    @ApiOperation({ summary: 'Update oferta status (Admin only)' })
    @ApiParam({ name: 'id', description: 'Oferta ID' })
    updateOfertaStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.adminService.updateOfertaStatus(id, status);
    }

    @Delete('ofertas/:id')
    @ApiOperation({ summary: 'Delete oferta (Admin only)' })
    @ApiParam({ name: 'id', description: 'Oferta ID' })
    deleteOferta(@Param('id') id: string) {
        return this.adminService.deleteOferta(id);
    }

    // ========================================
    // PEDIDOS MANAGEMENT
    // ========================================

    @Get('pedidos')
    @ApiOperation({ summary: 'Get all pedidos with filters (Admin only)' })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'tallerId', required: false })
    @ApiQuery({ name: 'tiendaId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    getAllPedidos(
        @Query('status') status?: string,
        @Query('tallerId') tallerId?: string,
        @Query('tiendaId') tiendaId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getAllPedidos({
            status,
            tallerId,
            tiendaId,
            startDate,
            endDate,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }

    @Get('pedidos/:id')
    @ApiOperation({ summary: 'Get pedido by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'Pedido ID' })
    getPedidoById(@Param('id') id: string) {
        return this.adminService.getPedidoById(id);
    }

    @Patch('pedidos/:id/status')
    @ApiOperation({ summary: 'Update pedido status (Admin only)' })
    @ApiParam({ name: 'id', description: 'Pedido ID' })
    updatePedidoStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.adminService.updatePedidoStatus(id, status);
    }

    @Delete('pedidos/:id')
    @ApiOperation({ summary: 'Delete pedido (Admin only)' })
    @ApiParam({ name: 'id', description: 'Pedido ID' })
    deletePedido(@Param('id') id: string) {
        return this.adminService.deletePedido(id);
    }
}
