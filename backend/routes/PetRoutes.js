//PetRoutes.js

const router =  require('express').Router()
const PetController = require('../Controllers/PetController')

//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//Rotas privadas = Vc não está logado
//Cadastrar um pet
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)

//Rotas publicas = Vc está logado
router.get('/', PetController.getAll)//Vai puxar todos os pets
module.exports = router