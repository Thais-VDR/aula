//helpers/get-token.js

const getToken = (req) =>{
    //Aqui eu recebo os dados do header da requisição
    const authHeader = req.headers.authorization 
    //Aqui eu separo o token do restante do header
    const token = authHeader.split(' ')[1] // o espaço irá separar os campos no vetor, Por padrão o token esta na posição 1 no navegador

    return token

}

module.exports = getToken