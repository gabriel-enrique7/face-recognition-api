const Sequelize = require("sequelize")
const connection = require("../db/connection");

const User = require("./User");
const Student = require("./Student");
const ClassroomStudent = require("./ClassroomStudent");

const Classroom = connection.define("classroom", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }

}, {
    updatedAt: false,
    hooks: {
        afterDestroy: (classroom, options) => {
            ClassroomStudent.destroy({ where: { id_classroom: classroom.id } })
        }
    }
});

User.hasMany(Classroom, {
    foreignKey: "id_user",
    constraint: true
});

Classroom.belongsToMany(Student, {
    through: {
        model: ClassroomStudent
    },
    foreignKey: "id_classroom",
    constraint: true
});

Student.belongsToMany(Classroom, {
    through: {
        model: ClassroomStudent
    },
    foreignKey: "id_student",
    constraint: true
});

// Super Many-to-Many Relationship
Classroom.hasMany(ClassroomStudent, { foreignKey: "id_classroom" })
ClassroomStudent.belongsTo(Classroom, { foreignKey: "id_classroom" })
Student.hasMany(ClassroomStudent, { foreignKey: "id_student" })
ClassroomStudent.belongsTo(Student, { foreignKey: "id_student" })

module.exports = Classroom;