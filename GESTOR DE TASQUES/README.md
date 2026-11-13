# Gestor de Tasques - API REST

API REST desenvolupada amb Node.js, Express i MongoDB (Mongoose) per gestionar tasques.

## Requisits previs
- [Node.js](https://nodejs.org/) (versió recomanada >= 18)
- [MongoDB](https://www.mongodb.com/) en execució localment o un clúster de MongoDB Atlas.

## Instal·lació

1. Clona el repositori o descarrega els fitxers del projecte.
2. Instal·la les dependències del projecte:
   ```bash
   npm install
   ```

## Configuració de l'entorn (.env)

Crea un fitxer anomenat `.env` a l'arrel del projecte (pots basar-te en `.env.example`):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```

## Execució del projecte

- **Mode desenvolupament** (amb recàrrega automàtica via Nodemon):
  ```bash
  npm run dev
  ```

- **Mode producció**:
  ```bash
  npm start
  ```

El servidor s'iniciarà a: `http://localhost:3000`

## Endpoints de l'API

| Mètode | Ruta | Descripció |
|---|---|---|
| `POST` | `/api/tasks` | Crear una nova tasca |
| `GET` | `/api/tasks` | Obtenir totes les tasques |
| `GET` | `/api/tasks/:id` | Obtenir una tasca pel seu ID |
| `PUT` | `/api/tasks/:id` | Actualitzar una tasca |
| `DELETE` | `/api/tasks/:id` | Eliminar una tasca |

## Col·lecció de Postman

La col·lecció exportada amb els exemples requerits es troba a:
`postman/gestor-tasques.postman_collection.json`

