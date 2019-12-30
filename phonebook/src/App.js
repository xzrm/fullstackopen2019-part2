import React, { useState, useEffect } from 'react'
import personService from './services/ppl'
import Person from './components/person'
import './index.css'


const includesName = (listObj, name) => {
  for (var i = 0; i < listObj.length; i++) {
    if (listObj[i].name === name) {
      return true
    }
  } return false
}

const filteredNames = (listObj, searchedPhrase) => {
  const foundObj = []
  for (var i = 0; i < listObj.length; i++) {
    if ((listObj[i].name.toLowerCase().includes(searchedPhrase.toLowerCase()))
      && (searchedPhrase !== "")) {
      foundObj.push(listObj[i])
    }
  }
  return (foundObj)
}

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={className}>
      {message}
    </div>
  )
}


const App = (props) => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [phrase, setPhrase] = useState('')
  const [foundNames, setFoundNames] = useState([])
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState('notification')


  const peopleToShow = phrase === ""
    ? persons
    : foundNames

  const delPerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .del(id)
      setPersons(persons.filter(person => person.id !== id))
    }

  }

  const displayPerson = () => peopleToShow.map(person =>
    <Person
      key={person.id}
      person={person}
      deletePerson={() => delPerson(person.name, person.id)}
    />
  )

  const validateName = (PersonObject) => {
    if (PersonObject.name.length === 0) {
      console.log('zero length name')
      return true
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      id: persons.length + 1,
      number: newNumber
    }

    if (validateName(newPersonObject)) {
      return
    }

    if (!includesName(persons, newPersonObject.name)) {
      personService
        .create(newPersonObject)
        .then(() => {
          setPersons(persons.concat(newPersonObject))
          setNewName('')
          setNewNumber('')
          setClassName('notification')
          setMessage(`Added ${newPersonObject.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setClassName('error')
          setMessage(`${error.response.data.error}`)
          console.log(error.response)

          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    } else {
      if (window.confirm(`${newPersonObject.name} is already added to phonebook, 
      replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newPersonObject.name)
        const changePerson = { ...person, number: newPersonObject.number }
        personService
          .update(person.id, changePerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.name !== newPersonObject.name ? person : returnedPerson))

            setClassName('notification')
            setMessage(`Upadated ${newPersonObject.name}`)

            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setClassName('error')
            setMessage(`${newPersonObject.name} was already removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(person =>
              person.name !== newPersonObject.name))
          })

        setNewName('')
        setNewNumber('')
      }
    }

  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setPhrase(event.target.value)
    foundNames.map(obj => console.log(obj.name, obj.number))
    setFoundNames(filteredNames(persons, event.target.value))
  }

  useEffect(() => {
    personService
      .getAll()
      .then(persons =>
        setPersons(persons))
  }, [])

  return (
    <div>
      <h2>My phonebook</h2>
      <Notification message={message} className={className} />

      <div>
        filter shown with: <input value={phrase} onChange={handleFilter} />
      </div>

      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} name='newName' />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} name='newNumber' />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {displayPerson()}
      </div>

    </div>
  )
}

export default App