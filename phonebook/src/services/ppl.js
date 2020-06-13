import axios from 'axios'

/* for the static build of the front end in part 3 
baseUrl should be const baseUrl = 'api/persons'
*/

const baseUrl = 'persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const del = (id) => {
  axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, del }