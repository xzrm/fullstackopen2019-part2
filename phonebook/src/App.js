import React, { useState, useEffect } from 'react'
import personService from './services/ppl'
import Person from './components/person'
import Notification from './components/notification'
import PersonForm from './components/personForm'
import './index.css'



const App = (props) => {

  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ "name": "", "number": "" })
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [className, setClassName] = useState('notification')


  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .del(id)
      setPersons(persons.filter(person => person.id !== id))
    }
  }


  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      id: persons.length + 1, //poor practise
      name: newPerson.name,
      number: newPerson.number,
    }


    if (newPersonObject.name.length === 0) { return }

    if (persons.filter(person =>
      person.name === newPersonObject.name).length === 0) {

      personService
        .create(newPersonObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setClassName('notification')
          setMessage(`Added ${newPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setClassName('error')
          setMessage(`Something went wrong: ${error.response.data.error}`)
          console.log(error.response)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    } else {
      if (window.confirm(`${newPersonObject.name} is already added to phonebook, 
      replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newPersonObject.name)
        const updatedPerson = { ...person, number: newPersonObject.number }
        personService
          .update(person.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.name !== newPersonObject.name
                ? person
                : returnedPerson))

            setClassName('notification')
            setMessage(`Upadated ${newPersonObject.name}`)

            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(err => {
            setClassName('error')
            setMessage(`${newPersonObject.name} was already removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(person =>
              person.name !== newPersonObject.name))
          })
      }
    }
    setNewPerson({ "name": "", "number": "" })
  }

  const handleNameChange = (event) => {
    setNewPerson({
      ...newPerson,
      "name": event.target.value
    })
  }

  const handleNumberChange = (event) => {
    setNewPerson({
      ...newPerson,
      "number": event.target.value
    })
  }

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(persons =>
        setPersons(persons))
      .catch(err => console.log("Could not GET data; ", err))
  }, [])


  const filterPersons = (query) => {
    return persons.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()))
  }

  const peopleToShow = query === ""
    ? persons
    : filterPersons(query)

  return (
    <div>
      <h2>My phonebook</h2>
      <Notification message={message} className={className} />

      <div>
        filter shown with: <input value={query} onChange={handleQueryChange} />
      </div>

      <h2>add a new</h2>
      <PersonForm person={newPerson}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <div>
        {peopleToShow.map(person =>
          <Person
            key={person.id}
            person={person}
            deletePerson={() => deletePerson(person.name, person.id)}
          />
        )}
      </div>

    </div>
  )
}

export default App