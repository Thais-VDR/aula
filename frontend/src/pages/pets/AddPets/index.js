import React, { useState } from 'react'
import InputGroup from '../../../components/InputGroup'
import api from '../../../utils/api'
// onFileChange = Lidar com arquivos de fotos
//handleChange = Lidar com os textos

function AddPet() {
    const [pet, setPet] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem('token') || '')

    function handleChange(e) {
        setPet({ ...pet, [e.target.name]: e.target.value })
    }
    const [images, setImage] = useState(null)
    function onFileChange(e) {
        setPreview(URL.createObjectURL(e.target.files[0]))
        setImage(e.target.files[0])
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData()

        if (images) {
            formData.append('images', images)
        }

        //montando objeto com o formulario
        await Object.keys(pet).forEach((key) => formData.append(key, pet[key]))

        const data = await api.post(`pets/create`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data
        }).catch((err) => {
            alert(err.response.data)
            return err.response.data
        })
        alert(data.message)
    }

    return (
        <div>
            <h3>Cadastre um Pet para adoção</h3>
            <form onSubmit={handleSubmit}>
                <InputGroup
                    type='file'
                    label='Colocar foto do dog'
                    name='images'
                    handleChange={onFileChange}
                />
                <InputGroup
                    type='text'
                    label='Digite o nome do dog'
                    name='name'
                    placeholder='Digite o nome do cachorro'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='number'
                    label='Digite a idade do dog'
                    name='age'
                    placeholder='Digite a idade do cachorro'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='number'
                    label='Digite o peso'
                    name='weight'
                    placeholder='Digite o peso do cachorro'
                    handleChange={handleChange}
                />
                <InputGroup
                    type='text'
                    label='Digite a cor'
                    name='color'
                    placeholder='Digite a cor'
                    handleChange={handleChange}
                />
                <button type='submit'>Cadastrar</button>
            </form>
        </div>
    )
}

export default AddPet