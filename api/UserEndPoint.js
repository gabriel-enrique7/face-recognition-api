const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const fs = require("fs")

const User = require("../model/User")

require("dotenv").config()

const http = require("../config/axios")
const { limits, fileFilter, generateStorage } = require("../config/multer")

const userPhotoStorage = generateStorage("uploads");
const tempPhotoStorage = generateStorage("temp");

const userUpload = multer({
    storage: userPhotoStorage,
    limits: limits,
    fileFilter: fileFilter
});

const tempUpload = multer({
    storage: tempPhotoStorage,
    limits: limits,
    fileFilter: fileFilter
});

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if(name && email && password) {
        try {
            const user = await User.findOne({ where: { email } });

            if(!user) {

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt)

                const user = await User.create({
                    name,
                    email,
                    password: hash,
                    photo_path: null
                });

                res.status(200).json({
                    msg: "Usuário registrado com sucesso",
                    userId: user.id
                });

            }
            res.status(409).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

const uploadUserPhoto = userUpload.single("photo");

router.put("/photo/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if(!user) {
            res.status(404).end();

        } else if(user.photo_path) {
            fs.unlinkSync(user.photo_path)
        }

        uploadUserPhoto(req, res, async (error) => {

            if(error instanceof multer.MulterError) {
                res.status(400).json({ error: "Arquivo Inválido" });
            
            } else if (error) {
                res.status(500).end()
            
            } else if (!req.file) {
                res.status(422).json({ error: "A imagem é obrigatória" })
            
            } else {
                await User.update({ photo_path: req.file.path }, { where: { id: userId } })
                res.status(200).end()
            }
        });

    } catch { res.status(500).end() }
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
                        name: user.name,
                        token
                    });
                }
                res.status(401).end()
            }
            res.status(401).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

const uploadTempPhoto = tempUpload.single("photo");

router.post("/authenticate/face/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if(!user) {
            res.status(404).end()
        }

        uploadTempPhoto(req, res, async (error) => {

            if(error instanceof multer.MulterError) {
                res.status(400).json({ error: "Arquivo Inválido" });
            
            } else if (error) {
                res.status(500).end();
            
            } else if (!req.file) {
                res.status(422).json({ error: "A imagem é obrigatória" });
            
            } else {
                const registeredImage = user.photo_path;
                const imageCompare = req.file.path;

                const data = {
                    registeredImage,
                    imageCompare
                }

                http.post("/faces/compare", data)
                    .then((response) => {
                        fs.unlinkSync(imageCompare)
                        res.status(200).json(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                        fs.unlinkSync(imageCompare)
                        res.status(500).end()
                    });
            }
        });

    } catch { res.status(500).end() }
});

module.exports = router