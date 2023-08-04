//Input Group

//import Styles from './inputGroup.module.css'

function InputGroup({ label, placeholder, type, name, handleChange }) { //HandleChange é um evento, em que ele vai escutar a digitação de uma letra.
    return (
        <div className='mb-3 input-group'>
            <label className='input-group-text'>{label}</label>
            // toda vez que for lidar com eventos utilizar handle
            <input type={type} placeholder={placeholder} className='form-control' name={name} onChange={handleChange} />
        </div>
    )
}

export default InputGroup
