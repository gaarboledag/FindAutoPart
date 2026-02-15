import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { ChatsModule } from './chats/chats.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting — Multi-tier
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,    // 1 second
                limit: 20,    // 20 req/sec
            },
            {
                name: 'medium',
                ttl: 10000,   // 10 seconds
                limit: 60,    // 60 req/10sec
            },
            {
                name: 'long',
                ttl: 60000,   // 1 minute
                limit: 150,   // 150 req/min
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
        ChatsModule,
        EventsModule,
    ],
    controllers: [],
    providers: [
        // Apply ThrottlerGuard globally
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
