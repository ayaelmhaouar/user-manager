const fs = require("fs").promises;
const bcrypt = require("bcryptjs");

class UserManager {
  constructor(file) {
    this.file = file;
  }

  async register(username, email, password) {
    const users = await this.getUsers();
    if (users.find(u => u.email === email)) throw new Error("Email déjà utilisé");
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, email, password: hashed };
    users.push(newUser);
    await fs.writeFile(this.file, JSON.stringify(users, null, 2));
    return newUser;
  }

  async login(email, password) {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("Utilisateur introuvable");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Mot de passe incorrect");
    return user;
  }

  async listUsers() {
    return await this.getUsers();
  }

  async deleteUser(id) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Utilisateur non trouvé");
    users.splice(index, 1);
    await fs.writeFile(this.file, JSON.stringify(users, null, 2));
  }

  async getUsers() {
    try {
      const data = await fs.readFile(this.file, "utf8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

module.exports = UserManager;
