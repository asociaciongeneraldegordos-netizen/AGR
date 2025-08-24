# AGR - Deploy con Netlify Functions + Neon

## 1) Estructura relevante
- `AGR_v5/AGR_v5/AGR_v5/AGR/AGR-Frontend/`  → sitio estático (publish)
- `netlify/functions/` → API serverless
- `netlify.toml` → configuración de Netlify (publish + redirects + functions)
- `package.json` → dependencias para las functions (`pg`, `bcryptjs`)

## 2) Variables de entorno en Netlify
En tu sitio de Netlify, ve a **Site settings → Environment variables** y agrega:

- `DATABASE_URL`  → la cadena de conexión de Neon (por ejemplo: `postgres://user:pass@host/db?sslmode=require`)

## 3) Deploy
- Selecciona este repo/carpeta en Netlify.
- Asegúrate que **Publish directory** sea: `AGR_v5/AGR_v5/AGR_v5/AGR/AGR-Frontend`
- No necesitas build command (sitio estático). Netlify detectará `netlify.toml` y construirá las functions.

## 4) Endpoints
- `POST /register` → crea usuario en la tabla `"Usuarios"` (campos: `Nombre`, `Correo`, `Peso`, `PasswordHash`).
  - Acepta `application/x-www-form-urlencoded` (desde el `<form>`) o `application/json` (desde JS).
  - Si el `Accept` no pide JSON, devuelve **303 redirect** a `/Login/register.html?ok=1`.
- `GET /members` → devuelve `[{ "Nombre": "...", "Peso": 123 }, ... ]` para el leaderboard.

## 5) Seguridad
- Las credenciales están en el backend (functions), nunca en el frontend.
- Passwords se guardan con **bcrypt** (`PasswordHash`).

## 6) Esquema de BD (Neon / PostgreSQL)
Usa este SQL (o el `script_postgres.sql`):

```sql
CREATE TABLE IF NOT EXISTS "Usuarios" (
  "Id" SERIAL PRIMARY KEY,
  "Nombre" VARCHAR(100) NOT NULL,
  "Correo" VARCHAR(150) UNIQUE NOT NULL,
  "Peso" INT NOT NULL,
  "PasswordHash" VARCHAR(255) NOT NULL
);
```

¡Listo!
