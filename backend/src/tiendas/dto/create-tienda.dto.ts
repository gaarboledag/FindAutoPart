import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTiendaDto {
    @ApiProperty({ example: 'AutoPartes del Sur' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: '900.987.654-3' })
    @IsString()
    @IsNotEmpty()
    rut: string;

    @ApiProperty({ example: '+57 301 234 5678' })
    @IsString()
    @IsNotEmpty()
    telefono: string;

    @ApiProperty({ example: 'Carrera 45 #34-12' })
    @IsString()
    @IsNotEmpty()
    direccion: string;

    @ApiProperty({ example: 'Medellín' })
    @IsString()
    @IsNotEmpty()
    ciudad: string;

    @ApiProperty({ example: 'Antioquia' })
    @IsString()
    @IsNotEmpty()
    region: string;

    @ApiProperty({
        example: ['Bogotá D.C.', 'Cundinamarca', 'Antioquia'],
        description: 'Regions where the store delivers',
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    cobertura: string[];

    @ApiProperty({
        example: ['Frenos', 'Motor', 'Suspensión'],
        description: 'Categories of spare parts offered',
        type: [String],
        required: false,
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    categorias?: string[];
}
