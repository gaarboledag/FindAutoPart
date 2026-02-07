import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchRepuestosDto {
    @ApiProperty({ required: false, description: 'Search query' })
    @IsString()
    @IsOptional()
    query?: string;

    @ApiProperty({ required: false, description: 'Filter by brand' })
    @IsString()
    @IsOptional()
    marca?: string;

    @ApiProperty({ required: false, description: 'Filter by category' })
    @IsString()
    @IsOptional()
    categoria?: string;

    @ApiProperty({ required: false, description: 'Filter by store ID' })
    @IsString()
    @IsOptional()
    tiendaId?: string;

    @ApiProperty({ required: false, description: 'Filter by stock availability' })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    enStock?: boolean;

    @ApiProperty({ required: false, default: 50 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    @ApiProperty({ required: false, default: 0 })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @ApiProperty({ required: false, enum: ['nombre', 'precioBase', 'stock', 'createdAt'] })
    @IsEnum(['nombre', 'precioBase', 'stock', 'createdAt'])
    @IsOptional()
    orderBy?: string;

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    order?: 'asc' | 'desc';
}
