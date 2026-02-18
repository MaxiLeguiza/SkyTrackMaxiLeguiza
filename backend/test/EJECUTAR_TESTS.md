# Ejecutar tests (Unitarios y E2E)

Este archivo contiene los comandos más útiles para ejecutar los tests del backend (unitarios y end-to-end).

---

## Requisitos previos
- Tener Node.js y dependencias instaladas: `cd backend && npm install`.
- MongoDB accesible y `DATABASE_URL` configurado en `.env` (si aplica).
- (Recomendado) Crear admin para E2E: `npx ts-node prisma/create-admin.ts`.

---

## Comandos rápidos
- Ejecutar todos los unit tests:

```bash
cd backend && npm test
```

- Ejecutar todos los E2E tests:

```bash
cd backend && npm run test:e2e
```

- Ejecutar unit tests en modo watch (desarrollo):

```bash
cd backend && npm run test:watch
```

- Generar informe de cobertura (unit tests):

```bash
cd backend && npm run test:cov
```

- Levantar servidor en modo dev (para pruebas manuales):

```bash
cd backend && npm run start:dev
```

---

## Ejecutar pruebas específicas
- Archivo unit test específico:

```bash
cd backend && npx jest src/vuelos/vuelos.service.spec.ts -i
```

- Test unit por nombre (match parcial):

```bash
cd backend && npx jest -t "Debe retornar todos los vuelos no eliminados"
```

- Archivo E2E específico:

```bash
cd backend && npx jest test/app.e2e-spec.ts --config ./test/jest-e2e.json -i
```

- Ejecutar unit + e2e secuencialmente:

```bash
cd backend && npm test && npm run test:e2e
```

---

