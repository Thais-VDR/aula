import React, { useState, useEffect } from 'react'

import api from '../../../utils/api'
import { Link } from 'react-router-dom'


function MyAdoptions() {
    const [pets, setPets] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`pets/myadoptions`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response) => {
            setPets(response.data.pets)
        })

    }, [token])

    return (
        <div>
            <div><h3>Minhas adoções</h3></div>
            <div>
             {pets.length > 0 &&
             pets.map((pet) => (
             <div>
             <img 
             src={`http://localhost:5000/image/pets/${imagePet.images[0]}`}
             alt={pet.name}
             />
             <span>{pet.name}</span>
              <div>
                <p>Ligue para: {pet.user.phone}</p>
                <p>Fale com: {pet.user.name}</p>
              </div>
              <div>
                {pet.available ? (
                   <p>adoção em processo</p>
                ) : (
                   <p>Parabens por concluir a adocao</p> 
                )}
              </div>
             </div>
             ))}
             {pets.length === 0 && <p>Ainda nao ha pets adotados!!!</p>}
            </div>
        </div>
    )
}

export default MyAdoptions