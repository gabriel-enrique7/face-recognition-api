const router = require("express").Router()
const multer = require("multer")
const fs = require("fs")

const Student = require("../model/Student")
const ClassroomStudent = require("../model/ClassroomStudent")

const verifyToken = require("../middlewares/verifyToken")

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

router.post("/", verifyToken, async (req, res) => {
    const { name, registration } = req.body;

    if(name && registration) {
        try {
            await Student.create({ name, registration });
            res.status(200).json({ msg: "Estudante registrado com sucesso" });

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

const uploadTempPhoto = tempUpload.single("photo");

router.post("/authenticate/face/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const student = await Student.findOne({ where: { id: id } });

        if(!student) {
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
                const registeredImage = student.photo_path;
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

router.post("/classroom", verifyToken, async (req, res) => {
    const { idStudent, idClassroom } = req.body;

    if(idStudent && idClassroom) {
        try {
            await ClassroomStudent.create({
                id_classroom: idClassroom,
                id_student: idStudent
            });

            res.status(200).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

router.put("/:id", verifyToken, async (req, res) => {
    const { name, registration } = req.body;

    const id = req.params.id;

    if(name, registration) {
        try {
            await Student.update({ name, registration }, { where: { id: id } });
            res.status(200).end()

        } catch { res.status(500).end() }
    }
    res.status(400).end()
});

const uploadUserPhoto = userUpload.single("photo");

router.put("/photo/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const student = await Student.findOne({ where: { id: id } });

        if(!student) {
            res.status(404).end();
            fs.unlinkSync(req.file.path)

        } else if(student.photo_path) {
            fs.unlinkSync(student.photo_path)
        }

        uploadUserPhoto(req, res, async (error) => {

            if(error instanceof multer.MulterError) {
                res.status(400).json({ error: "Arquivo Inválido" });
            
            } else if (error) {
                res.status(500).end()
            
            } else if (!req.file) {
                res.status(422).json({ error: "A imagem é obrigatória" })
            
            } else {
                await Student.update({ photo_path: req.file.path }, { where: { id: id } })
                res.status(200).end()
            }
        });

    } catch { res.status(500).end() }
});

router.get("/confirm/:registration", verifyToken, async (req, res) => {
    const registration = req.params.registration;

    try {
        const student = await Student.findOne({ where: { registration: registration } })

        if(!student) {
            res.status(404).end()
        }

        res.status(200).json({
            id: student.id
        });

    } catch { res.status(500).end() }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const student = await Student.findOne({ where: { id: id } });

        if(!student) {
            res.status(404).end()
        
        } else if (student.photo_path) {
            fs.unlinkSync(student.photo_path)
        }

        await Student.destroy({ where: { id: id } })
        res.status(200).end()

    } catch { res.status(500).end() }
});

module.exports = router;