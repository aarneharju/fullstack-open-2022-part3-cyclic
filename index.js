require('dotenv').config();
const { request } = require('express');
const express = require('express');
// const morgan = require('morgan');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Middleware
app.use(express.static('build'));
app.use(cors());
app.use(express.json());

const PhonebookEntry = require('./models/person');

// Functions
const generateID = () => Math.floor(Math.random() * 9999999);

app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  PhonebookEntry.findById(id).then(person => response.json(person));
});

app.get('/test', (request, response) => {
  response.send('Hello hello. This is the test folder.');
});

/* implement later for database version

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`
  );
  response.send(``);
});
 */

/* implement later for database version

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});
*/

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log('post: request body - ', { body });

  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing.',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing.',
    });
  }

  /* implement later for database version

  if (persons.filter(person => person.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'Name already exists in phonebook.',
    });
  }
  */

  const person = new PhonebookEntry({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
