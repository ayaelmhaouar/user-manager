
import mysql from 'mysql';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'user_manager' 
});

db.connect(err => {
  if (err) console.error('Erreur connexion DB:', err);
  else console.log('✅ Connecté à MySQL');
});
