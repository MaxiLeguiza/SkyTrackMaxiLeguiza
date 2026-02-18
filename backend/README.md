# SkyTrack Airlines - Backend API

<p align="center">
  <strong>Sistema de Gestión de Vuelos, Aviones y Tripulación</strong>
</p>

---

## ⚡ Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env en la raíz
DATABASE_URL="mongodb://localhost:27017/skytrack"
JWT_SECRET="tu-secreto-super-seguro"
PORT=3000

# 3. Generar tipos y sincronizar Prisma
npx prisma generate
npx prisma db push

# 4. Iniciar servidor en modo desarrollo
npm run start:dev
```

**Servidor disponible en:** `http://localhost:3000`

---

## 📖 Documentación Completa

- 📘 **[PROYECTO.md](PROYECTO.md)** - Documentación técnica detallada, arquitectura y endpoints
- 📕 **[GUIA_USO.md](GUIA_USO.md)** - Ejemplos de uso con cURL y JSON para todos los endpoints

---

## 📋 Descripción

SkyTrack Airlines es una aplicación backend desarrollada con **NestJS** que proporciona una API REST completa para gestionar:

- ✈️ **Vuelos** - Crear, listar, filtrar y actualizar vuelos
- 🛩️ **Aviones** - Gestionar flota de aviones con estados
- 👨‍✈️ **Tripulación** - Administrar tripulantes y asignaciones
- 🔐 **Autenticación** - JWT con roles (ADMIN y OPERADOR)
- 📊 **Validaciones** - DTOs con validaciones automáticas
- 🗑️ **Soft Delete** - Eliminación lógica de registros
- 🧪 **Testing Completo** - Unit tests (7) + E2E tests (45+)

## 🎯 Consignas Implementadas

