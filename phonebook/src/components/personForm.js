import React from 'react'

const PersonForm = ({ person, addPerson, handleNameChange, handleNumberChange}) => {

  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={person.name} onChange={handleNameChange} name='newName' />
        </div>
        <div>
          number: <input value={person.number} onChange={handleNumberChange} name='newNumber' />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}


export default PersonForm