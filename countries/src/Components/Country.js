import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => {
    const [weather, setWeather] = useState(null)
  
    const fetchWeather = () => {
    
    const eventHandler = result => {
      setWeather(result.data)
    }
  
    const city = country.capital
    const url = 'http://api.weatherstack.com/current?access_key=7f8e4133a8e1d53a24495384d0948907&query=' + city
    const promise = axios.get(url)
    console.log(promise)
    promise.then(eventHandler)
    
    }
  
    useEffect(fetchWeather, [country])
  
    const showWeather = () => {
      if (weather) {
        return (
          <div>
            <h3>Weather in {country.capital}</h3>
            <div>
              <strong>Temperature</strong> {weather.current.temperature} Celsius
            </div>
            <div>
              <img src={weather.current.weather_icons[0]} alt={weather.current.weather_descriptions[0]} />
            </div>
            <div>
              <strong>wind: </strong>{weather.current.wind_speed} kph direction {weather.current.wind_dir}
            </div>
          </div>
        )
      }
      return null
    }
      return ([
      <h2>{country.name}</h2>,
      <div>capital {country.capital}</div>,
      <div>population {country.population}</div>,
      <h3>languages</h3>,
      <ul>{country.languages.map(language => <li>{language.name}</li>)}</ul>,
      <div><img src={country.flag} width="128" height="128"/></div>,
      showWeather()
    ])
  }


export default Country