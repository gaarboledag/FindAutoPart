import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePedidoDto {
    @ApiProperty({ description: 'ID of the selected offer' })
    @IsString()
    @IsNotEmpty()
    ofertaId: string;

    @ApiProperty({ example: 'Av. Libertador Bernardo OHiggins 123, Santiago' })
    @IsString()
    @IsNotEmpty()
    direccionEntrega: string;

    @ApiProperty({ example: 'Entregar en horario de oficina', required: false })
    @IsString()
    @IsOptional()
    notas?: string;
}
