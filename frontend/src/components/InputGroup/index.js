//Input Group

import Styles from './inputGroup.module.css'

function InputGroup({ label, placeholder, type }) {
    return (
        <div className='mb-3'>
            <label className='input-group-text'>{label}</label>
            <input type={type} placeholder={placeholder} className='form-control' />
        </div>
    )
}

export default InputGroup
