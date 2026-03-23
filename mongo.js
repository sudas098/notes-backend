const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sd544597_db_user:${password}@cluster0.qaoi38l.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

// 1. Define Schema and Model at the top level (global scope)
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// 2. Connect and perform operations
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')

    // OPTION A: To FETCH and display all notes (Current behavior)
    return Note.find({})
  })
  .then(notes => {
    notes.forEach(note => {
      console.log(note)
    })
    return mongoose.connection.close()
  })
  .catch((err) => console.log('Error:', err.message))