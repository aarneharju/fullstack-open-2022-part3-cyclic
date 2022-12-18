import axios from 'axios';

// const databaseUrl = 'http://localhost:3001/api/persons';
const baseUrl = '/api/persons';

const getAllPersons = () =>
    axios.get(baseUrl)
        .then(response => response.data)

const addPerson = person =>
    axios.post(baseUrl, person)
        .then(response => {

            return response.data
        })

const updatePerson = (personID, newObject) => {
    return axios.put(`${baseUrl}/${personID}`, newObject)
        .then(response => response.data)
}

const deletePerson = personID => {
    return axios.delete(`${baseUrl}/${personID}`)
}

export default { getAllPersons, addPerson, updatePerson, deletePerson };