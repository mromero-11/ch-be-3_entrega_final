# ch-be-3_entrega_final

Este proyecto implementa una API RESTful en Node.js con Express y MongoDB, que gestiona usuarios, mascotas y adopciones. Incluye generación de datos de prueba (mocks), documentación con Swagger y despliegue en Docker.

---

## Tecnologías Principales

- **Node.js** 18  
- **Express**  
- **MongoDB**  
- **Docker**  
- **Supertest**  
- **Swagger (OpenAPI)**  

---

## Prerrequisitos

- Docker instalado  

---

## Uso con Docker

```bash
docker pull camocker/ch-be-3_ef:latest
docker run -d -p 3000:3000 --name ch-be-3_ef camocker/ch-be-3_ef:latest
```

---

## Construir imagen local

```bash
docker build -t ch-be-3_ef .
```

---

## Ejecutar sin Docker

```bash
npm install
npm start
```

---

## Documentación Swagger

http://localhost:3000/api/docs

---

## Tests

```bash
npm test
```

---