| #   | Caso de Uso                 | Estado | Detalles                                                  |
| --- | --------------------------- | ------ | --------------------------------------------------------- |
| 1   | Listado de Vuelos + Filtros | ✅     | [Ver](PROYECTO.md#caso-1-listado-y-filtros-de-vuelos-)    |
| 2   | Baja Lógica (Soft Delete)   | ✅     | [Ver](PROYECTO.md#caso-2-eliminación-lógica-soft-delete-) |
| 3   | Crear y Editar Vuelos       | ✅     | [Ver](PROYECTO.md#caso-3-crear-y-editar-registros-)       |
| 4   | Gestión de Aviones          | ✅     | [Ver](PROYECTO.md#caso-4-gestión-de-aviones-)             |
| 5   | Gestión de Tripulación      | ✅     | [Ver](PROYECTO.md#caso-5-gestión-de-tripulación-)         |
| 6   | Panel de Estado de Vuelo    | ✅     | [Ver](PROYECTO.md#caso-6-panel-de-estado-)                |
| 7   | Unit Tests                  | ✅     | [Ver](PROYECTO.md#caso-7-unit-tests-)                     |
| 8   | Tests E2E                   | ✅     | [Ver](PROYECTO.md#caso-8-e2e-tests-)                      |

---

## 🧪 Ejecución de Tests

### Tests Unitarios (7 casos)

```bash
npm test
```

Prueba el servicio de filtrado de vuelos

### Tests E2E (45+ casos)

```bash
npm run test:e2e
```

Valida todos los casos de uso completos

### Con Cobertura

```bash
npm run test:cov
```

Genera reporte de cobertura en `coverage/`

---

## 🔐 Autenticación

### 1. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@skytrack.com",
    "password": "admin123"
  }'
```

### 2. Respuesta

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nombreusuario": "admin@skytrack.com",
    "role": "ADMIN"
  }
}
```

### 3. Usar Token

Agregar en header de requests:

```
Authorization: Bearer <access_token>
```

---

## ✈️ Endpoints Principales

### Vuelos (Casos 1, 3, 6)

```
GET    /vuelos                    # Listar con filtros
GET    /vuelos?origen=X&destino=Y&estado=Z  # Con parámetros
POST   /vuelos                    # Crear
GET    /vuelos/:id               # Obtener
PUT    /vuelos/:id               # Editar
DELETE /vuelos/:id               # Eliminar (soft delete)
PATCH  /vuelos/:id/estado        # Cambiar estado
PATCH  /vuelos/:id/avion/:avionId  # Asignar avión
```

### Aviones (Caso 4)

```
GET    /aviones                  # Listar
POST   /aviones                  # Crear
GET    /aviones/:id             # Obtener
PUT    /aviones/:id             # Editar
DELETE /aviones/:id             # Eliminar
```

### Tripulantes & Asignaciones (Caso 5)

```
GET    /tripulantes                            # Listar
POST   /tripulantes                            # Crear
POST   /vuelos/:id/tripulantes/:tripulanteId   # Asignar
DELETE /vuelos/:id/tripulantes/:tripulanteId   # Remover
GET    /vuelos/:id/tripulantes                 # Listar asignados
```

### Usuarios (solo ADMIN)

```
POST   /usuarios                 # Crear
GET    /usuarios                 # Listar
PUT    /usuarios/:id            # Editar
DELETE /usuarios/:id            # Eliminar
```

---

## 🔒 Control de Roles

| Rol          | Permisos                                               |
| ------------ | ------------------------------------------------------ |
| **ADMIN**    | Crear/editar/eliminar todo; gestionar usuarios         |
| **OPERADOR** | Ver vuelos; crear/editar vuelos; gestionar tripulación |
| **Sin rol**  | Solo acceso a `/auth/login`                            |

---

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                    # Autenticación y autorización
│   ├── guards/              # RolesGuard
│   ├── strategies/          # LocalStrategy, JwtStrategy
│   ├── decorator/           # @Roles decorador
│   ├── auth.service.ts      # Lógica auth
│   └── auth.controller.ts   # POST /auth/login
│
├── vuelos/                  # Gestión de Vuelos
│   ├── dto/                 # DTOs con validaciones
│   ├── vuelos.service.ts    # CRUD + filtrados
│   ├── vuelos.controller.ts # Endpoints
│   └── vuelos.module.ts
│
├── aviones/                 # Gestión de Aviones
│   ├── aviones.service.ts
│   ├── aviones.controller.ts
│   └── aviones.module.ts
│
├── tripulantes/             # Gestión de Tripulantes
│   ├── tripulantes.service.ts
│   ├── tripulantes.controller.ts
│   └── tripulantes.module.ts
│
├── vuelos-tripulantes/      # Relación Vuelo-Tripulante
│   ├── vuelos-tripulantes.service.ts
│   ├── vuelos-tripulantes.controller.ts
│   └── vuelos-tripulantes.module.ts
│
├── usuarios/                # Gestión de Usuarios
│   ├── usuarios.service.ts  # Con bcrypt
│   ├── usuarios.controller.ts
│   └── usuarios.module.ts
│
├── app.module.ts            # Módulo principal
├── main.ts                  # Bootstrap
└── app.controller.ts        # Health check

prisma/
├── schema.prisma            # Modelos MongoDB
├── prisma.service.ts        # Conexión BD
└── prisma.module.ts         # Inyección

test/
├── app.e2e-spec.ts         # 45+ E2E tests
└── jest-e2e.json
```

---

## 💾 Modelos de Datos

### Vuelos

- `id`: string
- `origen`: string
- `destino`: string
- `estado`: PROGRAMADO | EMBARCADO | EN_VUELO | ATERRIZADO | CANCELADO
- `avionId`: string (opcional)
- `deleted`: boolean (soft delete)

### Aviones

- `id`: string
- `modelo`: string
- `capacidad`: number
- `estado`: DISPONIBLE | EN_VUELO | MANTENIMIENTO
- `deleted`: boolean

### Tripulantes

- `id`: string
- `nombre`: string
- `rol`: string
- `deleted`: boolean

### Usuarios

- `id`: string
- `nombreusuario`: email
- `password`: hashed con bcrypt (10 rounds)
- `role`: ADMIN | OPERADOR

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run start:dev            # Iniciar con auto-reload
npm run start                # Iniciar producción
npm run build                # Compilar

# Testing
npm test                     # Unit tests
npm run test:watch          # Unit tests en modo observación
npm run test:cov            # Con cobertura
npm run test:e2e            # E2E tests
npm run test:debug          # Debug mode

# Utilidades
npm run format              # Formatear código
npm run lint                # Validar código
npx prisma generate         # Generar tipos Prisma
npx prisma db push          # Sincronizar BD
npx prisma studio          # Ver BD en GUI
```

---

## ✨ Características Técnicas

- ✅ **NestJS 11.0.1** - Framework TypeScript moderno
- ✅ **Prisma 7.1.0** - ORM tipo-seguro para MongoDB
- ✅ **JWT + Passport** - Autenticación estándar
- ✅ **bcrypt** - Hashing seguro de contraseñas
- ✅ **class-validator** - Validación automática de DTOs
- ✅ **Jest** - Testing robusto
- ✅ **Soft Delete** - Preserva datos históricos
- ✅ **Relaciones** - Vuelos ↔ Tripulantes (many-to-many)

---

## 📝 Notas Importantes

1. **Soft Delete**: Los registros nunca se eliminan, solo se marcan `deleted: true`
2. **Bcrypt**: Contraseñas hasheadas con 10 rounds de salt
3. **Validaciones**: Todas las entradas se validan con decoradores
4. **Roles**: Validados en cada endpoint protegido
5. **Tests**: Cobertura completa de casos de uso

---

## 🎓 Proyecto Junior-Friendly

Este proyecto está desarrollado siguiendo buenas prácticas pero manteniendo claridad y legibilidad para un desarrollador junior:

- Comentarios explicativos en métodos complejos
- Estructura modular y fácil de entender
- Nombres de variables descriptivos
- Manejo de errores consistente
- Validaciones en capas

---

## 🚀 Listo para Producción

- ✅ Código validado y sin errores
- ✅ Tests unitarios y E2E pasando
- ✅ Documentación completa
- ✅ Seguridad implementada (JWT, bcrypt, validaciones)
- ✅ Manejo de errores robusto

---

**¡Proyecto completamente funcional!** 🎉

Para más información, ver [PROYECTO.md](PROYECTO.md) y [GUIA_USO.md](GUIA_USO.md)## 🛠️ Stack Tecnológico

```json
{
  "framework": "NestJS 11.0.1",
  "language": "TypeScript 5.7",
  "database": "MongoDB + Prisma ORM",
  "auth": "JWT + Passport",
  "validation": "class-validator",
  "testing": "Jest + Supertest",
  "linting": "ESLint + Prettier"
}
```

---

## 📦 Instalación

### Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** en ejecución (local o atlas)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Copia el archivo .env.example (si existe) o crea uno:
cat > .env << EOF
DATABASE_URL="mongodb://localhost:27017/skytrack"
JWT_SECRET="tu-clave-secreta-super-segura"
PORT=3000
EOF

# 3. Generar cliente de Prisma
npx prisma generate

# 4. Ejecutar migraciones (si existen)
npx prisma migrate dev

# 5. Verificar compilación
npm run build
```

---

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run start:dev
```

Inicia con hot reload. El servidor escucha en `http://localhost:3000`

### Modo Producción

```bash
npm run build
npm run start:prod
```

### Linting

```bash
npm run lint
```

---

## 🧪 Testing

### Tests Unitarios

```bash
# Ejecutar todos los tests
npm run test

# Modo watch (re-ejecuta al detectar cambios)
npm run test:watch

# Cobertura de código
npm run test:cov
```

### Tests E2E

```bash
npm run test:e2e
```

Valida:

- ✅ Listado y filtrado de vuelos
- ✅ Crear/editar vuelos
- ✅ Gestión de aviones
- ✅ Asignación de tripulación
- ✅ Autenticación

---

## 📚 Documentación de API

### Guía Rápida

#### 1. **Hacer Login**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. **Usar Token en Requests**

```bash
curl -X GET http://localhost:3000/vuelos \
  -H "Authorization: Bearer {access_token}"
```

#### 3. **Crear Vuelo**

```bash
curl -X POST http://localhost:3000/vuelos \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "origen": "Madrid",
    "destino": "Barcelona",
    "estado": "PROGRAMADO"
  }'
```

#### 4. **Filtrar Vuelos**

```bash
# Por estado
curl "http://localhost:3000/vuelos?estado=EN_VUELO"

# Por origen
curl "http://localhost:3000/vuelos?origen=Madrid"

# Por destino
curl "http://localhost:3000/vuelos?destino=Barcelona"

# Múltiples filtros
curl "http://localhost:3000/vuelos?origen=Madrid&estado=PROGRAMADO"
```

### Documentación Completa

Ver [CAMBIOS_APLICADOS.md](CAMBIOS_APLICADOS.md) para:

- ✅ Documentación detallada de todos los endpoints
- ✅ Ejemplos de requests y responses
- ✅ Matriz de permisos por rol
- ✅ Explicación de todos los cambios implementados

---

## 🔐 Autenticación y Autorización

### Estados de Vuelo

```
PROGRAMADO    - Vuelo programado, aún no iniciado
EMBARCADO     - Pasajeros embarcando
EN_VUELO      - Vuelo en movimiento
ATERRIZADO    - Vuelo ha aterrizado
CANCELADO     - Vuelo cancelado
```

### Estados de Avión

```
DISPONIBLE    - Avión listo para volar
EN_VUELO      - Avión en el aire
MANTENIMIENTO - Avión en mantenimiento
```

### Roles de Usuario

```
ADMIN         - Acceso total (crear/editar/eliminar)
OPERADOR      - Acceso limitado (leer, asignar tripulación)
```

---

## 🔑 Credenciales de Prueba

### Usuario Administrador

```
Email:    admin@example.com
Password: password123
Rol:      ADMIN
```

### Usuario Operador

```
Email:    operador@example.com
Password: password123
Rol:      OPERADOR
```

### Crear Nuevos Usuarios

Solo administradores pueden crear usuarios:

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Authorization: Bearer {token_admin}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Nuevo",
    "email": "nuevo@example.com",
    "password": "SecurePassword123",
    "role": "OPERADOR"
  }'
```

---

## 📝 Ejemplos de Uso Completo

### Flujo: Crear Vuelo y Asignar Tripulación

```bash
# 1. Login como admin
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  | jq -r '.access_token')

# 2. Crear avión
AVION=$(curl -s -X POST http://localhost:3000/aviones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"modelo":"Boeing 747","capacidad":400}' \
  | jq -r '.id')

# 3. Crear tripulante
TRIPULANTE=$(curl -s -X POST http://localhost:3000/tripulantes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Pérez","rol":"Piloto"}' \
  | jq -r '.id')

# 4. Crear vuelo
VUELO=$(curl -s -X POST http://localhost:3000/vuelos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"origen":"Madrid","destino":"Barcelona","estado":"PROGRAMADO"}' \
  | jq -r '.id')

# 5. Asignar avión al vuelo
curl -X PATCH http://localhost:3000/vuelos/$VUELO/avion/$AVION \
  -H "Authorization: Bearer $TOKEN"

# 6. Asignar tripulante al vuelo
curl -X POST http://localhost:3000/vuelos/$VUELO/tripulantes/$TRIPULANTE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 7. Cambiar estado del vuelo
curl -X PATCH http://localhost:3000/vuelos/$VUELO/estado \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"EN_VUELO"}'

# 8. Obtener detalles del vuelo
curl -X GET http://localhost:3000/vuelos/$VUELO \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📂 Estructura del Proyecto

```
backend/
├── prisma/                    # Configuración Prisma + schema
├── src/
│   ├── auth/                 # Autenticación (JWT, Passport)
│   ├── vuelos/               # CRUD de vuelos + filtrado
│   ├── aviones/              # CRUD de aviones
│   ├── tripulantes/          # CRUD de tripulantes
│   ├── usuarios/             # Gestión de usuarios
│   ├── vuelos-tripulantes/   # Asignación de tripulación
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Punto de entrada
├── test/
│   ├── app.e2e-spec.ts       # Tests E2E
│   └── jest-e2e.json         # Configuración Jest E2E
├── .env                       # Variables de entorno
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

---

## 🐛 Troubleshooting

### Error: `MongooseError: Cannot connect to MongoDB`

```bash
# Verificar que MongoDB está ejecutándose
# Local
mongod

# O con Docker
docker run -d -p 27017:27017 mongo:latest
```

### Error: `Cannot find module 'generated/prisma'`

```bash
# Regenerar cliente Prisma
npx prisma generate
```

### Tests fallan con `EADDRINUSE`

```bash
# Puerto 3000 ya está en uso, cambiar en main.ts o terminar proceso
lsof -i :3000
kill -9 <PID>
```

---

## 📌 Cambios Recientes

### Versión 2.0 (17 de Diciembre 2025)

✨ **Mejoras Principales:**

- ✅ Endpoint de vuelos corregido (GET /vuelos)
- ✅ Controlador de vuelos-tripulantes implementado
- ✅ Service de usuarios completado con Prisma
- ✅ Protección de roles en todos los endpoints
- ✅ Unit test de filtrado de vuelos
- ✅ E2E test completo con casos de uso
- ✅ Soft delete universal (vuelos, aviones, tripulantes)
- ✅ Validaciones mejoradas en DTOs
- ✅ Documentación exhaustiva

Para más detalles, ver [CAMBIOS_APLICADOS.md](CAMBIOS_APLICADOS.md)

---

## 📧 Contacto y Soporte

Para reportar bugs o sugerencias:

1. Verificar [CAMBIOS_APLICADOS.md](CAMBIOS_APLICADOS.md)
2. Revisar logs: `npm run start:dev`
3. Ejecutar tests: `npm run test:e2e`

---

## 📄 Licencia

Este proyecto es de uso educativo y desarrollo interno.

---

**Última actualización:** 17 de Diciembre de 2025
