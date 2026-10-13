# Taller de IA -- API de Gestión Académica

Microservicio de gestión académica para administrar materias, alumnos y matrículas. Incluye validaciones de negocio, manejo de errores unificado y soporte para arrancar en modo de prueba sin MongoDB.

## Stack y dependencias principales

- Node.js y Express para el servidor HTTP.
- Mongoose para la conexión con MongoDB.
- dotenv para cargar variables de entorno.
- helmet, cors y morgan para seguridad HTTP, control de origenes y logs.
- express-rate-limit para limitar solicitudes.
- jsonwebtoken y bcryptjs para dejar disponible el stack de autenticación.
- express-validator para validaciones futuras.
- @google/generative-ai para futuras integraciones de IA.
- nodemon para desarrollo.

## Endpoints principales

### Materias

- `POST /api/materias` crea una nueva materia.
- `GET /api/materias` lista materias; acepta `?estado=ACTIVA`.

### Alumnos

- `POST /api/alumnos` registra un alumno.
- `GET /api/alumnos/:id` devuelve el perfil del alumno con inscripciones resueltas.
- `POST /api/alumnos/:id/matricular` permite inscribir un alumno en una materia.

### Docentes

- `POST /api/docentes` registra un docente.
- `GET /api/docentes` lista docentes activos.

## Reglas de negocio

- No permite duplicar un alumno en la misma materia.
- No permite inscribir en materias con estado `INACTIVA`.
- Todas las respuestas de error usan el formato uniforme:

```json
{ "error": true, "mensaje": "Descripción clara del motivo del fallo" }
```

## Requisitos previos

- Node.js y npm.
- MongoDB local o una URI de MongoDB accesible.

## Instalación y configuración

Instala las dependencias:

```sh
npm install
```

Copia `.env.example` a `.env` y configura `MONGO_URI` y `JWT_SECRET` con los valores de tu entorno. No compartas ni publiques el archivo `.env`.

Para iniciar temporalmente sin MongoDB, establece `SKIP_DB=true`. El servidor arrancará en modo de memoria para probar la API sin depender de la base de datos.

## Ejecución

En desarrollo:

```sh
npm run dev
```

En modo normal:

```sh
npm start
```

Con `SKIP_DB=true`, el servicio omite la conexión a MongoDB y usa almacenamiento en memoria para poder probar las rutas de la API.

## Comprobación de salud

Con el servidor en ejecución, consulta:

```text
GET http://localhost:3000/api/health/
```

La respuesta esperada es HTTP 200:

```json
{"status":"ok"}
```
