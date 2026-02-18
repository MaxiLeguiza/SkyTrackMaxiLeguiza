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

## Notas rápidas
- Los E2E usan `test/jest-e2e.json` — asegúrate de que `moduleNameMapper` esté correcto si ves errores de import.
- Las rutas protegidas requieren JWT; el script `prisma/create-admin.ts` crea un admin por defecto (`admin@example.com` / `password123`).
- Si algún test falla, revisa los logs en consola y ejecuta el test afectado en modo `-i` para depurar.

---

Si quieres, agrego un script npm en `backend/package.json` para ejecutar unit+e2e con un único comando. ¿Lo agrego?