import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTallerDto {
    @ApiProperty({ example: 'Taller Mecánico El Rayo' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: '900.123.456-7' })
    @IsString()
    @IsNotEmpty()
    rut: string;

    @ApiProperty({ example: '+57 300 123 4567' })
    @IsString()
    @IsNotEmpty()
    telefono: string;

    @ApiProperty({ example: 'Calle 100 #15-45' })
    @IsString()
    @IsNotEmpty()
    direccion: string;

    @ApiProperty({ example: 'Bogotá' })
    @IsString()
    @IsNotEmpty()
    ciudad: string;

    @ApiProperty({ example: 'Bogotá D.C.' })
    @IsString()
    @IsNotEmpty()
    region: string;
}
