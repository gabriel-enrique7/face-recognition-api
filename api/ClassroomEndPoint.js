const router = require("express").Router()
const verifyToken = require("../middlewares/verifyToken")

const Classroom = require("../model/Classroom")
const User = require("../model/User")

router.post("/", async (req, res) => {
    const { name, description } = req.body;

    if(name) {
        try {

            const code = Math.random().toString(36).substring(2, 10)

            const classroom = await Classroom.create({
                code,
                name,
                description
            });

            res.status(200).json({
                msg: "Turma criada com sucesso",
                code: code
            });

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.put("/:classroomCode", async (req, res) => {
    const { name, description } = req.body;

    const classroomCode = req.params.classroomCode;

    if(name) {
        try {

            await Classroom.update({ name, description }, { where: { code: classroomCode } });
            res.status(200).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.get("/:classroomCode", async (req, res) => {
    const classroomCode = req.params.classroomCode;

    try {
        const classroom = await Classroom.findByPk(classroomCode, {
            include: [{
                model: User,
                attributes: [
                    "id",
                    "name",
                    "photo_path",
                    "createdAt"
                ]
            }]
        });

        if(classroom) res.status(200).json(classroom)
        res.status(404).end()

    } catch { res.status(500).end() }
});

router.delete("/:classroomCode", async (req, res) => {
    const classroomCode = req.params.classroomCode;

    try {
        Classroom.destroy({ where: { code: classroomCode } });
        res.status(200).end()

    } catch { res.status(500).end() }
});

module.exports = router