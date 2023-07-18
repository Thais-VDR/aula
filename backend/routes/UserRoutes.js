//Criar um metodo: POST

const router = require('express').Router()

const UserController = require('../Controllers/UserController')

//Rota para criar "registrar" um usuario
router.post('/register', UserController.register)

module.exports = router