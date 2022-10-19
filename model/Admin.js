const Sequelize = require("sequelize")
const connection = require("../db/connection")

const Admin = connection.define("admin", {
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, { createdAt: false, updatedAt: false });


Admin.sync({ force: false })
module.exports = Admin