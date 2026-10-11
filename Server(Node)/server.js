console.log("Iniciant servidor...");

// Importació del mòdul HTTP natiu de Node.js
const http = require('node:http');

// Comptador incremental en memòria per assignar identificadors únics als nous usuaris
let contador = 1;

// Creació del servidor HTTP i gestor central de peticions entrants
const server = http.createServer((req, res) => {
    const hora = new Date().toLocaleTimeString('ca-ES');

    // Endpoint GET /data: retorna informació temporal (data, hora, timestamp i dia) en format JSON
    if (req.url === "/data" && req.method === "GET") {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });

        const dataActual = new Date();
        const dadesJSON = {
            data: dataActual.toISOString().split('T')[0],
            hora: dataActual.toLocaleTimeString('ca-ES'),
            timestamp: dataActual.getTime(),
            dia_setmana: dataActual.toLocaleDateString('ca-ES', { weekday: 'long' })
        };

        res.end(JSON.stringify(dadesJSON));
        return;
    }

    // Endpoint POST /usuari: rep dades en streaming, valida el payload i crea un usuari
    if (req.url === "/usuari" && req.method === "POST") {
        let body = '';

        // Lectura progressiva dels paquets de dades (chunks) del cos de la petició
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        // Processament un cop s'ha completat la recepció de tot el cos
        req.on('end', () => {
            let dades;

            // Deserialització del JSON i gestió d'error en cas de format invàlid
            try {
                dades = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
                res.end(JSON.stringify({
                    error: "Dades invàlides",
                    data: ["Format de JSON invàlid"]
                }));
                return;
            }

            // Validació del format d'email mitjançant expressió regular
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const ArrobaiPunt = dades.email && typeof dades.email === 'string' && regexEmail.test(dades.email);

            // Validació del nom: caràcters alfabètics i espais, amb longitud entre 2 i 50
            const regexNom = /^[A-Za-z ]+$/;
            const nomValid = dades.nom && typeof dades.nom === 'string' && dades.nom.length >= 2 && dades.nom.length <= 50 && regexNom.test(dades.nom);

            // Retorn 201 Created si les dades són vàlides; altrament 400 Bad Request amb els errors
            if (ArrobaiPunt && nomValid) {
                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf8' });
                res.end(JSON.stringify({
                    "missatge": "Usuari creat correctament",
                    "usuari": {
                        "nom": dades.nom,
                        "email": dades.email,
                        "id": contador++,
                        "creatEl": new Date().toISOString()
                    }
                }));
            } else {
                const errors = [];
                if (!nomValid) errors.push("El nom ha de tenir entre 2 i 50 caràcters");
                if (!ArrobaiPunt) errors.push("Format d'email invàlid");

                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
                res.end(JSON.stringify({
                    error: "Dades invàlides",
                    data: errors
                }));
            }
        });
        return;
    }

    // Endpoint GET /api/info: exposa mètriques bàsiques del sistema (ús de memòria RSS, versió i temps actiu)
    if (req.url === '/api/info' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });

        const memoriaMB = (process.memoryUsage().rss / (1024 * 1024)).toFixed(1);

        res.end(JSON.stringify({
            "servidor": "Node.js",
            "versio": process.version,
            "plataforma": process.platform,
            "memoria_usada": `${memoriaMB} MB`,
            "temps_funcionament": `${Math.floor(process.uptime())} segons`
        }));
        return;
    }

    // Endpoint GET /api/calculadora: executa operacions aritmètiques basades en els paràmetres de la ruta
    if (req.url.startsWith('/api/calculadora') && req.method === 'GET') {
        const trossos = req.url.split('/');

        // Verificació dels segments mínims requerits: /api/calculadora/:operacio/:num1/:num2
        if (trossos.length < 6) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
            res.end(JSON.stringify({
                "error": "Paràmetres insuficients",
                "format_esperat": "/api/calculadora/:operacio/:num1/:num2",
                "operacions_suportades": ["suma", "resta", "multiplicacio", "divisio"],
                "exemple": "/api/calculadora/suma/5/3"
            }));
            return;
        }

        const operacio = trossos[3].toLowerCase();
        const num1 = Number(trossos[4]);
        const num2 = Number(trossos[5]);

        // Validació numèrica dels operands
        if (isNaN(num1) || isNaN(num2)) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
            res.end(JSON.stringify({
                "error": "Els paràmetres han de ser números vàlids"
            }));
            return;
        }

        // Control per evitar divisions per zero
        if (operacio === 'divisio' && num2 === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
            res.end(JSON.stringify({
                "error": "No es pot dividir per zero"
            }));
            return;
        }

        let resultat;
        let signe = '';

        // Càlcul aritmètic segons el tipus d'operació
        switch (operacio) {
            case 'suma':
                resultat = num1 + num2;
                signe = '+';
                break;
            case 'resta':
                resultat = num1 - num2;
                signe = '-';
                break;
            case 'multiplicacio':
                resultat = num1 * num2;
                signe = '*';
                break;
            case 'divisio':
                resultat = num1 / num2;
                signe = '/';
                break;
            default:
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
                res.end(JSON.stringify({
                    "error": "Operació no permesa. Usa: suma, resta, multiplicacio o divisio"
                }));
                return;
        }

        const expressio = `${num1} ${signe} ${num2} = ${resultat}`;

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify({
            "operacio": operacio,
            "num1": num1,
            "num2": num2,
            "resultat": resultat,
            "expressio": expressio
        }));
        return;
    }

    // Ruta per defecte: serveix la interfície web HTML amb l'estat i enllaços d'accés
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
    res.end(`
        <!DOCTYPE html>
        <html lang="ca">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Servidor Node.js</title>
            <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23339933'%3E%3Cpath d='M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.3L4.9 8.4v7.2L12 19.7l7.1-4.1V8.4L12 4.3z'/%3E%3C/svg%3E">
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f1f5f9;
                    color: #1e293b;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 1rem;
                }
                .container {
                    background: #ffffff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    max-width: 520px;
                    width: 100%;
                    border: 1px solid #e2e8f0;
                }
                .header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                .header svg {
                    width: 32px;
                    height: 32px;
                    fill: #339933;
                }
                h1 {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #0f172a;
                }
                .status {
                    font-size: 0.85rem;
                    color: #15803d;
                    background-color: #dcfce7;
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    font-weight: 500;
                    display: inline-block;
                    margin-bottom: 1rem;
                }
                .info {
                    font-size: 0.95rem;
                    color: #475569;
                    line-height: 1.5;
                    margin-bottom: 1.5rem;
                }
                .info code {
                    background: #f1f5f9;
                    padding: 0.15rem 0.4rem;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                h2 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 0.75rem;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 1rem;
                }
                .routes {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .routes a {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-decoration: none;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 0.7rem 1rem;
                    border-radius: 6px;
                    color: #2563eb;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .routes a:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                }
                .routes a span {
                    color: #64748b;
                    font-size: 0.8rem;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.3L4.9 8.4v7.2L12 19.7l7.1-4.1V8.4L12 4.3z"/>
                    </svg>
                    <h1>Servidor Node.js</h1>
                </div>
                
                <span class="status">En funcionament</span>

                <div class="info">
                    <p>Hora del servidor: <strong>${hora}</strong></p>
                    <p>Ruta actual: <code>${req.url}</code></p>
                </div>

                <h2>Rutes de l'aplicació</h2>
                <div class="routes">
                    <a href="/data" target="_blank">
                        Data i hora
                        <span>GET /data</span>
                    </a>
                    <a href="/api/info" target="_blank">
                        Informació del sistema
                        <span>GET /api/info</span>
                    </a>
                    <a href="/api/calculadora/suma/5/3" target="_blank">
                        Calculadora (suma)
                        <span>GET /api/calculadora/suma/5/3</span>
                    </a>
                </div>
            </div>
        </body>
        </html>
    `);
});

const PORT = 3000;

// Engegada del servidor HTTP al port especificat
server.listen(PORT, () => {
    console.log('');
    console.log('----------------------------------------------------');
    console.log(`\x1b[32mServidor iniciat correctament al port ${PORT}\x1b[0m`);
    console.log('----------------------------------------------------');
    console.log(`Per aturar el servidor: Ctrl+C`);
    console.log('');
    console.log(`Rutes disponibles:`);
    console.log(` - Principal:   \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(` - Data/Hora:   \x1b[36mhttp://localhost:${PORT}/data\x1b[0m`);
    console.log(` - Info:        \x1b[36mhttp://localhost:${PORT}/api/info\x1b[0m`);
    console.log(` - Calculadora: \x1b[36mhttp://localhost:${PORT}/api/calculadora/suma/5/3\x1b[0m`);
    console.log('');
});