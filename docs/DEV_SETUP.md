# Guía de Desarrollo - FindPartAutopartes

Esta guía te ayudará a configurar el entorno de desarrollo local para trabajar en FindPartAutopartes.

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** 18+ (recomendado 20.x)
- **npm** o **yarn**
- **Docker** y **Docker Compose**
- **Git**

### Verificar instalaciones:

```powershell
node --version   # Debe ser v18.x o superior
npm --version    # Debe ser 9.x o superior
docker --version # Debe estar instalado
git --version    # Debe estar instalado
```

---

## 🚀 Configuración Rápida (5 minutos)

### 1. Clonar el Repositorio

```powershell
# Navegar al directorio deseado
cd Desktop

# Si ya tienes el proyecto, omite este paso
# git clone <url-del-repo> FindAutoPart
cd FindAutoPart
```

### 2. Levantar Servicios de Infraestructura

```powershell
# Iniciar PostgreSQL, Redis, MinIO, Meilisearch, etc.
docker-compose up -d postgres redis meilisearch minio mailhog traefik
```

**Nota**: La primera vez descargará las imágenes Docker (~2GB). Ten paciencia.

Verifica que los servicios estén corriendo:

```powershell
docker-compose ps

# Deberías ver:
# postgres      - running
# redis         - running
# meilisearch   - running
# minio         - running
# mailhog       - running
# traefik       - running
```

### 3. Configurar Backend

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (copiar desde .env.example si existe, o usar este contenido)
```

Crear archivo `backend\.env`:

```env
# Base de datos
DATABASE_URL="postgresql://findpart:findpart123@localhost:5432/findpart_db"

# JWT (usar cualquier string aleatorio largo)
JWT_SECRET="tu-secreto-jwt-super-seguro-desarrollo"
JWT_REFRESH_SECRET="tu-secreto-refresh-super-seguro-desarrollo"

# URLs
APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000

# Email (MailHog para desarrollo - NO requiere configuración)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@findpart.local

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# Meilisearch
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_API_KEY=masterKey

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

```powershell
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Cargar datos de prueba
npm run prisma:seed
```

**Datos de prueba cargados**:
- Admin: `admin@findpart.com` / `Admin123!`
- Taller: `taller@example.com` / `Taller123!`
- Tienda: `tienda@example.com` / `Tienda123!`

```powershell
# Iniciar servidor de desarrollo
npm run dev

# El backend estará en: http://localhost:4000/api
# Swagger docs en: http://localhost:4000/api/docs
```

### 4. Configurar Frontend

Abrir una **nueva terminal** (dejar el backend corriendo):

```powershell
# Desde la raíz del proyecto
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env.local
```

Crear archivo `frontend\.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_NAME=FindPartAutopartes
```

```powershell
# Iniciar servidor de desarrollo
npm run dev

# El frontend estará en: http://localhost:3000
```

---

## ✅ Verificación del Entorno

### 1. Verificar Backend

Abre tu navegador y visita:

- **API Docs (Swagger)**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/api/health

Deberías ver la documentación interactiva de la API.

### 2. Verificar Frontend

- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login

Intenta iniciar sesión con alguna de las credenciales de prueba.

### 3. Verificar Servicios Auxiliares

- **MailHog** (emails): http://localhost:8025
- **MinIO Console**: http://localhost:9001 (usuario: `minioadmin` / `minioadmin`)
- **Traefik Dashboard**: http://localhost:8080

---

## 🔧 Comandos Útiles

### Backend

```powershell
cd backend

# Desarrollo
npm run dev                # Inicia con hot-reload (alias de start:dev)
npm run start:dev          # También funciona

# Base de datos
npx prisma studio          # UI visual para la DB
npx prisma migrate dev     # Crear/aplicar migraciones
npx prisma generate        # Re-generar cliente
npm run prisma:seed        # Re-cargar datos de prueba
npm run db:reset           # Reset completo de DB (⚠️ BORRA TODO)

# Build
npm run build              # Compilar para producción
npm run start:prod         # Ejecutar versión de producción

# Linting
npm run lint               # Verificar código
npm run format             # Formatear código
```

### Frontend

```powershell
cd frontend

# Desarrollo
npm run dev                # Inicia en :3000

# Build
npm run build              # Compilar para producción
npm run start              # Ejecutar versión de producción

# Utilidades
npm run lint               # Verificar código
npm run type-check         # Verificar tipos TypeScript
```

### Docker

```powershell
# Desde la raíz del proyecto

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f [servicio]
# Ejemplo: docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA DATOS)
docker-compose down -v

# Reiniciar un servicio
docker-compose restart [servicio]

# Ver estado
docker-compose ps
```

---

## 🧪 Probar la Aplicación

### Flujo Completo de Prueba

#### 1. Como Taller

