<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Crear Proyecto desde 0 (Desarrollo)

- Crear Proyecto

```
    nest new pokedex
```

**NOTA**: Si se generan problemas por el formato del código se pueden eliminar las referencias de prettier en desarrollo. `Esto no se debe hacer en producción`.

```
    yarn remove prettier
    yarn remove eslint-config-prettier
    yarn remove eslint-plugin-prettier
```

- Levantar el proyecto

```
    yarn run start:dev
```

- Verificar si se levanto el proyecto. **NOTA**: Se configura el puerto en [main](./02-pokedex/src/main.ts)

```
    http://localhost:3000/
```

- Crear Módulo Pokemon

```
    nest g res pokemon --no-spec
```

# Clonar el repositorio

1. Clonar el repositorio
2. Ejecutar

```
    yarn install
```

3. Tener Nest CLI instalado

```
    npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
    docker-compose up -d
```

5. Clonar el archivo **.env.template** y renombrar la copia a **.env**

6. Llenar las variables de entorno en el archivo `.env`

7. Ejecutar la aplicación en dev

```
    yarn run start:dev
```

8. Reconstruir la base de datos con la semilla

```
    http://localhost:3000/api/v2/seed
```

# Production Build

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno de producción
3. Crear la nueva imagen

```
    docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

## Stack usado

- MongoDB
- Nest

# Notas

Heroku redeploy sin cambios:

```
    git commit --allow-empty -m "Tigger Heroku deploy"
    git push heroku <master|main>
```
