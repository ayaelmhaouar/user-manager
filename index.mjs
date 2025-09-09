// index.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { UserManager } from './UserManager/UserManager.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // pour servir les fichiers HTML


// ===== ROUTE D'INSCRIPTION =====
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    UserManager.createUser(username, email, password, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ username }); // renvoie le nom pour le message de succès
    });
});

// ===== CRUD UTILISATEURS =====
app.get('/users', (req, res) => {
    UserManager.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.get('/users/:id', (req, res) => {
    UserManager.getUserById(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (!result.length) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(result[0]);
    });
});

app.put('/users/:id', (req, res) => {
    const { username, email, password } = req.body;
    UserManager.updateUser(req.params.id, username, email, password, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Utilisateur mis à jour' });
    });
});

app.delete('/users/:id', (req, res) => {
    UserManager.deleteUser(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Utilisateur supprimé' });
    });
});

// ===== LANCER LE SERVEUR =====
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
