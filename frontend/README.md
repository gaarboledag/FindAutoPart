# Frontend - FindPartAutopartes

Aplicación web construida con Next.js 14, React, TypeScript, Zustand, y TanStack Query.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
# NEXT_PUBLIC_APP_NAME=FindPartAutopartes

# Iniciar servidor
npm run dev
```

La app estará en `http://localhost:3000`

## 📜 Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia servidor de desarrollo (puerto 3000)

### Build & Producción
- `npm run build` - Compilar para producción
- `npm run start` - Ejecutar versión de producción

### Quality
- `npm run lint` - Verificar código con ESLint
- `npm run type-check` - Verificar tipos TypeScript

## 🎨 Estructura

```
app/
├── auth/           # Login, Register
├── taller/         # Dashboard & features para talleres
│   ├── cotizaciones/
│   ├── pedidos/
│   └── ...
├── tienda/         # Dashboard & features para tiendas
│   ├── cotizaciones/
│   ├── repuestos/
│   ├── pedidos/
│   └── ...
├── admin/          # Panel de administración
└── ...

components/         # Componentes reutilizables
lib/               # API client & utilidades
store/             # Estado global (Zustand)
```

## 🔐 Rutas Protegidas

Las rutas están protegidas por rol:

- `/taller/*` - Solo rol TALLER
- `/tienda/*` - Solo rol TIENDA
- `/admin/*` - Solo rol ADMIN

## 📚 Documentación Completa

Ver: `../docs/DEV_SETUP.md`
