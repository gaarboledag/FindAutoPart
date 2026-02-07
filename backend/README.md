# Backend - FindPartAutopartes

API REST construida con NestJS, Prisma, PostgreSQL, Redis, y Meilisearch.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar .env (ver DEV_SETUP.md)

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Cargar datos de prueba
npm run prisma:seed

# Iniciar servidor
npm run dev
```

El servidor estará en `http://localhost:4000/api`  
Swagger docs: `http://localhost:4000/api/docs`

## 📜 Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia servidor con hot-reload
- `npm run start:dev` - Alias de dev
- `npm run start:debug` - Inicia con debugger

### Base de Datos
- `npx prisma studio` - UI visual para ver/editar datos
- `npx prisma generate` - Re-generar cliente Prisma
- `npx prisma migrate dev` - Crear/aplicar migraciones
- `npm run prisma:seed` - Cargar datos de prueba
- `npm run db:reset` - ⚠️ Reset completo (borra todo)

### Build & Producción
- `npm run build` - Compilar TypeScript
- `npm run start:prod` - Ejecutar versión compilada

### Testing & Quality
- `npm run lint` - Verificar código
- `npm run format` - Formatear código con Prettier
- `npm run test` - Ejecutar tests unitarios
- `npm run test:watch` - Tests en modo watch
- `npm run test:e2e` - Tests end-to-end

## 🔑 Usuarios de Prueba

Después de ejecutar `npm run prisma:seed`:

- **Admin**: admin@findpart.com / Admin123!
- **Taller**: taller@example.com / Taller123!
- **Tienda**: tienda@example.com / Tienda123!

## 📚 Documentación Completa

Ver: `../docs/DEV_SETUP.md`
