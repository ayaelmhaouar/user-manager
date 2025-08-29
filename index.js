const UserManager = require("./UserManager/UserManager");
const userManager = new UserManager("users.json");
module.exports = UserManager;