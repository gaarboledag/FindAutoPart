import { Module } from '@nestjs/common';
import { CotizacionesController } from './cotizaciones.controller';
import { CotizacionesService } from './cotizaciones.service';
import { StorageService } from '../common/services/storage.service';

@Module({
    controllers: [CotizacionesController],
    providers: [CotizacionesService, StorageService],
    exports: [CotizacionesService],
})
export class CotizacionesModule { }
