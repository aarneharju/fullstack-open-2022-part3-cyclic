const { request } = require('express');
const express = require('express');
// const morgan = require('morgan');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');

app.use(express.static('build'));
app.use(cors());

// app.use(morgan('tiny'));
// app.use(
//   morgan(
//     ':method :url :status :res[content-length] - :response-time ms :param[id]'
//   )
// );

// morgan.token('param', function (req, res, param) {
//   return req.params[param];
// });

app.use(express.json());

const url = `mongodb+srv://Aarne:${password}@cluster0.pnfyaog.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookSchema);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

//Functions
const generateID = () => Math.floor(Math.random() * 9999999);

app.get('/api/persons', (request, response) => {
  PhonebookEntry
  .find({})
  .then(persons => {
      response.json(persons);
    }
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/test', (request, response) => {
  response.send('Hello hello. This is the test folder.');
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`
  );
  response.send(``);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log(body);

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

  if (persons.filter(person => person.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'Name already exists in phonebook.',
    });
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(persons);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
