# API de Productes (Express)

API REST senzilla feta amb Node.js i Express per gestionar una llista de productes (dades en memòria).

## Requisits

- [Node.js](https://nodejs.org/) (versió 18 o superior recomanada)
- npm (inclòs amb Node.js)

## Passos per arrencar el projecte

1. **Obrir una terminal** a la carpeta del projecte:

   ```bash
   cd "Express(Node)"
   ```

2. **Instal·lar les dependències**:

   ```bash
   npm install
   ```

3. **Arrencar el servidor**:

   ```bash
   npm start
   ```

   O en mode desenvolupament (es reinicia sol en canviar `app.js`):

   ```bash
   npm run dev
   ```

4. **Comprovar que funciona**. Hauries de veure:

   ```
   Servidor en funcionament a http://localhost:3000
   ```

   Obre <http://localhost:3000> al navegador.

5. **Aturar el servidor** amb `Ctrl + C`.

> **Nota (Windows/PowerShell):** si `npm` dóna un error de política d'execució de scripts, executa:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Endpoints

| Mètode | Ruta                 | Descripció                  |
|--------|----------------------|-----------------------------|
| GET    | `/`                  | Missatge de benvinguda      |
| GET    | `/api/productes`     | Llista tots els productes   |
| GET    | `/api/productes/:id` | Retorna un producte per id  |
| POST   | `/api/productes`     | Afegeix un producte nou     |

### Exemple de POST

```bash
curl -X POST http://localhost:3000/api/productes \
  -H "Content-Type: application/json" \
  -d '{"nom": "Altaveu", "preu": 60, "categoria": "Àudio", "stock": 12}'
```

Camps obligatoris: `nom` (text) i `preu` (nombre). Opcionals: `categoria` i `stock`.

En PowerShell, usa `curl.exe` i escapa les cometes:

```powershell
curl.exe -X POST http://localhost:3000/api/productes -H "Content-Type: application/json" -d '{\"nom\":\"Altaveu\",\"preu\":60,\"categoria\":\"Àudio\",\"stock\":12}'
```

### Format de les respostes

Èxit:

```json
{ "estat": "success", "missatge": "Producte afegit correctament", "data": { } }
```

Error:

```json
{ "estat": "error", "missatge": "Producte no trobat" }
```

## Notes

- Les dades es guarden en memòria: es perden en reiniciar el servidor.
- El port per defecte és `3000` (es canvia a `app.js`).
