//PetController.js
const Pet = require('../Model/Pet')
const User = require('../Model/User')
//bibliotecas
const jwt = require('jsonwebtoken')

//helpers
const getToken = require('../helpers/get-token')

module.exports = class PetController { //Criar um controlador de Pets
    //Criar um novo Pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const available = true

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'O age é obrigatório' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O weight é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'O color é obrigatório' })
            return
        }
        //Pegando o id do criador do pet
        //Let ele aceita uma variavel vazia
        let currentUser //Usuario atual
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        //console.log(currentUser)

        //Criando um novo pet
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            UserId: currentUser.id

        })
        try {
            const newPet = await pet.save()
            res.status(201).json({ message: 'Pet Cadastrado com sucesso', newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    //Buscar todos os pets
    static async getAll(req, res) {
        const pets = await Pet.findAll({ order: [['createAt', 'DESC']] })
        res.status(200).json({ pets: pets })
    }
}