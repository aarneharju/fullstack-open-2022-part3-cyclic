const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

// const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`;
const url = `mongodb+srv://Aarne:${password}@cluster0.pnfyaog.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookSchema);

if (process.argv[3] && process.argv[4]) {

  const phonebookEntry = new PhonebookEntry({
    name: process.argv[3],
    number: process.argv[4],
  });

  phonebookEntry.save().then(result => {
    console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook.`);
    mongoose.connection.close();
  });
} else {
  PhonebookEntry
    .find({})
    .then(result => {
      console.log('Phonebook:');
      result.forEach(entry => {
        console.log(`${entry.name} ${entry.number}`);
      });
      mongoose.connection.close();
    })

}




