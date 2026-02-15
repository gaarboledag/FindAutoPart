import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const isProduction = process.env.NODE_ENV === 'production';

    const app = await NestFactory.create(AppModule, {
        logger: isProduction
            ? ['error', 'warn']
            : ['log', 'debug', 'error', 'warn', 'verbose'],
    });

    const logger = new Logger('Bootstrap');

    // Security: Helmet HTTP headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "blob:", "https:"],
                connectSrc: ["'self'", process.env.FRONTEND_URL].filter(Boolean),
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    }));

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: false,
            },
        }),
    );

    // CORS — Strict by environment
    app.enableCors({
        origin: isProduction
            ? [process.env.FRONTEND_URL].filter(Boolean)
            : ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400,
    });

    // API prefix
    app.setGlobalPrefix('api');

    // Swagger documentation — ONLY in development
    if (!isProduction) {
        const config = new DocumentBuilder()
            .setTitle('FindPartAutopartes API')
            .setDescription('B2B SaaS Platform for Auto Parts Quotations')
            .setVersion('0.1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication endpoints')
            .addTag('talleres', 'Workshop management')
            .addTag('tiendas', 'Store management')
            .addTag('repuestos', 'Parts catalog')
            .addTag('cotizaciones', 'Quotations')
            .addTag('ofertas', 'Offers')
            .addTag('pedidos', 'Orders')
            .addTag('admin', 'Admin panel')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
        logger.log('📚 Swagger docs available at /api/docs');
    }

    const port = process.env.BACKEND_PORT || 4000;
    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Backend running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
}

bootstrap();
