//Tela de não obrigatorio de tal coisa(imagem, email, etc.)
//O controller é algo lógico!!!

const User = require('../Model/User')
const bcrypt = require('bcrypt')//criptografa a senha
const jwt = require('jsonwebtoken')//permite o acesso da senha

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
//const { json } = require('sequelize')

module.exports = class UserController {
    //criar usuario
    static async register(req, res) {
        const { name, email, password, phone, confirmpassword } = req.body
        //validações
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatório' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'O confirma senha é obrigatório' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }

        //criar a senha
        //criar a criptografia
        //Cria uma senha segura
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Checar se o usuario existe
        //Mostra se o usuario foi cadastrado novamente ou não
        const userExists = await User.findOne({ where: { email: email } })

        if (userExists) {
            res.status(422).json({ message: 'Email já cadastrado' })
            return
            //O return vazio quebra a compilação, gera um "break"
        }
        if (password != confirmpassword) {
            res.status(422).json({ message: 'A confirmação está incorreta' })
            return
        }
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            //criando o usuario no banco
            const newUser = await user.save()
            //entregar o token para o novo user
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    //realizar login
    static async login(req, res) {
        const { email, password } = req.body

        //validações do login
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return // relembrando, um return gera um "break" no sistema, parando ele.
        }
        if (!password) {
            res.status(422).json({ message: 'O password é obrigatório' })
            return
        }
        //await o usuario vai ter que aguardar a aceitação/comando.
        const user = await User.findOne({ where: { email: email } })
        //FindOne = comando sql que irá buscar o email correspondente no banco de dados, verificando se ele existe 
        //FindOne = 'Busque um'

        if (!User) {//validação de um usuario não existente, caso tente fazer login com dados não cadastrados
            res.status(422).json({ message: 'Email não encontrado' })
            return
        }

        //Checar se o password é igual a senha do banco
        //O 'Compare' ele compara o password com o atribudo de user.password
        const checkPassword = await bcrypt.compare(password, user.password)//o user.password está pegando no 'const user'

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha incorreta' })
            return
        }

        await createUserToken(user, req, res)
    }
    //O header manda tudo no Token 
    //O body manda tudo no banco de dados

    //Verificar se o usuario está logado
    static async checkUser(req, res) {
        let currentUser 

        if(req.headers.authorization){
            const token = getToken(req)
            //jwt vem da biblioteca

            const decoded = jwt.verify(token,'nossosecret')

            currentUser = await User.findByPk(decoded.id) //findByPk = "Encontrar por chave primaria"(irá buscar pelo Id)
           
            currentUser.password = undefined
            //Por questão de segurança a senha será entregue no front como 'indefinido' para não permitir sua visualização
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){
        const id = req.params.id

        const user = await User.findByPk(id, {
            where: { id: id }
        })

        if(!user){
            res.status(422).json({message: 'Usuario não encontrado'})
            return
        }

        user.password = undefined

        res.status(200).json({ user })
    }
}