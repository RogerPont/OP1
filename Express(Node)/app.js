// 1. Imports i configuració
const express = require('express');
const app = express();
const port = 3000;

// 2. Middleware
app.use(express.json());

// 3. Dades inicials
let $productes = [
    {id: 1, nom: "Portàtil", preu: 1200, categoria: 'Ordinadors', stock: 10},
    {id: 2, nom: "Teclat", preu: 50, categoria: 'Perifèrics', stock: 20},
    {id: 3, nom: "Ratolí", preu: 25, categoria: 'Perifèrics', stock: 30},
    {id: 4, nom: "Monitor", preu: 300, categoria: 'Pantalles', stock: 15},
    {id: 5, nom: "Auriculars", preu: 75, categoria: 'Àudio', stock: 40},
    {id: 6, nom: "Webcam", preu: 45, categoria: 'Vídeo', stock: 25}
];

let properID = $productes.length + 1;

// 4. Rutes
app.get("/" , (req , res) => {
    res.status(200).send("<h1>BENVINGUT A LA WEB</h1>");
});

// Llistar tots els productes
app.get("/api/productes" , (req , res) => {
    res.status(200).json({ estat: "success", data: $productes });
});

// Obtenir un producte per id
app.get("/api/productes/:id" , (req , res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ estat: "error", resposta: '400', missatge: "L'id ha de ser un número" });
    }

    const producte = $productes.find(p => p.id === id);

    if (!producte) {
        return res.status(404).json({ estat: "error", missatge: "Producte no trobat" });
    }

    res.status(200).json({ estat: "success", data: producte });
});

// Crear un producte nou
app.post("/api/productes" , (req , res) => {
    const { nom , preu , categoria , stock } = req.body;

    const error = [];

    if (typeof nom !== 'string' || nom.trim() === '') {
        error.push("El nom no pot estar buit i ha de ser un text.");
    }

    if (typeof preu !== 'number' || preu <= 0) {
        error.push("El preu introduit no es correcte. Vigila ha de ser un número!");
    }

    if (typeof categoria !== 'string' || categoria.trim() === '') {
        error.push("Aquesta categoria no exsteix introdueix una categoria i que sigui en text.");
    }

    if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
        error.push("si us plau introdueix un número valid.");
    }

    if (error.length > 0) {
        return res.status(400).json({
            estat: "error",
            resposta: '400',
            missatge: "Dades invàlides",
            detalls: error
        });
    }

    const newID = properID++;

    const nouProducte = {
        id: newID,
        nom: nom.trim(),
        preu: preu,
        categoria: categoria.trim(),
        stock: stock
    };
    
    $productes.push(nouProducte);
    res.status(201).json({
        estat: "success",
        missatge: "Producte afegit correctament",
        data: nouProducte
    });
});

// Actualitzar un producte
app.put("/api/productes/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ estat: "error", resposta: '400', missatge: "L'id ha de ser un número" });
    }

    const index = $productes.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ estat: "error", missatge: "Producte no trobat" });
    }

    const { nom, preu, categoria, stock } = req.body;
    const error = [];

    if (typeof nom !== 'string' || nom.trim() === '') {
        error.push("El nom no pot estar buit i ha de ser un text.");
    }

    if (typeof preu !== 'number' || preu <= 0) {
        error.push("El preu introduit no es correcte. Vigila ha de ser un número!");
    }

    if (typeof categoria !== 'string' || categoria.trim() === '') {
        error.push("Aquesta categoria no exsteix introdueix una categoria i que sigui en text.");
    }

    if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
        error.push("si us plau introdueix un número valid.");
    }

    if (error.length > 0) {
        return res.status(400).json({
            estat: "error",
            resposta: '400',
            missatge: "Dades invàlides",
            detalls: error
        });
    }

    $productes[index] = {
        id: id,
        nom: nom.trim(),
        preu: preu,
        categoria: categoria.trim(),
        stock: stock
    };

    res.status(200).json({
        estat: "success",
        missatge: "Producte actualitzat correctament",
        data: $productes[index]
    });
});

// Eliminar un producte
app.delete("/api/productes/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ estat: "error", resposta: '400', missatge: "L'id ha de ser un número" });
    }

    const index = $productes.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ estat: "error", missatge: "Producte no trobat" });
    }

    const producteEliminat = $productes.splice(index, 1)[0];

    res.status(200).json({
        estat: "success",
        missatge: "Producte eliminat correctament",
        data: producteEliminat
    });
});

// 5. Ruta 404
app.use((req, res) => {
    res.status(404).json({
        estat: "error",
        missatge: "Ruta no trobada",    
        ruta: req.originalUrl
    });
});

// 6. Gestor d'errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            estat: "error",
            resposta: '400',
            missatge: "JSON mal format"
        });
    }

    res.status(500).json({
        estat: "error",
        missatge: "Error intern del servidor"
    });
});

// 7. Engegar el servidor
app.listen(port, () => {
    console.log(`Servidor en funcionament a http://localhost:${port}`);
    console.log(`Per parar el servidor fes Ctrl+C`);
});
