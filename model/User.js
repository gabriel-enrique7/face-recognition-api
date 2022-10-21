const Sequelize = require("sequelize")
const connection = require("../db/connection")

const User = connection.define("user", {
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
    },
    photo_path: {
        type: Sequelize.STRING,
        allowNull: true
    }

}, { updatedAt: false });

module.exports = User