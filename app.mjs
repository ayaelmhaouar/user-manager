import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import UserManager from "./UserManager/UserManager.js";


// 🔹 Correction pour utiliser __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const userManager = new UserManager();

// Middleware pour lire les JSON envoyés
app.use(express.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Route POST inscription
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const user = userManager.addUser(username, email, password);
  res.status(201).json({ message: "Utilisateur inscrit avec succès.", user });
});

// Route POST login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = userManager.findUser(email, password);
  if (!user) {
    return res.status(401).json({ message: "Identifiants incorrects." });
  }

  res.json({ message: "Connexion réussie." });
});
// ❌ Supprimer un utilisateur
app.delete("/users/:email", (req, res) => {
  const email = req.params.email;
  const success = userManager.deleteUser(email);
  if (!success) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ message: "Utilisateur supprimé" });
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("✅ Serveur démarré sur http://localhost:3000");
});
