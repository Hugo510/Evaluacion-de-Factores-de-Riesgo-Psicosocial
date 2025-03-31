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
- MySQL (v8 o superior)
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
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_bd"
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
   Este comando utiliza el script de entrada ubicado en `prisma/seeds/index.ts`, el cual ejecuta en orden los scripts para sembrar usuarios, cuestionarios y respuestas. Para ejecutar únicamente ciertos seeds, puedes usar:
   ```bash
   npm run seed -- --only users,questionnaires
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

## Datos de prueba (Seed)

Al ejecutar `npm run seed`, se cargarán los siguientes datos de prueba:

### Usuarios

| Nombre           | Email              | Contraseña  | Rol    | Departamento     |
| ---------------- | ------------------ | ----------- | ------ | ---------------- |
| Administrador    | admin@example.com  | admin123    | ADMIN  | Dirección        |
| Juan Pérez       | juan@example.com   | password123 | WORKER | Recursos Humanos |
| María Gómez      | maria@example.com  | password123 | WORKER | Operaciones      |
| Carlos Rodríguez | carlos@example.com | password123 | WORKER | Ventas           |
| Ana López        | ana@example.com    | password123 | WORKER | Finanzas         |

También se incluyen cuestionarios de ejemplo basados en la NOM-035 y algunas respuestas de muestra para demostrar la funcionalidad de análisis de riesgo.

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
- `GET /auth/me` - Obtener información del usuario autenticado actualmente

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

## Contribución

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. **Fork del repositorio**

   - Realiza un fork de este repositorio a tu cuenta personal.

2. **Clona tu fork**

   ```bash
   git clone https://github.com/tu-usuario/nombre-repositorio.git
   cd nombre-repositorio
   ```

3. **Crea una rama para tu funcionalidad**

   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```

4. **Estándares de código**

   - Sigue los estándares de código establecidos en el proyecto.
   - Utiliza TypeScript con tipos estrictos.
   - Documenta las funciones y clases con JSDoc.
   - Asegúrate de que tu código pase el linter y los tests.

5. **Realiza tus cambios y pruébelos localmente**

   ```bash
   npm run dev
   npm test
   ```

6. **Envía tus cambios**

   ```bash
   git add .
   git commit -m "descripción detallada de tus cambios"
   git push origin feature/nombre-funcionalidad
   ```

7. **Crea un Pull Request**

   - Abre un Pull Request desde tu rama a la rama principal del repositorio original.
   - Describe detalladamente los cambios que has realizado.
   - Menciona cualquier problema relacionado usando `#numero-issue`.

8. **Revisión de código**

   - Los mantenedores revisarán tu código y podrán sugerir cambios.
   - Asegúrate de responder a los comentarios y realizar las modificaciones necesarias.

9. **Reportar bugs**
   - Si encuentras un bug, crea un issue en el repositorio con los siguientes detalles:
     - Descripción del bug
     - Pasos para reproducirlo
     - Comportamiento esperado vs. comportamiento actual
     - Capturas de pantalla si aplica
     - Entorno (sistema operativo, navegador, versiones, etc.)

### Pautas generales

- Escribe mensajes de commit claros y descriptivos.
- Mantén los Pull Requests enfocados en una sola funcionalidad.
- Actualiza la documentación cuando sea necesario.
- Respeta el código de conducta del proyecto.

## Licencia

[MIT](LICENSE)
