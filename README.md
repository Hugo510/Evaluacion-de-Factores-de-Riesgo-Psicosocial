# API para Evaluación de Riesgos Psicosociales (NOM-035)

## Descripción

Este proyecto implementa una API RESTful para la identificación, análisis y prevención de los factores de riesgo psicosocial en el entorno laboral, conforme a los requerimientos de la Norma Oficial Mexicana NOM-035-STPS-2018.

## Características

- Autenticación mediante JWT
- Gestión de cuestionarios según la NOM-035
- Recolección de respuestas de los trabajadores
- Análisis y generación de reportes personales y por departamento
- Documentación con Swagger
- Validación de entrada con Zod
- Registro de actividad (logging)
- Límite de tasas de solicitud (rate limiting)
- Monitoreo de salud del servicio

## Requisitos previos

- Node.js (v16 o superior)
- PostgreSQL (v13 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto:

   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
   JWT_SECRET="tu_secreto_jwt_muy_seguro"
   PORT=3000
   NODE_ENV=development
   ```

4. Ejecutar migraciones:

   ```bash
   npx prisma migrate dev
   ```

5. Poblar la base de datos con datos iniciales:
   ```bash
   npm run seed
   ```

## Estructura del proyecto

```
/backend
  /logs                   # Logs generados por la aplicación
  /prisma                 # Configuración y migraciones de Prisma
    /migrations           # Migraciones de base de datos
    /seeds                # Scripts para poblar la base de datos
      /data               # Datos estáticos para los seeds
      /scripts            # Scripts de seeding por entidad
  /src
    /config               # Configuración de la aplicación
    /controllers          # Controladores de rutas
    /middleware           # Middleware personalizado
    /routes               # Definición de rutas
    /schemas              # Esquemas de validación (Zod)
    /services             # Lógica de negocio
    /types                # Tipos y interfaces TypeScript
    app.ts                # Configuración de Express
    index.ts              # Punto de entrada de la aplicación
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## API Endpoints

La aplicación proporciona los siguientes endpoints:

### Autenticación

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar nuevo usuario

### Cuestionarios

- `GET /questionnaires` - Obtener todos los cuestionarios
- `GET /questionnaires/:id` - Obtener un cuestionario específico
- `POST /questionnaires` - Crear un nuevo cuestionario (admin)

### Respuestas

- `POST /responses` - Enviar respuestas a un cuestionario

### Reportes

- `GET /reports/user/:userId` - Obtener reporte individual (PDF)
- `GET /reports/department` - Obtener reporte por departamento (admin)

### Otros

- `GET /health` - Verificar estado del servicio
- `GET /api-docs` - Documentación Swagger
- `GET /swagger.json` - Especificación OpenAPI en formato JSON

## Desarrollo

### Scripts disponibles

- `npm run dev` - Ejecuta el servidor en modo desarrollo
- `npm run build` - Compila el código TypeScript
- `npm start` - Inicia el servidor en producción
- `npm run seed` - Pobla la base de datos con datos iniciales
- `npm run seed:users` - Pobla solo los usuarios
- `npm run seed:questionnaires` - Pobla solo los cuestionarios
- `npm run seed:responses` - Pobla solo las respuestas

## Documentación

La documentación de la API está disponible a través de Swagger UI:

```
http://localhost:3000/api-docs
```

## Licencia

[MIT](LICENSE)
