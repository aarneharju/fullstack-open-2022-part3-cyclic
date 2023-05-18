require('dotenv').config();
const express = require('express');
// const morgan = require('morgan');
const app = express();
const cors = require('cors');
// const mongoose = require('mongoose');

// Middleware
app.use(express.static('build'));
app.use(cors());
app.use(express.json());

// Add MongoDB
const PhonebookEntry = require('./models/person');

// Set port and start server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Functions

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: `${error.name} - ${error.message}`, // Error name is ValidationError in this case so we use that to check for the correct error message at front end.
    }); // error.message
  }

  next(error);
};

// generate id not needed anymore now that we're using mongodb, leaving here for reference
//const generateID = () => Math.floor(Math.random() * 9999999);

app.get('/api/persons', (request, response, next) => {
  PhonebookEntry.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  PhonebookEntry.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get('/test', (request, response) => {
  response.send('Hello hello. This is the test folder.');
});

app.get('/info', (request, response, next) => {
  PhonebookEntry.countDocuments({}, function (error, count) {
    if (error) {
      next(error);
    } else {
      response.send(
        `<p>Phonebook has info for ${count} people.</p>
        <p>${new Date()}</p>`
      );
    }
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  PhonebookEntry.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  console.log('post: request body - ', { body });

  if (!body.name) {
    const error = new Error('Name is missing.');
    error.name = 'ValidationError';
    throw error;
  }

  if (!body.number) {
    const error = new Error('Number is missing.');
    error.name = 'ValidationError';
    throw error;
  }

  const person = new PhonebookEntry({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  PhonebookEntry.findByIdAndUpdate(
    id, // Query
    { name: body.name, number: body.number }, // Update object
    { new: true, runValidators: true, context: 'query' } // Return the document after update was applied
  )
    .then(updatedEntry => {
      console.log(`Number updated for ${body.name}.`);
      return response.json(updatedEntry);
    })
    .catch(error => next(error));
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// handler of requests with result to errors - this has to be the last loaded middleware.
app.use(errorHandler);
