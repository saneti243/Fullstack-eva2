# Tienda67 – Frontend en React

Proyecto de la asignatura **DSY1104 – Desarrollo Fullstack II** (Duoc UC), **Evaluación Parcial 2**.
Migración de la tienda online (HTML, CSS y JavaScript) a **React + Bootstrap**, con **pruebas unitarias en Jasmine y Karma**.

---

## Tabla de contenidos

1. [Tecnologías](#tecnologías)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y ejecución](#instalación-y-ejecución)
4. [Funcionalidades](#funcionalidades)
5. [Roles y permisos](#roles-y-permisos)
6. [Cómo probar la aplicación manualmente](#cómo-probar-la-aplicación-manualmente)
7. [Pruebas unitarias (Jasmine + Karma)](#pruebas-unitarias-jasmine--karma)
8. [Estructura del proyecto](#estructura-del-proyecto)
9. [Persistencia de datos](#persistencia-de-datos)
10. [Solución de problemas](#solución-de-problemas)
11. [Scripts disponibles](#scripts-disponibles)

---

## Tecnologías

| Área | Herramienta |
|---|---|
| Framework | React 18 |
| Rutas | React Router 6 |
| Estilos y responsividad | Bootstrap 5 |
| Pruebas | Jasmine 5 + Karma 6 |
| Utilidades de prueba | React Testing Library |
| Cobertura de código | karma-coverage + babel-plugin-istanbul |
| Empaquetado de pruebas | Webpack 5 + Babel |

---

## Requisitos previos

- **Node.js 18 o superior** (recomendado la versión LTS): <https://nodejs.org>
- **npm** (se instala junto con Node.js)
- **Git**: <https://git-scm.com>
- Un navegador basado en **Chrome** (Google Chrome, Chromium o Brave). Karma lo necesita para ejecutar las pruebas.

Comprueba tu instalación:

```bash
node -v
npm -v
git --version
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd <NOMBRE-DE-LA-CARPETA>
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Iniciar la aplicación en modo desarrollo

```bash
npm start
```

Se abrirá <http://localhost:3000>. Si no se abre sola, escribe esa dirección en el navegador. Para detener el servidor presiona `Ctrl + C`.

### 4. Generar la versión de producción (opcional)

```bash
npm run build
```

El resultado queda en la carpeta `build/`.

---

## Funcionalidades

| Módulo | Descripción |
|---|---|
| **Catálogo** | Listado de productos con filtro por categoría y página de detalle (`/productos/:id`). |
| **Carrito** | Agregar, quitar, cambiar cantidades y vaciar. Total calculado y guardado en el navegador. |
| **Checkout** | Formulario de facturación y pago con formato automático de tarjeta y fecha, y validación de tarjeta vencida. Los datos de la tarjeta **no se guardan**. |
| **Registro** | Validación de nombre, RUN, correo con dominios permitidos, contraseña de 4 a 10 caracteres, región y comuna dependientes, y control de correo duplicado. |
| **Login y sesión** | Inicio y cierre de sesión. La sesión se mantiene al recargar la página. |
| **Panel de productos** | Crear, editar y eliminar productos (con confirmación). Acepta imagen por URL o ruta. |
| **Panel de usuarios** | Crear, editar y eliminar usuarios. Solo para administradores. |
| **Contacto** | Formulario con validaciones. |
| **Blogs** | Listado y detalle de artículos (`/blogs`, `/blogs/:id`). |
| **Nosotros** | Presentación del equipo. |
| **Diseño responsivo** | Grilla, navbar colapsable y tablas adaptables con Bootstrap. |

### Reglas de validación

- **Correo**: solo `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`.
- **Contraseña**: entre 4 y 10 caracteres.
- **RUN**: 7 a 9 caracteres, solo dígitos y `K`, sin puntos ni guion (ej.: `19011022K`).
- **Tarjeta**: 16 dígitos (`0000 0000 0000 0000`), vencimiento `MM/AA` no vencido y CVV de 3 dígitos.

---

## Roles y permisos

El rol se asigna automáticamente al registrarse, según una palabra clave en el correo:

| Si el correo contiene… | Rol asignado | Accesos |
|---|---|---|
| `vendedor` | Vendedor | Solo panel de productos |
| `admin` | Administrador | Panel de productos y panel de usuarios |
| nada de lo anterior | Cliente | Tienda, carrito y compra |

Si el correo contiene ambas palabras, tiene prioridad `vendedor`.

Rutas protegidas:

| Ruta | Quién entra | Si no tiene permiso |
|---|---|---|
| `/admin` | Administrador y vendedor | Invitado → `/login`. Cliente → inicio. |
| `/admin/usuarios` | Solo administrador | Vendedor → `/admin`. Invitado → `/login`. |

---

## Cómo probar la aplicación manualmente

Con `npm start` en ejecución, abre las herramientas de desarrollo (`F12`) → **Application → Local Storage** para ver cómo se guardan los datos.

### Crear usuarios de prueba (en `/registro`)

| Rol | Correo de ejemplo | Contraseña |
|---|---|---|
| Administrador | `jefe.admin@duoc.cl` | `1234` |
| Vendedor | `ventas.vendedor@duoc.cl` | `1234` |
| Cliente | `cliente@gmail.com` | `1234` |

Datos válidos adicionales para el formulario: RUN `19011022K`, región y comuna a elección.

### Datos válidos para el pago

| Campo | Valor |
|---|---|
| Nombre | `Ana Pérez` |
| RUN | `19011022K` |
| Dirección | `Av. Providencia 1234` |
| Tarjeta | `1234 5678 1234 5678` |
| Vencimiento | `12/30` |
| CVV | `123` |

### Casos que deben fallar (validaciones)

- Registro con correo `@hotmail.com`, contraseña de 3 o 11 caracteres, o RUN de 6 caracteres.
- Registro repetido con el mismo correo.
- Login con contraseña incorrecta.
- Pago con vencimiento `01/20` (tarjeta vencida), mes `13/30` o CVV de 2 dígitos.
- Entrar a `/admin` sin sesión, o a `/admin/usuarios` con un vendedor.
- Eliminar tu propia cuenta desde el panel de usuarios.

### Probar la responsividad

1. Abre las herramientas de desarrollo con `F12`.
2. Activa el modo dispositivo con `Ctrl + Shift + M`.
3. Revisa los anchos 375 px (móvil), 768 px (tablet) y 1280 px (escritorio).

### Reiniciar los datos

En `F12` → **Application → Storage → Clear site data**, y recarga la página.

---

## Pruebas unitarias (Jasmine + Karma)

El proyecto incluye **50 pruebas unitarias** que verifican lógica, comportamiento de los componentes y manipulación del DOM.

### Ejecutarlas

```bash
npm run test:karma
```

(`npm test` hace lo mismo.) Al terminar verás `Executed 50 of 50 SUCCESS` y un resumen de cobertura.

### Informe de cobertura

Se genera en la carpeta `coverage/`. Dentro hay una subcarpeta con el nombre del navegador usado; abre su `index.html` en el navegador:

```text
coverage/<nombre-del-navegador>/index.html
```

Cobertura obtenida en la última ejecución:

| Métrica | Resultado |
|---|---|
| Sentencias | 86,44 % |
| Ramas | 74,92 % |
| Funciones | 80,66 % |
| Líneas | 89,01 % |

### Qué se prueba

| Archivo | Contenido |
|---|---|
| `Tienda67.spec.js` | Tarjeta de producto, catálogo, carrito, registro y persistencia. |
| `Validaciones.spec.js` | RUN, contraseña, correo, tarjeta, vencimiento, CVV, roles, registro, pago y acceso a storage. |
| `Autenticacion.spec.js` | Login, registro, roles, Navbar según sesión y rutas protegidas. |
| `PagoYAdmin.spec.js` | Checkout, paneles de productos y usuarios, contacto, blogs y detalle de producto. |
| `App.spec.js` | Flujos completos: registro → login → panel admin → cerrar sesión, y pago del carrito. |

### Conceptos de testeo aplicados

- **Configuración del entorno**: `karma.conf.js` con Jasmine, Webpack, Babel y Chrome headless.
- **Mocks y spies**: `jasmine.createSpy` para callbacks, y `spyOn` sobre `window.confirm` y `Storage.prototype`.
- **Manipulación del DOM**: Testing Library (`render`, `fireEvent`) y selectores por `data-testid`.
- **Aislamiento**: cada prueba limpia el `localStorage` y se renderiza en un entorno independiente.
- **Cobertura**: instrumentación con `babel-plugin-istanbul` y reporte HTML con `karma-coverage`.

### Usar otro navegador distinto a Chrome (Brave, Chromium)

Karma busca Chrome por defecto. Para usar otro navegador basado en Chromium, define la variable `CHROME_BIN` con la ruta de su ejecutable.

**Linux / macOS**

```bash
export CHROME_BIN=/ruta/al/navegador
npm run test:karma
```

**Windows (PowerShell)**

```powershell
$env:CHROME_BIN="C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
npm run test:karma
```

**Linux con Brave instalado como Flatpak** (por ejemplo, Bazzite): crea un script intermedio.

```bash
mkdir -p ~/bin
printf '#!/bin/bash\nexec flatpak run com.brave.Browser "$@"\n' > ~/bin/brave-karma
chmod +x ~/bin/brave-karma

export CHROME_BIN=$HOME/bin/brave-karma
npm run test:karma
```

---

## Estructura del proyecto

```text
.
├── public/
│   ├── index.html
│   └── images/                 # Imágenes de productos y equipo
├── src/
│   ├── App.jsx                 # Estado global, sesión y rutas
│   ├── index.js
│   ├── components/             # Navbar, Footer, ProductCard, RutaProtegida, AdminNav
│   ├── pages/                  # Home, Productos, DetalleProducto, Carrito, Registro,
│   │                           # Login, Contacto, Blogs, DetalleBlog, Nosotros,
│   │                           # AdminProductos, AdminUsuarios
│   ├── hooks/
│   │   └── useLocalStorage.js  # Estado persistente en el navegador
│   ├── data/                   # Productos, blogs y regiones/comunas
│   ├── utils/
│   │   ├── validaciones.js     # Reglas de validación y formateo
│   │   └── storage.js          # Lectura y escritura segura de localStorage
│   ├── css/style.css
│   └── test/                   # Pruebas Jasmine (*.spec.js)
├── karma.conf.js               # Configuración de Karma y cobertura
├── package.json
└── README.md
```

---

## Persistencia de datos

Este proyecto es solo frontend, sin servidor ni base de datos. La información se guarda en el `localStorage` del navegador:

| Clave | Contenido |
|---|---|
| `productos_tienda67` | Catálogo de productos |
| `carrito_tienda67` | Carrito de compras |
| `usuarios_tienda67` | Usuarios registrados |
| `sesion_tienda67` | Sesión activa |

Consecuencias:

- Cada navegador y cada persona tiene su propia copia de los datos.
- Los datos se pierden si se borran los datos del sitio.
- Las contraseñas se guardan en texto plano. Es aceptable para un proyecto académico sin backend, pero **no** debe usarse así en producción.

---

## Solución de problemas

| Problema | Causa y solución |
|---|---|
| `npm` no se reconoce como comando | Node.js no está instalado o la terminal se abrió antes de instalarlo. Instala la versión LTS y abre una terminal nueva. |
| PowerShell: "la ejecución de scripts está deshabilitada" | Ejecuta `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` y abre PowerShell de nuevo, o usa `cmd`, o escribe `npm.cmd` en vez de `npm`. |
| `No binary for ChromeHeadless browser` | No hay un navegador Chrome instalado. Instálalo o define `CHROME_BIN` (ver la sección de pruebas). |
| Advertencias de webpack: `export '...' was not found` | Algún archivo quedó desactualizado. Verifica que `src/utils/validaciones.js` esté completo. |
| `react-scripts` falla al iniciar | Reinstala: borra la carpeta `node_modules` y ejecuta `npm install`. |
| El puerto 3000 está ocupado | Cierra la otra aplicación o acepta el puerto alternativo que propone React. |
| Error raro después de copiar el proyecto entre Windows y Linux | No copies `node_modules`. Bórrala y ejecuta `npm install`. |

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo en <http://localhost:3000> |
| `npm run build` | Compilación de producción en `build/` |
| `npm run test:karma` | Pruebas unitarias con Karma y cobertura |
| `npm test` | Igual que el anterior |

---

## Autores

Proyecto desarrollado por el equipo de **Tienda67** para la asignatura DSY1104 – Desarrollo Fullstack II, Duoc UC.
