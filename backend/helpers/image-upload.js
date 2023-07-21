//image-upload.js

const multer = require('multer')//Gerencia imagens
const path = require('path')//Gerenciar o caminho dos arquivos


//Aqui será definido onde os arquivos serão salvos
//O destino das imagens serão definidas aqui

//diskStorage = salva a imagem no seu navegador ou em algum lugar.

//Destino na imagem
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) { //Esse tipo de função é anonima, não precisa de nome para nomea-la.
        let folder = '' //folder é pasta

        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)//Local aonde será enviado a imagem
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))//Vai renomear o arquivo antes de salvar.
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/))//O código está verificando se o nome original do arquivo termina com a extensão.
        {
            return cb(new Error('Por favor, envie apenas jpg ou png'))
        }
        cb(null, true)
    }
})
module.exports =  imageUpload 