const router = require("express").Router()
const verifyToken = require("../middlewares/verifyToken")

const Classroom = require("../model/Classroom");
const Student = require("../model/Student");
const User = require("../model/User")

router.post("/", verifyToken, async (req, res) => {
    const { name, description, idUser } = req.body;

    if(name && idUser) {
        try {
            await Classroom.create({
                name,
                description,
                id_user: idUser
            });

            res.status(200).json({ msg: "Turma criada com sucesso" });

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.put("/:id", verifyToken, async (req, res) => {
    const { name, description } = req.body;

    const id = req.params.id;

    if(name) {
        try {
            await Classroom.update({ name, description }, { where: { id: id } });
            res.status(200).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.get("/student/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const classroom = await Classroom.findByPk(id, {
            include: Student
        });

        if(classroom) res.status(200).json(classroom)
        res.status(404).end()

    } catch { res.status(500).end() }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        await Classroom.destroy({ where: { id: id } });
        res.status(200).end()

    } catch { res.status(500).end() }
});

module.exports = router