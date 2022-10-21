const Sequelize = require("sequelize")
const connection = require("../db/connection")

const ClassroomUser = connection.define("classroom_user", {
    job_title: {
        type: Sequelize.STRING(50),
        allowNull: false
    }

}, { updatedAt: false });

module.exports = ClassroomUser