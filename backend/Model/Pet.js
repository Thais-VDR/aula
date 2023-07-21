const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = require('../Model/User')

const Pet = db.define('Pet' , {
    name:{
        type: DataTypes.STRING,//DataTypes é falar se é string, integer, float, etc.
        allowNull: false //AllowNull é quando se é obrigatorio escrever aquilo.
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight:{
        type:DataTypes.FLOAT,
        allowNull: false
    },
    color:{
        type:DataTypes.STRING,
        allowNull: false
    },
    available:{
        type:DataTypes.BOOLEAN,
        allowNull: false
    },
    adopter:{
        type:DataTypes.INTEGER,
        allowNull: true
    }
})
//Um Pet pertence a um usuario.
Pet.belongsTo(User)
//Um User pertence a um pet.
User.hasMany(Pet)

module.exports = Pet