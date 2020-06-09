import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './Components/Country'


const App = (props) => {

  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [foundCountries, setFoundCountries] = useState([])


  const showSingleCountry = (country) => {
    setFoundCountries([country])
  }


  const handleQuery = (event) => {
    setQuery(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      }).catch(error => console.log(error))
  }, [])

  useEffect(() => {
    console.log("query", query)
    setFoundCountries(countries.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase())))
  }, [query])


  return (

    <div>
      <div>
        filter shown with: <input value={query} onChange={handleQuery} />
      </div>
      <div>
        {foundCountries.length > 10 &&
          <p>Too many matches, specify another filter</p>
        }
        {
          foundCountries.length === 1 && <Country country={foundCountries[0]} />
        }
        {foundCountries.length > 1 && foundCountries.length < 10
          && <div>
            {foundCountries.map(country =>
              <div key={country.name}> {country.name}
                <button onClick={() => showSingleCountry(country)}>show</button>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  )
}



export default App