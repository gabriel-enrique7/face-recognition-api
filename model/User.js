const Sequelize = require("sequelize")
const connection = require("../db/connection")

const ClassroomUser = require("./ClassroomUser")

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

}, {
    updatedAt: false,
    hooks: {
        afterDestroy: (user, options) => {
            ClassroomUser.destroy({ where: { id_user: user.id } })
        }
    }
});

module.exports = User