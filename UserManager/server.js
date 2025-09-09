import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';
import { UserManager } from './UserManager.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connexion à MySQL
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ton mot de passe MySQL
  database: 'user_manager' // crée cette base avant
});

// Créer la table si elle n'existe pas
await db.execute(`
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`);

// Route d'inscription
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Insérer l'utilisateur
    await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      password // ⚠️ pour production, hacher le mot de passe avec bcrypt !
    ]);

    res.status(201).json({ username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
