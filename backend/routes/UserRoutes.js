//Criar um metodo: POST

const router = require('express').Router()

const UserController = require('../Controllers/UserController')

//Rota para criar "registrar" um usuario
router.post('/register', UserController.register)
//Rota para criar um login
router.post('/login', UserController.login)

module.exports = router