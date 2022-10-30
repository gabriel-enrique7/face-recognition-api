const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Admin = require("../model/Admin")

require("dotenv").config()

router.post("/register", async (req, res) => {
    const { name, username, password } = req.body;

    if(name && username && password) {
        try {
            const admin = await Admin.findOne({ where: { username: username } });

            if(!admin) {

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt)

                await Admin.create({
                    name,
                    username,
                    password: hash
                });

                res.status(200).json({ msg: "Administrador registrado com sucesso" });

            }
            res.status(409).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.post("/authenticate", async (req, res) => {
    const { username, password } = req.body;

    if(username && password) {
        try {
            const admin = await Admin.findOne({ where: { username: username } });

            if(admin) {

                const isCorrectLogin = bcrypt.compareSync(password, admin.password);

                if(isCorrectLogin) {

                    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
                        expiresIn: 86400000
                    });

                    res.status(200).json({
                        id: admin.id,
                        name: admin.name,
                        username: admin.username,
                        createdAt: admin.createAt,
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

module.exports = router;