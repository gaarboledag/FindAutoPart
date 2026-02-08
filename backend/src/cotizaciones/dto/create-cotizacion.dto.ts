import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CotizacionItemDto {
    @ApiProperty({ example: 'BRK-001', required: false })
    @IsString()
    @IsOptional()
    codigo?: string;

    @ApiProperty({ example: 'Pastillas de Freno' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'Pastillas delanteras para Toyota Corolla', required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ example: 'Brembo', required: false })
    @IsString()
    @IsOptional()
    marca?: string;

    @ApiProperty({ example: 'https://r2.cloudflarestorage.com/...', required: false })
    @IsString()
    @IsOptional()
    imagenUrl?: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @Min(1)
    cantidad: number;
}

export class CreateCotizacionDto {
    @ApiProperty({ example: 'Repuestos para mantenimiento Toyota Corolla' })
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty({ example: 'Necesito repuestos para mantenimiento de 30.000 km', required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ example: 'Toyota' })
    @IsString()
    @IsNotEmpty()
    marca: string;

    @ApiProperty({ example: 'Corolla' })
    @IsString()
    @IsNotEmpty()
    modelo: string;

    @ApiProperty({ example: 2018 })
    @IsNumber()
    @Min(1900)
    anio: number;

    @ApiProperty({ example: 'ABC-123', required: false })
    @IsString()
    @IsOptional()
    patente?: string;

    @ApiProperty({
        example: 'Frenos',
        description: 'Category of spare parts needed',
        enum: ['Frenos', 'Motor', 'Suspensión', 'Transmisión', 'Sistema Eléctrico',
            'Carrocería', 'Neumáticos', 'Aceites/Lubricantes', 'Pintura/Latonería', 'Otros']
    })
    @IsString()
    @IsNotEmpty()
    categoria: string;

    @ApiProperty({ type: [CotizacionItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CotizacionItemDto)
    items: CotizacionItemDto[];
}
