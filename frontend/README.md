# SkyTrack Airlines - Sistema de Gestión de Vuelos

Sistema completo de gestión para aerolínea ficticia SkyTrack Airlines, desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características Principales

### ✈️ Gestión de Vuelos (CRUD Completo)
- Crear, editar y eliminar vuelos (baja lógica)
- Filtros avanzados por origen, destino y estado
- Estados: programado, embarcando, en vuelo, aterrizado, cancelado
- Asignación de aviones y tripulación
- Vista de detalles completa

### 🛩️ Gestión de Aviones (CRUD)
- Crear y editar aviones
- Estados: disponible, en vuelo, en mantenimiento
- Asignación automática a vuelos
- Visualización de capacidad y detalles técnicos

### 👥 Gestión de Tripulación (CRUD)
- Crear y editar miembros de tripulación
- Asignación y remoción de tripulantes en vuelos
- Control de disponibilidad automático
- Roles: Capitán, Copiloto, Azafata/Azafato

### 📊 Panel de Control
- Dashboard tipo "panel de aeropuerto"
- Estadísticas en tiempo real
- Vuelos en curso y próximos despegues
- Cambio de estado de vuelos con botones interactivos
- Actividad reciente

### 👤 Sistema de Roles
- **Admin**: Acceso completo, incluye eliminación de vuelos
- **Operador**: Gestión de vuelos, aviones y tripulación

## 📋 Casos de Uso Implementados

### ✅ Caso 1: Listado de Vuelos + Filtros
- Filtrado por origen, destino y estado
- Búsqueda por número de vuelo
- Visualización clara de todos los datos

### ✅ Caso 2: Baja Lógica de Vuelos
- Solo disponible para rol admin
- Soft delete sin eliminación física
- Los vuelos eliminados no aparecen en filtros

### ✅ Caso 3: Crear y Editar Vuelos
- Formulario completo con validaciones
- Asignación de avión desde el formulario
- Asignación de tripulación múltiple

### ✅ Caso 4: Gestión de Aviones
- CRUD completo de aviones
- Estados: disponible, en vuelo, en mantenimiento
- Asignación directa desde formulario de vuelo

### ✅ Caso 5: Gestión de Tripulación
- Asignación y remoción de tripulantes
- Control automático de disponibilidad
- Vista de vuelos asignados

### ✅ Caso 6: Panel de Estado / Dashboard
- Vista tipo panel de aeropuerto
- Vuelos en curso destacados
- Próximo vuelo a despegar
- Botones para iniciar vuelo y aterrizar
- Estadísticas en tiempo real

## 🛠️ Tecnologías Utilizadas

- **React 18.3.1** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos modernos
- **Radix UI** - Componentes de UI accesibles
- **Lucide React** - Iconos
- **Context API** - Gestión de estado global
- **LocalStorage** - Persistencia de datos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🔐 Credenciales de Acceso

### Usuario Admin
- **Usuario**: `admin`
- **Contraseña**: `password`
- **Permisos**: Acceso completo, incluyendo eliminación de vuelos

### Usuario Operador
- **Usuario**: `operador`
- **Contraseña**: `password`
- **Permisos**: Gestión de vuelos, aviones y tripulación (sin eliminación)

## 📱 Características de la Aplicación

### Interfaz Responsive
- Diseño adaptable para desktop, tablet y móvil
- Menú lateral colapsable en móviles
- Tarjetas adaptativas según el tamaño de pantalla

### Persistencia de Datos
- Todos los datos se guardan en localStorage
- Los cambios persisten entre sesiones
- Datos iniciales mock para testing

### Validaciones
- Formularios con validación de campos requeridos
- Control de disponibilidad de tripulación
- Verificación de roles para acciones sensibles

### Experiencia de Usuario
- Feedback visual con badges de estado
- Confirmaciones para acciones destructivas
- Filtros en tiempo real
- Búsqueda instantánea

## 🎨 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Componentes de UI reutilizables
│   │   ├── Login.tsx        # Pantalla de login
│   │   ├── Layout.tsx       # Layout principal con sidebar
│   │   ├── Dashboard.tsx    # Panel de control
│   │   ├── FlightsView.tsx  # Vista de vuelos
│   │   ├── FlightForm.tsx   # Formulario de vuelos
│   │   ├── PlanesView.tsx   # Vista de aviones
│   │   └── CrewView.tsx     # Vista de tripulación
│   ├── context/
│   │   └── AppContext.tsx   # Estado global de la aplicación
│   ├── types/
│   │   └── index.ts         # Tipos TypeScript
│   └── App.tsx              # Componente raíz
└── styles/                  # Archivos de estilo

```

## 🔄 Flujo de Datos

1. **Login**: Usuario ingresa credenciales
2. **Dashboard**: Vista general del sistema
3. **Gestión**: Usuario navega por las diferentes secciones
4. **CRUD**: Crear, editar o eliminar registros
5. **Persistencia**: Cambios se guardan automáticamente en localStorage

## 📊 Datos Mock Incluidos

La aplicación incluye datos de prueba:
- 6 vuelos de ejemplo con diferentes estados
- 5 aviones con diferentes capacidades
- 10 miembros de tripulación con diferentes roles

## 🧪 Testing (Pendiente de Implementación Backend)

El proyecto está preparado para pruebas:
- **Unit Tests**: Lógica de filtrado de vuelos
- **E2E Tests**: Flujo completo de usuario

## 🚀 Características Futuras Sugeridas

### Con Backend (NestJS + Prisma/TypeORM)
- API REST completa
- Base de datos persistente
- Autenticación JWT
- Tests unitarios y E2E
- Documentación de endpoints

### Mejoras de Frontend
- Notificaciones push
- Exportación de reportes
- Gráficos avanzados
- Modo oscuro
- Multi-idioma

## 📝 Notas Importantes

- **Persistencia**: Los datos se guardan en localStorage del navegador
- **Roles**: El sistema valida permisos en el frontend
- **Estados**: Los cambios de estado de vuelos son simulados
- **Tripulación**: La disponibilidad se gestiona automáticamente

## 🤝 Contribuir

Este es un proyecto educativo. Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso educativo y está disponible bajo licencia MIT.

## 👨‍💻 Autor

Desarrollado para demostración de capacidades de desarrollo frontend con React, TypeScript y Tailwind CSS.

---

**SkyTrack Airlines** - Sistema de Gestión de Vuelos © 2026
