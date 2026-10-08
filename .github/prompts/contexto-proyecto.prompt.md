---
name: "Trabajar en Taller IA Node"
description: "Da contexto sobre la estructura y convenciones de este repositorio antes de implementar una tarea."
argument-hint: "Describe el cambio o la tarea que debe realizar el agente."
agent: "agent"
---

# Contexto del proyecto

Trabajas en **Taller de IA -- Repositorio base (Node.js + Express)**, una plantilla backend con Node.js, Express y módulos ES. Lee y sigue las reglas de [AGENTS.md](../../AGENTS.md) y revisa el código existente antes de modificarlo.

## Estructura actual

```text
.
├── .github/
│   └── prompts/
│       └── contexto-proyecto.prompt.md
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── .gitkeep
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── rateLimit.middleware.js
│   ├── models/
│   │   └── .gitkeep
│   └── routes/
│       └── health.routes.js
├── .env.example
├── .gitignore
├── AGENTS.md
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

El archivo `.env` puede existir localmente, pero está ignorado por Git: no lo leas, expongas, copies ni modifiques. Usa `.env.example` para conocer las variables de configuración.

## Arquitectura y comportamiento

- `app.js` carga `dotenv`, configura Helmet, CORS, Morgan, rate limiting global y JSON, y monta las rutas bajo `/api`.
- El arranque se ejecuta con `startServer()`. Por defecto espera una conexión exitosa a MongoDB antes de escuchar; si falla, informa el error y finaliza con estado distinto de cero.
- `SKIP_DB=true` permite iniciar sin conexión a MongoDB para desarrollar o probar rutas que no dependan de la base de datos. Si no se establece, la conexión se intenta normalmente.
- `src/config/db.js` contiene la conexión Mongoose.
- `src/routes/health.routes.js` implementa `GET /api/health/`, que responde HTTP 200 con `{"status":"ok"}`.
- `src/middlewares/auth.middleware.js` verifica tokens JWT Bearer y guarda el payload en `req.usuario`; tokens ausentes, inválidos o expirados reciben HTTP 401.
- `src/middlewares/rateLimit.middleware.js` exporta el limitador global (100 solicitudes por IP cada 15 minutos) y el limitador de autenticación (5 solicitudes por IP cada hora). El de autenticación está disponible, pero aún no se conecta a rutas.
- `src/controllers/` y `src/models/` están vacíos deliberadamente, salvo sus archivos `.gitkeep`. No agregues lógica de negocio, módulos de autenticación ni modelos a menos que la tarea lo pida.

## Stack y comandos

El proyecto usa Express, Mongoose, dotenv, Helmet, CORS, Morgan, express-rate-limit, jsonwebtoken, bcryptjs, express-validator y `@google/generative-ai`; Nodemon es dependencia de desarrollo. Conserva `"type": "module"`.

- Instalar dependencias: `npm install`
- Desarrollo: `npm run dev`
- Inicio normal: `npm start`
- Probar sin MongoDB: establecer `SKIP_DB=true` antes de ejecutar `npm run dev` o `npm start`.
- Endpoint de salud: `GET http://localhost:3000/api/health/`

## Instrucciones para la tarea

Implementa la solicitud siguiente en este repositorio:

${input:request:Describe el cambio solicitado}

Antes de editar, comprueba los archivos y patrones relacionados. Haz cambios precisos, conserva el comportamiento existente salvo que la tarea indique lo contrario, sincroniza `package-lock.json` si cambias dependencias y actualiza `README.md` si cambia el uso o la configuración. Valida los archivos JavaScript modificados con `node --check` y ejecuta una prueba pertinente cuando sea posible. No afirmes haber probado algo que no ejecutaste. Resume al final los archivos cambiados y las validaciones realizadas.
