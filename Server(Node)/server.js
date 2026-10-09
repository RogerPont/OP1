console.log("Iniciant servidor");

const http = require('node:http');

let contador = 1;
const server = http.createServer((req, res) => {
    const hora = new Date().toLocaleTimeString('ca-ES');

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

    if (req.url === "/usuari" && req.method === "POST") {
        const trososs = []
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const dades = JSON.parse(body);
            const ArrobaiPunt = dades.email.includes('@') && dades.email.includes('.');
            const nom = dades.nom.length >= 2 && dades.nom.length <= 50;

            if (ArrobaiPunt && nom) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
                res.end(JSON.stringify({
                    "missatge": "Dades rebudes correctament",
                    "usuari": {
                        "nom": dades.nom,
                        "email": dades.email,
                        "id": contador++,
                        "creatEl": new Date().toISOString()
                    }
                }));
            } else {
                const errors = [];
                if (!nom) errors.push("El nom ha de tenir entre 2 i 50 caràcters");
                if (!ArrobaiPunt) errors.push("Format d'email invàlid");

                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf8' });
                res.end(JSON.stringify({
                    "error": "Dades invàlides",
                    "data": errors
                }));
            }
        });
        return;
    }

    if (req.url === '/api/info' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });

        res.end(JSON.stringify({
            "node": process.version,
            "nom": process.platform,
            "memoria": process.memoryUsage()
        }));
        return;
    }


    if (req.url.startsWith('/api/calculadora') && req.method === 'GET') {
        const trossos = req.url.split('/');
        
        // Comprovem si han posat els paràmetres (la URL separada per '/' ha de tenir com a mínim 6 trossos)
        if (trossos.length < 6) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
            res.end(JSON.stringify({
                "instruccions": "Fes servir la URL per calcular: /api/calculadora/operacio/numero1/numero2",
                "operacions_suportades": ["suma", "resta", "multiplicacio", "divisio"],
                "exemple": "/api/calculadora/suma/5/3"
            }));
            return;
        }

        const operacio = trossos[3];
        const numero1 = Number(trossos[4]);
        const numero2 = Number(trossos[5]);
        
        let resultat;
        switch (operacio) {
            case 'suma':
                resultat = numero1 + numero2;
                break;
            case 'resta':
                resultat = numero1 - numero2;
                break;
            case 'multiplicacio':
                resultat = numero1 * numero2;
                break;
            case 'divisio':
                resultat = numero1 / numero2;
                break;
            default:
                break;
        }

        let expressio = "";
        if (operacio === "suma") expressio = `${numero1} + ${numero2} = ${resultat}`;
        else if (operacio === "resta") expressio = `${numero1} - ${numero2} = ${resultat}`;
        else if (operacio === "multiplicacio") expressio = `${numero1} * ${numero2} = ${resultat}`;
        else if (operacio === "divisio") expressio = `${numero1} / ${numero2} = ${resultat}`;
        else expressio = "Operació no vàlida";

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify({
            "operacio": operacio,
            "numero1": numero1,
            "numero2": numero2,
            "resultat": resultat,
            "expressio": expressio
        }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' })

    res.end(`
        <h1>Server Node.js</h1>;
        <p>Hora actual: ${hora}</p>;
        <p>URL de la petició: ${req.url}</p>`);
});


const PORT = 3000

server.listen(PORT, () => {
    console.log(`Server en marxa al http://localhost:${PORT}`);
    console.log(`Per parar el servidor fes Ctrl+C`);
})