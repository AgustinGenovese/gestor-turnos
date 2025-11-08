# --------------------------
# ETAPA 1: Build del frontend (React)
# --------------------------
FROM node:20 AS build-client

WORKDIR /app/client

# Copiamos solo package.json y package-lock.json para aprovechar cache
COPY client/package*.json ./
RUN npm install

# Copiamos el resto del frontend
COPY client/ ./

# Build de producción
RUN npm run build

# --------------------------
# ETAPA 2: Backend (Express + React build)
# --------------------------
FROM node:20

WORKDIR /app/server

# Copiamos package.json y package-lock.json del backend
COPY server/package*.json ./
RUN npm install

# Copiamos el código del backend
COPY server/ ./

# Copiamos el build del frontend dentro del backend
COPY --from=build-client /app/client/dist /app/client/dist

# Exponemos el puerto del backend
EXPOSE 3000

# Variables de entorno se pasan desde el host o Digital Ocean, NO dentro de la imagen

# Comando de inicio
CMD ["node", "index.js"]
