//Input Group

//import Styles from './inputGroup.module.css'
//HandleChange é um evento, em que ele vai escutar a digitação de uma letra.
// toda vez que for lidar com eventos utilizar handle
function InputGroup({ label, placeholder, type, name, handleChange, value }) { 
    return (
        <div className='mb-3 input-group'>
            <label className='input-group-text'>{label}</label>   
            <input 
            type={type} 
            placeholder={placeholder} 
            className='form-control' 
            name={name} 
            onChange={handleChange} 
            value={value} 
            />
        </div>
    )
}

export default InputGroup