```
1. Login en http://localhost:3000/auth/login
   - Email: taller@example.com
   - Pass: Taller123!

2. Ir a "Nueva Cotización"

3. Llenar formulario:
   - Título: "Repuestos Corolla"
   - Agregar items (pastillas, aceite, filtro)
   - Crear cotización

4. Esperar ofertas de tiendas
```

#### 2. Como Tienda

```
1. Login con tienda@example.com / Tienda123!

2. Ir a "Cotizaciones Disponibles"

3. Seleccionar la cotización del taller

4. Enviar oferta:
   - Poner precios para cada item
   - Días de entrega
   - Enviar
```

#### 3. Comparar y Seleccionar (Taller)

```
1. Volver al login como taller

2. Ir a "Mis Cotizaciones"

3. Ver la cotización creada

4. Comparar ofertas en la tabla

5. Seleccionar la mejor oferta → Crea pedido automático
```

#### 4. Gestionar Pedido (Tienda)

```
1. Login como tienda

2. Ir a "Pedidos"

3. Ver el pedido creado

4. Actualizar estado: PENDIENTE → CONFIRMADO → EN_PROCESO → ENVIADO → ENTREGADO
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

```powershell
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Si no está corriendo, iniciarlo
docker-compose up -d postgres

# Esperar 10 segundos y reintentar
```

### Error: "Port 4000/3000 already in use"

```powershell
# Encontrar proceso usando el puerto
netstat -ano | findstr :4000

# Matar el proceso (reemplazar PID con el número)
taskkill /PID <PID> /F

# O cambiar el puerto en el código
```

### Error: npm install falla

```powershell
# Limpiar caché
npm cache clean --force

# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: Prisma no encuentra la base de datos

```powershell
# Verificar DATABASE_URL en .env
# Debe ser: postgresql://findpart:findpart123@localhost:5432/findpart_db

# Re-generar cliente
npx prisma generate

# Aplicar migraciones
npx prisma migrate dev
```

### Los emails no llegan

**En desarrollo, los emails van a MailHog**, no a emails reales:

1. Abre http://localhost:8025
2. Verás todos los emails enviados por la app

---

## 📁 Estructura del Proyecto

```
FindAutoPart/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Autenticación
│   │   ├── talleres/    # Módulo talleres
│   │   ├── tiendas/     # Módulo tiendas
│   │   ├── repuestos/   # Catálogo
│   │   ├── cotizaciones/# Cotizaciones
│   │   ├── ofertas/     # Ofertas
│   │   ├── pedidos/     # Pedidos
│   │   └── admin/       # Admin
│   └── prisma/
│       └── schema.prisma # Esquema DB
│
├── frontend/            # App Next.js
│   ├── app/             # Pages & Routes
│   │   ├── auth/       # Login/Register
│   │   ├── taller/     # Dashboard Taller
│   │   ├── tienda/     # Dashboard Tienda
│   │   └── admin/      # Dashboard Admin
│   ├── components/      # Componentes reutilizables
│   ├── lib/            # API client
│   └── store/          # Estado (Zustand)
│
├── docker/              # Configs Docker
├── docs/               # Documentación
└── docker-compose.yml  # Orquestación
```

---

## 🔐 Seguridad en Desarrollo

⚠️ **LOS ARCHIVOS `.env` NUNCA SE SUBEN A GIT**

- Están en `.gitignore`
- Contienen secretos y credenciales
- Cada desarrollador debe crear los suyos

---

## 🎯 Próximos Pasos

Una vez que tengas todo corriendo:

1. **Explora el código**: Empieza por `backend/src/auth` y `frontend/app`
2. **Lee la docs**: Revisa `docs/backend-summary.md`
3. **Prueba la API**: Usa Swagger docs en http://localhost:4000/api/docs
4. **Modifica algo**: Cambia un color en `frontend/app/globals.css` y ve el hot-reload

---

## 🆘 ¿Necesitas Ayuda?

### Recursos

- **Swagger API**: http://localhost:4000/api/docs
- **Prisma Studio**: `npx prisma studio`
- **Logs Backend**: Mira la terminal donde corre `npm run start:dev`
- **Logs Frontend**: Mira la terminal de Next.js

### Verificación de Salud

```powershell
# Backend
curl http://localhost:4000/api/health

# Base de datos
docker exec -it findpart_postgres psql -U findpart -d findpart_db -c "SELECT COUNT(*) FROM \"User\";"
```

---

## ✨ Tips de Productividad

1. **Usa dos terminales**: Una para backend, otra para frontend
2. **Mantén Swagger abierto**: Es tu mejor amigo para probar APIs
3. **Prisma Studio**: `npx prisma studio` para ver/editar datos visualmente
4. **MailHog**: Revisa emails en http://localhost:8025
5. **Hot Reload**: Ambos frontend y backend recargan automáticamente al guardar

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, deberías tener:

✅ Backend corriendo en :4000  
✅ Frontend corriendo en :3000  
✅ Base de datos con datos de prueba  
✅ Todos los servicios Docker activos  

**¡Feliz desarrollo! 🚀**
