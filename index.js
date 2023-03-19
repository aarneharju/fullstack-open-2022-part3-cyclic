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

// generate id not needed anymore now that we're using mongodb, leaving here for reference
//const generateID = () => Math.floor(Math.random() * 9999999);

app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => {
      console.log(error);
      response.status(500).end();
    });
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  PhonebookEntry.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' });
    });
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

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  PhonebookEntry.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => {
      console.log(error);
      response.status(500).end();
    });
});

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
