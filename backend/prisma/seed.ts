import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@findpart.com' },
        update: {},
        create: {
            email: 'admin@findpart.com',
            password: adminPassword,
            role: 'ADMIN',
            isActive: true,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create sample taller user  
    const tallerPassword = await bcrypt.hash('Taller123!', 10);
    const tallerUser = await prisma.user.upsert({
        where: { email: 'taller@example.com' },
        update: {},
        create: {
            email: 'taller@example.com',
            password: tallerPassword,
            role: 'TALLER',
            isActive: true,
        },
    });

    // Create taller profile
    const taller = await prisma.taller.upsert({
        where: { userId: tallerUser.id },
        update: {},
        create: {
            userId: tallerUser.id,
            nombre: 'Taller Mecánico El Rayo',
            rut: '76.123.456-7',
            telefono: '+56912345678',
            direccion: 'Av. Libertador Bernardo OHiggins 123',
            ciudad: 'Santiago',
            region: 'Región Metropolitana',
        },
    });
    console.log('✅ Sample taller created:', taller.nombre);

    // Create sample tienda user
    const tiendaPassword = await bcrypt.hash('Tienda123!', 10);
    const tiendaUser = await prisma.user.upsert({
        where: { email: 'tienda@example.com' },
        update: {},
        create: {
            email: 'tienda@example.com',
            password: tiendaPassword,
            role: 'TIENDA',
            isActive: true,
        },
    });

    // Create tienda profile
    const tienda = await prisma.tienda.upsert({
        where: { userId: tiendaUser.id },
        update: {},
        create: {
            userId: tiendaUser.id,
            nombre: 'AutoPartes del Sur',
            rut: '76.987.654-3',
            telefono: '+56987654321',
            direccion: 'Av. España 456',
            ciudad: 'Santiago',
            region: 'Región Metropolitana',
            cobertura: ['Región Metropolitana', 'Región de Valparaíso'],
        },
    });
    console.log('✅ Sample tienda created:', tienda.nombre);

    // Create sample repuestos
    const repuestos = await Promise.all([
        prisma.repuesto.upsert({
            where: {
                tiendaId_codigo: {
                    tiendaId: tienda.id,
                    codigo: 'BRK-001',
                },
            },
            update: {},
            create: {
                tiendaId: tienda.id,
                codigo: 'BRK-001',
                nombre: 'Pastillas de Freno Delanteras',
                descripcion: 'Pastillas de freno cerámicas',
                marca: 'Brembo',
                modelo: 'Corolla 2015-2020',
                precioBase: 45000,
                stock: 25,
                categorias: ['Frenos', 'Seguridad'],
            },
        }),
        prisma.repuesto.upsert({
            where: {
                tiendaId_codigo: {
                    tiendaId: tienda.id,
                    codigo: 'OIL-001',
                },
            },
            update: {},
            create: {
                tiendaId: tienda.id,
                codigo: 'OIL-001',
                nombre: 'Aceite de Motor Sintético 5W-30',
                descripcion: 'Aceite sintético premium',
                marca: 'Castrol',
                precioBase: 18000,
                stock: 50,
                categorias: ['Lubricantes', 'Mantenimiento'],
            },
        }),
        prisma.repuesto.upsert({
            where: {
                tiendaId_codigo: {
                    tiendaId: tienda.id,
                    codigo: 'FLT-001',
                },
            },
            update: {},
            create: {
                tiendaId: tienda.id,
                codigo: 'FLT-001',
                nombre: 'Filtro de Aire',
                descripcion: 'Filtro de aire de alto rendimiento',
                marca: 'Mann',
                modelo: 'Universal',
                precioBase: 12000,
                stock: 40,
                categorias: ['Filtros', 'Mantenimiento'],
            },
        }),
    ]);
    console.log(`✅ ${repuestos.length} sample repuestos created`);

    console.log('🎉 Database seeding completed!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@findpart.com / Admin123!');
    console.log('Taller: taller@example.com / Taller123!');
    console.log('Tienda: tienda@example.com / Tienda123!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
