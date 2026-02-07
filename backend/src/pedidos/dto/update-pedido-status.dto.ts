import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PedidoStatus } from '@prisma/client';

export class UpdatePedidoStatusDto {
    @ApiProperty({ enum: PedidoStatus })
    @IsEnum(PedidoStatus)
    status: PedidoStatus;
}
