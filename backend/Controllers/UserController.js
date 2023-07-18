//Tela de não obrigatorio de tal coisa(imagem, email, etc.)
//O controller é algo lógico!!!

const User = require('../Model/User')
const bcrypt = require('bcrypt')//criptografa a senha
const jwt = require('jsonwebtoken')//permite o acesso da senha

//helpers
const createUserToken = require('../helpers/create-user-token')

module.exports = class UserController{
    //criar usuario
    static async register(req,res){
        const{name,email,password,phone,confirmpassword} = req.body
        //validações
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatório'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'O confirma senha é obrigatório'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }

        //criar a senha
        //criar a criptografia
        //Cria uma senha segura
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Checar se o usuario existe
        //Mostra se o usuario foi cadastrado novamente ou não
        const userExists = await User.findOne({where: {email: email}})
        
        if(userExists){
            res.status(422).json({message: 'Email já cadastrado'})
            return
           //O return vazio quebra a compilação, gera um "break"
        } 
         if(password != confirmpassword){
            res.status(422).json({message: 'A confirmação está incorreta'})
            return
        }
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try{
          //criando o usuario no banco
          const newUser = await user.save()
          //entregar o token para o novo user
          await createUserToken(newUser, req, res)
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
}