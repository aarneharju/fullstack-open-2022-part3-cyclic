import axios from 'axios';

const databaseUrl = 'http://localhost:3001/api/persons';

const getAllPersons = () =>
    axios.get(databaseUrl)
        .then(response => response.data)

const addPerson = person =>
    axios.post(databaseUrl, person)
        .then(response => {

            return response.data
        })

const updatePerson = (personID, newObject) => {
    return axios.put(`${databaseUrl}/${personID}`, newObject)
        .then(response => response.data)
}

const deletePerson = personID => {
    return axios.delete(`${databaseUrl}/${personID}`)
}

export default { getAllPersons, addPerson, updatePerson, deletePerson };