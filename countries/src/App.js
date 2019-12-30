import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './Components/Country'



const filterObj = (listObj, query) => {
  const foundObj = []
  for (var i = 0; i < listObj.length; i++) {
    if ((listObj[i].name.toLowerCase().includes(query))
      && (query !== "")) {
      foundObj.push(listObj[i])
    }
  }
  console.log(foundObj)
  return (foundObj)
}

const App = (props) => {

  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [foundCountries, setFoundCountries] = useState([])

  const showCountry = (country) => {
    setFoundCountries([country])
    displayCountry()
  }


  const displayCountry = () => {
    foundCountries.map(obj => console.log(obj.name))
    if (foundCountries.length > 10) {
      return ('Too many matches, specify another filter')
    } else if (foundCountries.length === 1) {
      return <Country country={foundCountries[0]} />
    } else {
      return (
        foundCountries.map(country =>
          <div key={country.name}> {country.name}
            <button onClick={() => showCountry(country)}>show</button></div>
        ))
    }
  }


  const handleFilter = (event) => {
    setQuery(event.target.value)
    setFoundCountries(filterObj(countries, event.target.value))
    console.log('------------------------------------')
  }

  useEffect(() => {
    console.log('effect')

    const eventHandler = response => {
      console.log('promise fulfilled')
      setCountries(response.data)
    }

    const promise = axios.get('https://restcountries.eu/rest/v2/all')
    promise.then(eventHandler)
  }, [])



  return (
    <div>
      <div>
        filter shown with: <input value={query} onChange={handleFilter} />
      </div>
      <div>
        {displayCountry()}
      </div>
    </div>
  )
}


export default App