# Taller de IA -- Repositorio base (Node.js + Express)

Plantilla reutilizable para iniciar proyectos con Node.js, Express y MongoDB. Incluye infraestructura común, sin módulos ni lógica de negocio.

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

## Estructura

```text
.
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── rateLimit.middleware.js
│   ├── models/
│   └── routes/
│       └── health.routes.js
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
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

Para iniciar temporalmente sin MongoDB (por ejemplo, para probar rutas que no acceden a la base de datos), establece `SKIP_DB=true`. Su valor predeterminado es `false`, por lo que normalmente se requiere una conexión exitosa a MongoDB. Las rutas que dependan de la base de datos no funcionarán mientras se omita la conexión.

## Ejecución

En desarrollo:

```sh
npm run dev
```

En modo normal:

```sh
npm start
```

Por defecto, el servidor empieza a escuchar únicamente después de conectarse correctamente a MongoDB. Si la conexión falla, informa el error y termina con un estado distinto de cero. Con `SKIP_DB=true`, omite la conexión e inicia el servidor sin MongoDB.

## Comprobación de salud

Con el servidor en ejecución, consulta:

```text
GET http://localhost:3000/api/health/
```

La respuesta esperada es HTTP 200:

```json
{"status":"ok"}
```

MongoDB debe estar disponible para que arranque el servidor, salvo que se configure `SKIP_DB=true`.
