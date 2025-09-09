import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ton mot de passe MySQL
  database: 'user_manager' // crée cette base avant
});

// Connecter à MySQL
db.connect(err => {
  if (err) throw err;
  console.log("Connecté à MySQL.");
});

// Création de la table users si elle n'existe pas
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)`);

export const UserManager = {
  createUser: (username, email, password, callback) => {
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password],
      callback
    );
  },

  getAllUsers: callback => {
    db.query('SELECT * FROM users', callback);
  },

  getUserById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback);
  },

  updateUser: (id, username, email, password, callback) => {
    db.query(
      'UPDATE users SET username=?, email=?, password=? WHERE id=?',
      [username, email, password, id],
      callback
    );
  },

  deleteUser: (id, callback) => {
    db.query('DELETE FROM users WHERE id=?', [id], callback);
  }
};
