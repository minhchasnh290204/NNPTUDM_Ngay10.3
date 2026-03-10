const express = require('express')
let router = express.Router()
let roleSchema = require('../schemas/roles');
let userSchema = require('../schemas/users');

// GET all roles
router.get('/', async (req, res) => {
    try {
        let dataRoles = await roleSchema.find({
            isDeleted: false
        });
        res.send(dataRoles)
    } catch (error) {
        res.status(500).send({ message: "something went wrong" })
    }
})

// GET role by id
router.get('/:id', async (req, res) => {
    try {
        let dataRole = await roleSchema.findOne({
            isDeleted: false,
            _id: req.params.id
        });
        if (!dataRole) {
            res.status(404).send({ message: "ID NOT FOUND" })
        } else {
            res.send(dataRole)
        }
    } catch (error) {
        res.status(404).send({ message: "something went wrong" })
    }
})

// POST create role
router.post('/', async function (req, res, next) {
    try {
        let newItem = new roleSchema({
            name: req.body.name,
            description: req.body.description
        })
        await newItem.save();
        res.send(newItem)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// PUT update role
router.put('/:id', async function (req, res, next) {
    try {
        let getItem = await roleSchema.findByIdAndUpdate(
            req.params.id, req.body, {
            new: true
        }
        )
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

// DELETE soft delete role
router.delete('/:id', async function (req, res, next) {
    try {
        let getItem = await roleSchema.findOne({
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

// GET all users with role id
router.get('/:id/users', async (req, res) => {
    try {
        let dataUsers = await userSchema.find({
            isDeleted: false,
            role: req.params.id
        }).populate('role');
        res.send(dataUsers)
    } catch (error) {
        res.status(500).send({ message: "something went wrong" })
    }
})

module.exports = router;