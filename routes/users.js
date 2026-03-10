const express = require('express')
let router = express.Router()
let userSchema = require('../schemas/users');

// GET all users, with optional username query
router.get('/', async (req, res) => {
    try {
        let query = { isDeleted: false };
        if (req.query.username) {
            query.username = { $regex: req.query.username, $options: 'i' }; // case insensitive includes
        }
        let dataUsers = await userSchema.find(query).populate('role');
        res.send(dataUsers)
    } catch (error) {
        res.status(500).send({ message: "something went wrong" })
    }
})

// GET user by id
router.get('/:id', async (req, res) => {
    try {
        let dataUser = await userSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        }).populate('role');
        if (!dataUser) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            res.send(dataUser)
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" })
    }
})

// POST create user
router.post('/', async function (req, res, next) {
    try {
        let newItem = new userSchema({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        })
        await newItem.save();
        res.send(newItem)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// PUT update user
router.put('/:id', async function (req, res, next) {
    try {
        let getItem = await userSchema.findByIdAndUpdate(
            req.params.id, req.body, {
            new: true
        }
        ).populate('role')
        if (getItem) {
            res.send(getItem)
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// DELETE soft delete user
router.delete('/:id', async function (req, res, next) {
    try {
        let getItem = await userSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!getItem) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            getItem.isDeleted = true
            await getItem.save();
            res.send(getItem)
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// POST /enable - set status to true if email and username match
router.post('/enable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({
            email: email,
            username: username,
            isDeleted: false
        });
        if (!user) {
            res.status(404).send({ message: "User not found or credentials incorrect" })
        } else {
            user.status = true;
            await user.save();
            res.send({ message: "User enabled successfully", user: user })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// POST /disable - set status to false if email and username match
router.post('/disable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({
            email: email,
            username: username,
            isDeleted: false
        });
        if (!user) {
            res.status(404).send({ message: "User not found or credentials incorrect" })
        } else {
            user.status = false;
            await user.save();
            res.send({ message: "User disabled successfully", user: user })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

module.exports = router;
