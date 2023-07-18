//npm init -y = código que já manda todas as respostas direto
//npm install bcrypt connect-flash cookie-parser cors express express-flash express-session jsonwebtoken multer mysql2 nodemon sequelize session-file-store

const express = require('express')
const cors = require('cors')

const app = express()

const conn = require('./db/conn')

app.use(express.json())

app.use(cors({credentials: true, origin: '*'}))

app.use(express.static('public'))

//Rotas
const UserRoutes = require('./routes/UserRoutes')
//users seria o caminho que será exibido na URL
app.use('/users', UserRoutes)

conn
    .sync()
    .then(() => {
       app.listen(5000)
    })  
    .catch((error) => console.log(error))
    //Quando haver uma requisição na porta 5000