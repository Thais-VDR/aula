//Criar um metodo: POST

const router = require('express').Router()

const UserController = require('../Controllers/UserController')

//Rota para criar "registrar" um usuario
router.post('/register', UserController.register)
//Rota para criar um login
router.post('/login', UserController.login)
//Rota para criar um checamento de usuario
router.get('/checkuser', UserController.checkUser)
//Rota para criar para encontrar o usuario perdido
router.get('/:id', UserController.getUserById)

module.exports = router