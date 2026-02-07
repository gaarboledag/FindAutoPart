# Solución: Ejecutar desde Git Bash

El error que obtienes es porque PowerShell tiene la ejecución de scripts deshabilitada.

## Solución Rápida

**EJECUTA ESTOS COMANDOS DESDE GIT BASH** (la terminal que ya tienes abierta):

```bash
# 1. Generar cliente Prisma
npx prisma generate

# 2. Aplicar migraciones
npx prisma migrate dev --name init

# 3. Cargar datos de prueba
npm run prisma:seed

# 4. Iniciar servidor
npm run dev
```

## Alternativa: Habilitar Scripts en PowerShell (Opcional)

Si prefieres usar PowerShell, ejecuta esto como Administrador:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Pero **GIT BASH ES MÁS FÁCIL** y ya lo tienes funcionando.

---

## Pasos Completos (Git Bash)

```bash
# Asegúrate de estar en la carpeta backend
cd ~/Desktop/FindAutoPart/backend

# 1. Generar Prisma Client (esto creará los tipos TypeScript)
npx prisma generate

# 2. Crear la base de datos y tablas
npx prisma migrate dev --name init

# 3. Cargar usuarios de prueba
npm run prisma:seed

# 4. Iniciar servidor
npm run dev
```

✅ Docker ya está corriendo  
✅ El schema.prisma es correcto  
🔄 Solo falta generar el cliente Prisma

**¡Ejecuta los comandos en Git Bash y todo funcionará!** 🚀
