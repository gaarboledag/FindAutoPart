import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepuestoDto {
    @ApiProperty({ example: 'BRK-001' })
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @ApiProperty({ example: 'Pastillas de Freno Delanteras' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'Pastillas de freno cerámicas para vehículos Toyota', required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ example: 'Brembo' })
    @IsString()
    @IsNotEmpty()
    marca: string;

    @ApiProperty({ example: 'Corolla 2015-2020', required: false })
    @IsString()
    @IsOptional()
    modelo?: string;

    @ApiProperty({ example: 45000 })
    @IsNumber()
    @Min(0)
    precioBase: number;

    @ApiProperty({ example: 25 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: ['Frenos', 'Seguridad'] })
    @IsArray()
    @IsString({ each: true })
    categorias: string[];
}
