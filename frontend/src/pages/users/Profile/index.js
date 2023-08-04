//Profile/index.js
import React, { useState, useEffect } from 'react'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import InputGroup from '../../../components/InputGroup'

function Profile() {

    const [user, setUser] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()

    useEffect(() => {

        if (!token) {
            alert('Por favor faça login')
            navigate('/login')
        } else {
            api.get('/users/checkuser', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
                .then((response) => {
                    setUser(response, data)
                })
        }
    }, [token, navigate])

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    //Alterando estado da imagem
    const [image, setImage] = useState(null)

    function onFileChange(e) {
        setPreview(URL.createObjectURL(e.target.files[0]))
        setImage(e.target.files[0])
    }

    async function handleChange(e) {
        e.preventDefault()
        //Adiciona imagem ao formData (se ela existir)
        const formData = new FormData()
        if (image) {
            formData.append('image', image)
        }
        await Object.keys(user).forEach((key) => formData.append(key, user[key]))

        const data = await api.patch(`/users/edit/${user.id}`, formData, {
            headers : {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            return response.data
        })
        .catch((err) => {
            alert(data.message)
            return err.response.message
        })
        alert(data.message)

    }

    return (
        <div className='container'>
        <h2>Profile</h2>
        <img
        style={{}}
        src={api + '/images/users' + user.image}
        alt='Foto de perfil'
        />
        </div>
    )
}

export default Profile
