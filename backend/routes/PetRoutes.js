//PetRoutes.js

const router =  require('express').Router()
const PetController = require('../Controllers/PetController')

//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//Rotas privadas = Vc não está logado
//Cadastrar um pet
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)

//Mostrar pets do usuario logado
router.get('/mypets', verifyToken, PetController.getAllUserPets)
//Deletar um pet pelo ID
router.delete('/:id', verifyToken, PetController.removePetById)
//Editar Pet
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
//Agendar Pet
router.patch('schedule/:id', verifyToken, PetController.schedule)
//Adotar
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)
//Pet adotados pelo user
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)

//Rotas publicas = Vc está logado
//Listar todos os pets
router.get('/', PetController.getAll)//Vai puxar todos os pets
//Listar pet por ID
router.get('/:id', PetController.getPetById)

module.exports = router