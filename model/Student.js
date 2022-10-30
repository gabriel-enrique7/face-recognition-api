const Sequelize = require("sequelize")
const connection = require("../db/connection")

const Student = connection.define("student", {
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    registration: {
        type: Sequelize.STRING(10),
        unique: true,
        allowNull: false
    },
    photo_path: {
        type: Sequelize.STRING,
        allowNull: true
    }

}, { updatedAt: false });

module.exports = Student;