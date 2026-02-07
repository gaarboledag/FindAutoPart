import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TalleresModule } from './talleres/talleres.module';
import { TiendasModule } from './tiendas/tiendas.module';
import { RepuestosModule } from './repuestos/repuestos.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests per minute
            },
        ]),

        // Database
        PrismaModule,

        // Modules
        AuthModule,
        TalleresModule,
        TiendasModule,
        RepuestosModule,
        CotizacionesModule,
        OfertasModule,
        PedidosModule,
        AdminModule,
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
