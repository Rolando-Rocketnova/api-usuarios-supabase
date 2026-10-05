# 👤 API de usuarios con Node.js + Supabase

API REST para gestionar usuarios con **autenticación JWT**, contraseñas cifradas con **bcrypt** y base de datos **PostgreSQL en Supabase**.

🔗 **Demo en vivo:** `https://TU-APP.onrender.com`

---

## 🧱 Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y rutas |
| Supabase (PostgreSQL) | Base de datos |
| bcryptjs | Cifrado de contraseñas |
| jsonwebtoken | Sesión con tokens JWT |
| dotenv | Variables de entorno |
| cors | Permitir peticiones desde un frontend |
| Postman | Pruebas |
| GitHub + Render | Código y despliegue |

## 🔄 Flujo

```text
Postman / Frontend
      ↓
   Node.js
      ↓
   Express
      ↓
 Middlewares  (logger → verificarToken → validarId → autorizar → validaciones)
      ↓
 Controllers
      ↓
   Supabase
      ↓
  PostgreSQL
```

## 📁 Estructura

```text
api-usuarios-supabase/
├── server.js                 # Arranca el servidor
├── app.js                    # Express: middlewares, rutas y errores
├── config/
│   ├── env.js                # Lee y comprueba las variables de entorno
│   └── supabase.js           # Cliente de Supabase
├── routes/
│   ├── auth.js               # /auth/register, /auth/login, /auth/perfil
│   └── usuarios.js           # CRUD /usuarios (protegido)
├── controllers/
│   ├── authController.js
│   └── usuariosController.js
├── middlewares/
│   ├── logger.js             # Registra cada petición
│   ├── verificarToken.js     # Comprueba el JWT
│   ├── autorizar.js          # soloAdmin / propioOAdmin
│   ├── validarId.js          # :id numérico
│   ├── validaciones.js       # Valida el body
│   └── errorHandler.js       # 404 y manejo central de errores
├── utils/                    # AppError, asyncHandler, token, errores de Supabase
├── database/schema.sql       # Script para crear la tabla
├── postman/                  # Colección de Postman
└── .env.example              # Plantilla de variables de entorno
```

---

## ⚙️ Instalación

### 1. Base de datos (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor** → pega el contenido de `database/schema.sql` → **Run**.
3. En **Project Settings → API Keys** copia la **Project URL** y la clave **secret** (o `service_role`).

### 2. Proyecto

```bash
git clone https://github.com/TU-USUARIO/api-usuarios-supabase.git
cd api-usuarios-supabase
npm install
```

Copia `.env.example` como `.env` y rellénalo:

```env
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=tu-clave-secret
JWT_SECRET=un-texto-largo-y-aleatorio
JWT_EXPIRES_IN=1h
```

> Para generar un `JWT_SECRET` seguro:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

```bash
npm run dev
```

---

## 📌 Endpoints

🔒 = requiere `Authorization: Bearer <token>`

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Crea una cuenta y devuelve un token |
| POST | `/auth/login` | Inicia sesión y devuelve un token |
| GET | `/auth/perfil` 🔒 | Datos del usuario logueado |

### Usuarios

| Método | Ruta | Quién puede |
|---|---|---|
| GET | `/usuarios` 🔒 | Cualquier usuario logueado |
| GET | `/usuarios/:id` 🔒 | Cualquier usuario logueado |
| POST | `/usuarios` 🔒 | Solo **admin** |
| PUT | `/usuarios/:id` 🔒 | El **propio usuario** o **admin** (solo admin cambia el `rol`) |
| DELETE | `/usuarios/:id` 🔒 | El **propio usuario** o **admin** |

**Búsqueda y paginación:** `GET /usuarios?q=ana&rol=usuario&pagina=1&limite=10`

```json
{
  "total": 1,
  "pagina": 1,
  "limite": 10,
  "totalPaginas": 1,
  "datos": [
    { "id": 2, "nombre": "Ana López", "email": "ana@mail.com", "rol": "usuario", "creado_en": "…", "actualizado_en": null }
  ]
}
```

### Validaciones

| Campo | Regla |
|---|---|
| `nombre` | 2–100 caracteres |
| `email` | Formato válido y único |
| `password` | Mínimo 8 caracteres, con letras y números |
| `rol` | `usuario` o `admin` (solo lo asigna un admin) |

### Crear un administrador

Los usuarios se registran con rol `usuario`. Para convertir uno en admin, en Supabase → **SQL Editor**:

```sql
update usuarios set rol = 'admin' where email = 'tu-email@mail.com';
```

Después vuelve a hacer login para obtener un token con el rol nuevo.

---

## ❗ Errores

Formato común:

```json
{ "error": "Datos no válidos", "detalles": ["email no tiene un formato válido"] }
```

| Código | Cuándo |
|---|---|
| 400 | Datos o parámetros no válidos |
| 401 | Sin token, token inválido/caducado o login incorrecto |
| 403 | Sin permiso (no eres admin o no es tu usuario) |
| 404 | Usuario o ruta inexistente |
| 409 | Email ya registrado |
| 500 | Error interno |

## 🔐 Seguridad

- Las contraseñas se guardan **cifradas con bcrypt**, nunca en texto plano, y **nunca** se devuelven en las respuestas.
- Las claves van en **variables de entorno**; `.env` está en `.gitignore`.
- La tabla tiene **Row Level Security** activado: la clave pública de Supabase no puede leerla; solo la API con la clave secreta.

---

## 🧪 Postman

1. **Import** → `postman/API-Usuarios-Supabase.postman_collection.json`.
2. Ejecuta **Auth → Register** o **Login**: el token se guarda solo en la variable `{{token}}`.
3. El resto de peticiones ya lo envían automáticamente.
4. Para probar en producción, cambia la variable `baseUrl` a la URL de Render.

## ☁️ Deploy en Render

1. **New → Web Service** → conecta el repositorio.
2. Build Command: `npm install` · Start Command: `npm start` · Instance: Free.
3. En **Environment** añade: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
4. **Deploy**.

Los datos viven en Supabase, así que **no se pierden** al reiniciar o redesplegar.

---

## 👤 Autor

**Rolando Díaz** — [GitHub](https://github.com/TU-USUARIO)
