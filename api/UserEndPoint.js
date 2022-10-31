const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const verifyToken = require("../middlewares/verifyToken")

const User = require("../model/User")
const Classroom = require("../model/Classroom")

require("dotenv").config()

router.post("/register", verifyToken, async (req, res) => {
    const { name, email, password } = req.body;

    if(name && email && password) {
        try {
            const user = await User.findOne({ where: { email } });

            if(!user) {

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt)

                await User.create({
                    name,
                    email,
                    password: hash
                });

                res.status(200).json({ msg: "Usuário registrado com sucesso" });

            }
            res.status(409).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;

    if(email && password) {
        try {
            const user = await User.findOne({ where: { email } });

            if(user) {

                const isCorrectLogin = bcrypt.compareSync(password, user.password);

                if(isCorrectLogin) {

                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                        expiresIn: 86400000
                    });

                    res.status(200).json({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                        token: token
                    });
                }
                res.status(401).end()
            }
            res.status(401).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.put("/:id", verifyToken, async (req, res) => {
    const { name, email, password } = req.body;

    const id = req.params.id;

    if(name && email && password) {
        try {
            await User.update({ name, email, password }, { where: { id: id } });
            res.status(200).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.get("/classroom/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const classrooms = await User.findByPk(id, {
            attributes: ["id", "name", "email", "createdAt"],
            include: Classroom
        });

        if(classrooms) res.status(200).json(classrooms);
        res.status(404).end()

    } catch { res.status(500).end() }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await User.destroy({ where: { id: id } })
        res.status(200).end()

    } catch { res.status(500).end() }
});

module.exports = router