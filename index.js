const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const connection = require("./db/connection")

const User = require("./model/User")
const Admin = require("./model/Admin")
const Student = require("./model/Student")
const Classroom = require("./model/Classroom")

const UserEndPoint = require("./api/UserEndPoint")
const AdminEndPoint = require("./api/AdminEndPoint")
const StudentEndPoint = require("./api/StudentEndPoint")
const ClassroomEndPoint = require("./api/ClassroomEndPoint")

const app = express()


app.use(cors())

app.use("/uploads", express.static("uploads"))
app.use("/temp", express.static("temp"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


connection.authenticate()
    .then(() => console.log("Database MySQL has been connected"))
    .catch(error => console.log(error))

connection.sync()


app.use("/api/user", UserEndPoint)
app.use("/api/admin", AdminEndPoint)
app.use("/api/student", StudentEndPoint)
app.use("/api/classroom", ClassroomEndPoint)


app.get("/", (req, res) => {
    res.status(200).json({ status: "Ok" })
});

app.listen(4343, () => {
    console.log("The server has been started")
});