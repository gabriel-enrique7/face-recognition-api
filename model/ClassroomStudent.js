const connection = require("../db/connection")

const ClassroomStudent = connection.define("classroom_student", {}, { updatedAt: false });

module.exports = ClassroomStudent