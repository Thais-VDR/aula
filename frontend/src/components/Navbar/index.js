import React, { useContext } from 'react'
import { Link } from "react-router-dom"
//Contexto
import { Context } from '../../context/UserContext'


function Navbar() {
    const { authenticated, logout } = useContext(Context)
    return (
        <nav className='navbar bg-warning'>
            <div className='container'>
                <Link className='navbar-brand'>Logo</Link>
                <div>
                    <ul className='navbar nav'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/'>Home</Link>
                        </li>
                        {!authenticated ? ( //É um IF ELSE, se ele tiver autenticado alguma coisa, vai aparecer algo ou acontecer algo.
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/register'>Registrar</Link>
                                </li>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/login'>Login</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='nav-item'>
                                    <Link className='nav-link' to='/user/profile'>Perfil</Link>
                                </li>
                                <li className="nav-item"><Link className='nav-link' to='/'>Sair</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;