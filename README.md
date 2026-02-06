# FindPartAutopartes

**B2B SaaS Marketplace** para cotizaciones de autopartes entre talleres y tiendas.

## 🎯 Descripción

FindPartAutopartes digitaliza el proceso de cotización de repuestos automotrices, reemplazando llamadas telefónicas y WhatsApp con una plataforma centralizada que permite:

- **Talleres**: Crear cotizaciones, comparar ofertas y gestionar pedidos
- **Tiendas**: Recibir solicitudes, ofertar precios y administrar ventas
- **Administradores**: Supervisar la plataforma y gestionar usuarios

## 🏗️ Arquitectura

**Modular Monolith** preparado para evolucionar a microservicios.

### Stack Tecnológico

- **Frontend**: Next.js 14+ con TypeScript
- **Backend**: NestJS con Prisma ORM
- **Base de Datos**: PostgreSQL
- **Cache & Queues**: Redis + BullMQ
- **Búsqueda**: Meilisearch
- **Almacenamiento**: MinIO (S3-compatible)
- **Reverse Proxy**: Traefik
- **Containerización**: Docker + Docker Compose

### Servicios

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Frontend  │────▶│   Traefik    │────▶│  Backend   │
│  (Next.js)  │     │ Reverse Proxy│     │  (NestJS)  │
└─────────────┘     └──────────────┘     └─────┬──────┘
                                                │
                    ┌───────────────────────────┴──────────┐
                    │                                      │
         ┌──────────▼─────┐  ┌─────────┐  ┌──────────────▼─────┐
         │   PostgreSQL   │  │  Redis  │  │   Meilisearch      │
         │   (Database)   │  │ (Cache) │  │  (Search Engine)   │
         └────────────────┘  └────┬────┘  └────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │   BullMQ Worker   │
                        │ (Async Processes) │
                        └───────────────────┘
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- Docker & Docker Compose
- Git

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd FindAutoPart

# Configurar variables de entorno
cp .env.example .env

# Levantar todos los servicios
docker-compose up -d

# Instalar dependencias del backend
cd backend
npm install

# Ejecutar migraciones
npm run prisma:migrate

# Seed de datos iniciales
npm run seed

# Instalar dependencias del frontend
cd ../frontend
npm install

# Iniciar desarrollo
npm run dev
```

### Acceso Local

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **MinIO Console**: http://localhost:9001
- **Meilisearch**: http://localhost:7700

## 📁 Estructura del Proyecto

```
/FindAutoPart
├── /backend              # API NestJS
│   ├── /src
│   │   ├── /auth         # Autenticación y autorización
│   │   ├── /talleres     # Gestión de talleres
│   │   ├── /tiendas      # Gestión de tiendas
│   │   ├── /repuestos    # Catálogo de repuestos
│   │   ├── /cotizaciones # Sistema de cotizaciones
│   │   ├── /ofertas      # Sistema de ofertas
│   │   ├── /comparador   # Lógica de comparación
│   │   ├── /pedidos      # Gestión de pedidos
│   │   ├── /notifications# Notificaciones
│   │   └── /admin        # Panel administrativo
│   ├── /prisma           # Schema y migraciones
│   └── /test             # Tests
├── /frontend             # SPA Next.js
│   ├── /src
│   │   ├── /app          # App Router
│   │   ├── /components   # Componentes reutilizables
│   │   ├── /lib          # Utilities
│   │   └── /hooks        # Custom hooks
│   └── /e2e              # Tests E2E (Playwright)
├── /docker               # Configuraciones Docker
├── /docs                 # Documentación
│   ├── /architecture     # Arquitectura y ADRs
│   └── /api              # API docs
└── /scripts              # Utilidades
```

## 🧪 Testing

```bash
# Backend - Unit tests
cd backend
npm test

# Backend - Integration tests
npm run test:e2e

# Frontend - E2E tests
cd frontend
npm run test:e2e
```

## 📋 Módulos Funcionales

1. **Autenticación**: JWT con refresh tokens, RBAC
2. **Talleres**: Perfiles, gestión de contactos
3. **Tiendas**: Perfiles, cobertura geográfica, catálogo
4. **Repuestos**: Búsqueda avanzada, indexación
5. **Cotizaciones**: Creación, publicación, estados
6. **Ofertas**: Precios, tiempos de entrega
7. **Comparador**: Análisis multi-criterio
8. **Pedidos**: Workflow completo, trazabilidad
9. **Notificaciones**: Email automáticos
10. **Admin**: Supervisión y gestión

## 🔐 Roles y Permisos

- **TALLER**: Crear cotizaciones, comparar ofertas, realizar pedidos
- **TIENDA**: Ver cotizaciones, enviar ofertas, gestionar pedidos
- **ADMIN**: Acceso completo al sistema

## 📚 Documentación

- [Arquitectura del Sistema](./docs/architecture/system-architecture.md)
- [Decisiones de Arquitectura (ADRs)](./docs/architecture/decisions/)
- [API Documentation](./docs/api/)
- [Guía de Despliegue](./docs/deployment.md)

## 🛠️ Desarrollo

### Branching Strategy

- `main` → Producción
- `develop` → Integración
- `feature/*` → Nuevas features

### Commits

Conventional Commits format:
```
feat(module): descripción
fix(module): descripción
docs: descripción
```

### Pull Requests

Requeridos para merge a `develop` y `main`.

## 🚢 Despliegue

El proyecto está configurado para despliegue en VPS con Easypanel.

Ver [Guía de Despliegue](./docs/deployment.md) para detalles.

## 📄 Licencia

Propietario - Todos los derechos reservados

## 👥 Contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md)
# FindAutoPart
