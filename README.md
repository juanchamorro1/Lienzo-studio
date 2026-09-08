# Estudio Lienzo

Sitio de Estudio Lienzo con backend propio: login de usuarios, comentarios,
y un panel de administración (solo para `admin@console.com`) para editar
los proyectos del portafolio y los textos del sitio (título, WhatsApp,
email, etc.).

## Arquitectura

```
backend/    API en Node/Express + PostgreSQL (Prisma) — se despliega en Render
frontend/   Sitio en Next.js — se despliega en Vercel
```

El frontend le habla al backend por HTTP (`NEXT_PUBLIC_API_URL`), con
cookies de sesión (`credentials: include`), así que ambos deploys deben
conocerse mutuamente por URL (ver más abajo).

- **Base de datos**: PostgreSQL. `render.yaml` crea una automáticamente en
  Render (nivel gratuito).
- **Login**: cualquier visitante puede registrarse (nombre, email,
  contraseña). Los comentarios requieren estar logueado.
- **Admin**: la cuenta `admin@console.com` (contraseña `admin123` por
  defecto, ver "Cambiar la contraseña de admin" abajo) es la única que ve
  el link **Admin** en el header y puede entrar a `/admin` para:
  - Editar, agregar y eliminar proyectos del portafolio.
  - Editar textos del sitio: título y subtítulo del hero, párrafos de "El
    estudio", título/subtítulo de contacto, **número de WhatsApp y email**.
  - Moderar (eliminar) comentarios de cualquier usuario.

## 1. Desplegar el backend en Render

1. Subí este proyecto a un repositorio de GitHub (ver sección al final).
2. En [Render](https://dashboard.render.com), **New > Blueprint**, elegí
   el repo. Render va a leer `render.yaml` (en la raíz) y va a proponer:
   - Un servicio web `estudio-lienzo-backend` (carpeta `backend/`).
   - Una base de datos Postgres `estudio-lienzo-db`.
3. Antes de confirmar, Render te va a pedir completar las variables
   marcadas `sync: false`:
   - `CLIENT_ORIGIN`: la URL de tu frontend en Vercel (la sabrás después
     del paso 2 — podés dejarla en blanco y completarla después desde
     **Environment** en el dashboard de Render, sin necesidad de
     redeploy manual).
   - `ADMIN_PASSWORD`: la contraseña de `admin@console.com`. Poné algo
     mejor que `admin123` para producción.
   - `DATABASE_URL` y `JWT_SECRET` se completan solos (Render los genera).
4. Deploy. Cuando termine, Render te da una URL tipo
   `https://estudio-lienzo-backend.onrender.com` — la vas a necesitar en
   el paso 2.
5. Corré el seed una sola vez (crea el usuario admin y los datos
   iniciales) desde la pestaña **Shell** del servicio en Render:
   ```bash
   npm run seed
   ```

## 2. Desplegar el frontend en Vercel

1. En [Vercel](https://vercel.com/new), importá el mismo repo.
2. **Root Directory**: elegí `frontend` (Vercel lo detecta como Next.js
   automáticamente).
3. Variable de entorno:
   - `NEXT_PUBLIC_API_URL` = la URL del backend de Render del paso 1
     (sin `/` al final), ej: `https://estudio-lienzo-backend.onrender.com`
4. Deploy. Vercel te da una URL tipo `https://tu-sitio.vercel.app`.
5. Volvé a Render y completá `CLIENT_ORIGIN` con esa URL exacta (Environment
   → editar → guardar; el servicio se reinicia solo). Esto es necesario
   para que las cookies de sesión funcionen entre los dos dominios.

Con eso el sitio ya queda funcionando en las dos URLs.

## Cambiar la contraseña de admin

La contraseña se fija la primera vez que corrés `npm run seed` (toma el
valor de la variable de entorno `ADMIN_PASSWORD` de ese momento). Para
cambiarla después:
- Cambiá `ADMIN_PASSWORD` en Render (Environment) y volvé a correr
  `npm run seed` desde la Shell del servicio — actualiza la contraseña
  del usuario admin existente sin tocar el resto de los datos.

## Desarrollo local

Necesitás Node 18+ y una base Postgres (podés levantar una con Docker:
`docker run -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lienzo -p 5432:5432 postgres:16-alpine`).

```bash
# Backend
cd backend
cp .env.example .env        # completá DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma migrate dev
npm run seed
npm run dev                  # http://localhost:4000

# Frontend (en otra terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                  # http://localhost:3000
```

## Subir el proyecto a GitHub

Ya está inicializado como repositorio git local con un commit inicial.
Para subirlo:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

## Estructura de la base de datos

- **User**: cuentas de usuario (nombre, email, contraseña con hash,
  rol `user`/`admin`).
- **Project**: los proyectos del portafolio.
- **SiteContent**: pares clave/valor con los textos editables del sitio
  (incluye `whatsapp_number` y `contact_email`).
- **Comment**: comentarios, cada uno ligado a un usuario.

## Notas de seguridad

- Las contraseñas se guardan con hash `bcrypt`, nunca en texto plano.
- La sesión viaja en una cookie `httpOnly` firmada (JWT) — no es
  accesible desde JavaScript del navegador.
- Las rutas de administración están protegidas en el backend (no solo en
  la interfaz): aunque alguien fuerce la navegación a `/admin`, ninguna
  escritura se acepta si el usuario no tiene rol `admin`.
- **Cambiá `ADMIN_PASSWORD` antes de anunciar el sitio públicamente** —
  `admin123` es fácil de adivinar.
