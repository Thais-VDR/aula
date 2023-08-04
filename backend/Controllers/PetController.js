//PetController.js
const Pet = require('../Model/Pet')
const User = require('../Model/User')
const ImagePet = require('../Model/ImagePet')
//bibliotecas
const jwt = require('jsonwebtoken')
const { json } = require('sequelize')

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
        const pets = await Pet.findAll({ order: [['createdAt', 'DESC']] })
        res.status(200).json({ pets: pets })
    }
    //Buscar pets cadastrados pelo usuario
    static async getAllUserPets(req, res) {
        //verificar o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)//Releembrando: findBypk = chave primaria que seria o 'deconded.id'
        currentUser.password = undefined
        //Pegamos o ID do user logado
        const currentUserId = currentUser.id

        const pets = await Pet.findAll({
            where: { UserId: currentUserId },
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({ pets })
    }
    //Buscar Pet por ID
    static async getPetById(req, res) {
        //Buscar id da URL
        const id = req.params.id

        //NaN <----------- Not a Number
        if (isNaN(id)) {//Se o ID NÂOOOO for um número
            res.status(422).json({ message: 'ID invalido' })
            return
        }
        //get pet by id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }
        res.status(200).json({ pet: pet })
    }
    static async removePetById(req, res) {
        //Buscar id da URL
        const id = req.params.id

        //NaN <----------- Not a Number
        if (isNaN(id)) {//Se o ID NÂOOOO for um número
            res.status(422).json({ message: 'ID invalido' })
            return
        }
        //get pet by id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(422).json({ message: 'Pet não existe' })
            return
        }

        //verificar o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)//Releembrando: findBypk = chave primaria que seria o 'deconded.id'
        currentUser.password = undefined
        //Pegamos o ID do user logado
        const currentUserId = currentUser.id

        if (Number(pet.UserId) !== Number(currentUserId)) {
            res.status(422).json({ message: 'Id invalido' })
            return
        }
        await Pet.destroy({ where: { id: id } })
        res.status(200).json({ message: 'Pet destruido com sucesso' })

    }
    //Editar Pet
    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color } = req.body

        const updatePet = {}
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe' })
            return
        }
        //Pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'ID invalido' })
            return
        }

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
        } else {
            updatePet.name = name //O nome que cair, vai armazenar no updatePet."name"
        }
        if (!age) {
            res.status(422).json({ message: 'O age é obrigatório' })
        } else {
            updatePet.age = age //O ano que cair, vai armazenar no updatePet."age"
        }
        if (!weight) {
            res.status(422).json({ message: 'O weight é obrigatório' })
        } else {
            updatePet.weight = weight //O peso que cair, vai armazenar no updatePet."weight"
        }
        if (!color) {
            res.status(422).json({ message: 'O color é obrigatório' })
        } else {
            updatePet.color = color//A cor que cair, vai armazenar no updatePet."color"
        }
        //Trabalhar com as imagens
        const images = req.files
        if (!images || images.length === 0) {
            res.status(422).json({ message: 'As imagens são obrigatorias' })
            return
        }
        //Atualizar as imagens do pet
        const imageFilename = images.map((image) => image.filename)//filename = nome do arquivo.
        //Remover imagens antigas
        await ImagePet.destroy({ where: { PetId: pet.id } })
        //Adicionar novas imagens
        for (let i = 0; i < imageFilename.length; i++) {
            const filename = imageFilename[i]
            const newImagePet = new ImagePet({ image: filename, PetId: pet.id })
            await newImagePet.save()
        }

        await Pet.update(updatePet, { where: { id: id } })
        res.status(200).json({ message: 'Pet atualizado com sucesso' })
    }
    //Agendamento de Pet
    static async schedule(req, res) {
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe' })
            return
        }
        //Pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId === currentUser.id) {
            res.status(422).json({ message: 'O pet já é seu' })
            return
        }

        //Checar se o usuario já agendou a visita
        if (pet.adopter) {
            if (pet.adopter === currentUser.id) {
                res.status(422).json({ message: 'Você já agendou uma visita' })
            }
        }
        pet.adopter = currentUser.id
        //Manda para o banco 
        await pet.save()
        res.status(200).json({ message: 'Pet adotado com sucesso' })

    }
    static async concludeAdoption(req, res) {
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe' })
            return
        }
        //Pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'ID invalido' })
            return
        }
        //Pet não disponivel
        pet.available = false
        await pet.save()
        res.status(200).json({ message: 'Adoção concluida!!!' })
    }
    static async getAllUserAdoptions(req, res) {
        //Pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        const pets = await Pet.findAll({
            where: { adopter: currentUser.id },
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({ pets })
    }
}