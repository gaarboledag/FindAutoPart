import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCotizacionDto } from './create-cotizacion.dto';

export class UpdateCotizacionDto extends PartialType(
    OmitType(CreateCotizacionDto, ['items'] as const),
) { }
