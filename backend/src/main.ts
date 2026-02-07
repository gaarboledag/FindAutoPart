import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // CORS - Allow custom domain and production frontend
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://findpart-frontend.0wq0kx.easypanel.host',
            'https://findpart.iacol.online',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        credentials: true,
    });

    // API prefix
    app.setGlobalPrefix('api');

    // Swagger documentation
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

    const port = process.env.BACKEND_PORT || 4000;
    await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Docker

    console.log(`🚀 Backend is running on: http://0.0.0.0:${port}`);
    console.log(`📚 API Docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
