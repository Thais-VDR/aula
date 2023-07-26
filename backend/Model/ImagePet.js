//Model/ImagePet.js

//Site stack overflow

const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const Pet = require('./Pet')

const ImagePet = db.define('ImagePet', {
    Image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})
//A imagem pertence a um pet
ImagePet.belongsTo(Pet)
//Um pet tem várias imagens
Pet.hasMany(ImagePet)


module.exports = ImagePet