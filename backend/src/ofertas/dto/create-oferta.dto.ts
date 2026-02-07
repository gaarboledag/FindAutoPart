import {
    IsNumber,
    IsString,
    IsOptional,
    IsBoolean,
    IsArray,
    ValidateNested,
    Min,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OfertaItemDto {
    @ApiProperty({ example: 'abc-123-uuid', description: 'ID of the cotizacion item', required: false })
    @IsUUID()
    @IsOptional()
    cotizacionItemId?: string;

    @ApiProperty({ example: 'Pastillas de Freno Brembo', required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ example: 'Brembo', required: false })
    @IsString()
    @IsOptional()
    marca?: string;

    @ApiProperty({ example: 2, required: false })
    @IsNumber()
    @IsOptional()
    @Min(1)
    cantidad?: number;

    @ApiProperty({ example: 45000 })
    @IsNumber()
    @Min(0)
    precioUnitario: number;

    @ApiProperty({ example: true, default: true })
    @IsBoolean()
    @IsOptional()
    disponible?: boolean;

    @ApiProperty({ example: 3, description: 'Días de entrega', required: false })
    @IsNumber()
    @IsOptional()
    @Min(0)
    diasEntrega?: number;

    @ApiProperty({ example: 'Alternativa disponible', required: false })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty({ required: false, description: 'ID of the part in catalog' })
    @IsString()
    @IsOptional()
    repuestoId?: string;
}

export class CreateOfertaDto {
    @ApiProperty({ example: 3, description: 'Estimated delivery days', required: false })
    @IsNumber()
    @IsOptional()
    @Min(0)
    diasEntrega?: number;

    @ApiProperty({ example: 7, description: 'Validity in days', required: false })
    @IsNumber()
    @IsOptional()
    @Min(1)
    validezDias?: number;

    @ApiProperty({ example: 'Todos los repuestos son originales', required: false })
    @IsString()
    @IsOptional()
    comentarios?: string;

    @ApiProperty({ example: 'Información adicional', required: false })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty({ type: [OfertaItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OfertaItemDto)
    items: OfertaItemDto[];
}
