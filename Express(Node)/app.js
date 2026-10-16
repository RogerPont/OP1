const express = require('express');
const app = express();
const port = 3000

app.use(express.json());

let $productes = [
    {id: 1, nom: "Portàtil", preu: 1200, categoria: '', stock: 10},
    {id: 2, nom: "Teclat", preu: 50, categoria: '', stock: 20},
    {id: 3, nom: "Ratolí", preu: 25, categoria: '', stock: 30},
    {id: 4, nom: "Monitor", preu: 300, categoria: '', stock: 15},
    {id: 5, nom: "Auriculars", preu: 75, categoria: '', stock: 40},
    {id: 6, nom: "Webcam", preu: 45, categoria: '', stock: 25}
];

let properID = $productes.length + 1;


app.get("/" , (req , res) => {
    res.status(200).send("<h1>BENVINGUT A LA WEB</h1>");
})

app.get("/api/productes" , (req , res) => {
    res.status(200).json({ estat: "success", data: $productes });
})

app.get("/api/productes/:id" , (req , res) => {
    const id = parseInt(req.params.id);
    const producte = $productes.find(p => p.id === id);
    
    if (isNaN(id)) {
        return res.status(400).json({ estat: "error", missatge: "L'id ha de ser un número" });
    }

    if (!producte) {
        return res.status(404).json({ estat: "error", missatge: "Producte no trobat" });
    }
    res.status(200).json({ estat: "success", data: producte });
})

app.post("/api/productes" , (req , res) => {
    const { nom , preu , categoria , stock } = req.body;

    if (!nom || preu === undefined) {
        return res.status(400).json({ estat: "error", missatge: "Hauria de passar 'nom' i 'preu'" });
    }

    else if (typeof(nom) !== 'string' || typeof(preu) !== 'number') {
        return res.status(400).json({ estat: "error", missatge: "'nom' ha de ser text i 'preu' nombre" });
    }

    else if (preu < 0 || stock < 0) {
        return res.status(400).json({ estat: "error", missatge: "'preu' i 'stock' han de ser nombres positius" });
    }
    const newID = properID++;

    const nouProducte = ({
        id: newID,
        nom: nom,
        preu: preu,
        categoria: categoria || '',
        stock: stock || 0
    })
    
    $productes.push(nouProducte);
    res.status(201).json({
        estat: "success",
        missatge: "Producte afegit correctament",
        data: nouProducte
    });
})

app.use((req, res) => {
    res.status(404).json({
        estat: "error",
        missatge: "Ruta no trobada",
        ruta: req.originalUrl
    });
})

app.listen(port, () => {
    console.log(`Servidor en funcionament a http://localhost:${port}`);
    console.log(`Per parar el servidor fes Ctrl+C`);
});