require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const Note = require('./models/notes')
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));



app.get('/', (req, res) => {

    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {

    Note.find({})
                .then(note => {
                    res.json(note);
                })
});

app.get('/api/notes/:id', (req, res) => {

    Note.findById(req.params.id).then(note => {

        if (note) {

             res.json(note);
        } else {

            res.status(404).end()
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).send({error:'malformatted id'})
    })
});

app.post('/api/notes', (req, res, next) => {

    const body = req.body;

    if (!body.content) {
        console.log('Content is missing!');
    } else {

        const note = new Note({

            content: body.content,
            important: body.important || false,
        });

        note.save()
                  .then(saveNotes => res.json(saveNotes))
                  .catch((err) => next(err)) 
    }
})

app.put('/api/notes/:id', (req, res) => {

    Note.findById(req.params.id)
                               .then(note => {

                                if (!note) {

                                  return  res.status(404).end();
                                } else {

                                    note.content = content
                                    note.important = important
                                    
                                    return note.save().then (result => {

                                        res.json(result)
                                    }) 

                                }
                               }).catch ((err) => {

                                console.log(err);
                                res.status(400).end();
                                
                               })
})

app.delete('/api/notes/:id', (req, res) => {

    Note.findByIdAndDelete(req.params.id)
                               .then(note => {
                                 if (note) {
                                    res.status(204).end();
                                 } else {
                                    res.status(404).end()
                                 }
                               }).catch ((err) => {
                                 console.log(err);
                                 res.status(400).end();
                                 
                               })
})

morgan.token('type', function (req, res) {

    const data = JSON.stringify(req.body);
    return data;
})

const errorHandle = (err, req, res ,next) => {

    console.log(err.message);
    

    if ( err.name === 'CastError') {

        res.status(400).send({error: 'Malformated id'})
    } else if (err.name === 'ValidationError') {

        res.status(400).send({error: err.message})
    }
    next(err);
}

app.use(errorHandle);

const PORT = process.env.PORT || 3001 ;
app.listen(PORT, () => {
 
     console.log(`Server running on ${PORT}`);
});
