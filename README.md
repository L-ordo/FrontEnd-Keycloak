# 🔐 Keycloak Microfrontends (Module Federation)

Proyecto de autenticación y administración de usuarios utilizando Keycloak + React + Rspack + Module Federation.

---

## 📦 Apps

| App        | URL                     | Descripción |
|------------|--------------------------|-------------|
| shell      | http://localhost:3000    | Aplicación principal |
| users-list | http://localhost:3001    | Listado de usuarios |
| users-form | http://localhost:3002    | Creación y edición de usuarios |

---

## 🚀 Instalación

Desde la raíz del proyecto:

```bash
npm install
```

---

## ▶️ Ejecutar todos los microfrontends

```bash
npm run dev
```

Esto levantará automáticamente:

- shell → puerto 3000
- users-list → puerto 3001
- users-form → puerto 3002

Ya no es necesario iniciar cada app manualmente.

---

## 🛠 Ejecutar individualmente (opcional)

```bash
cd shell && npm start
cd users-list && npm start
cd users-form && npm start
```

---

## 🔐 Configuración Keycloak

- Realm: `master`
- Client: `frontend-app`
- Grant type: `password`
- Usuario administrador debe tener rol:
  - `realm-management → realm-admin`

---

## 🏗 Arquitectura

- React
- Rspack
- Module Federation
- Keycloak Admin API
- Microfrontend Architecture

---

## 👨‍💻 Autor

Luis Ordoñez