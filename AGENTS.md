# Reglas del proyecto

- Usa módulos ES (`import`/`export`) y conserva `"type": "module"`.
- Mantén la separación existente entre configuración, middlewares y rutas.
- No agregues secretos ni credenciales al repositorio; usa `.env` local y actualiza `.env.example` si aparecen nuevas variables.
- Si cambias dependencias, sincroniza `package-lock.json`.
- Actualiza el `README.md` cuando cambien la configuración o los comandos de uso.
- Antes de dar por terminado un cambio, valida la sintaxis con `node --check` y, si aplica, prueba el arranque. Usa `SKIP_DB=true` para probar sin MongoDB.
