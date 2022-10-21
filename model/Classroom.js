const Sequelize = require("sequelize")
const connection = require("../db/connection");

const User = require("./User");
const ClassroomUser = require("./ClassroomUser");

const Classroom = connection.define("classroom", {
    code: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }

}, { id: false, updatedAt: false });

Classroom.belongsToMany(User, {
    through: {
        model: ClassroomUser
    },
    foreignKey: "code_classroom",
    constraint: true
});

User.belongsToMany(Classroom, {
    through: {
        model: ClassroomUser
    },
    foreignKey: "id_user",
    constraint: true
});

// Super Many-to-Many Relationship
Classroom.hasMany(ClassroomUser, { foreignKey: "code_classroom" })
ClassroomUser.belongsTo(Classroom, { foreignKey: "code_classroom" })
User.hasMany(ClassroomUser, { foreignKey: "id_user" })
ClassroomUser.belongsTo(User, { foreignKey: "id_user" })

module.exports = Classroom