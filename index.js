const morgan = require('morgan');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));

let notes = [

    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

app.get('/', (req, res) => {

    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {

    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {

    const id = req.params.id;
    const note = notes.find((note) => note.id === id);
    
    if (note) {

        res.json(note);
    } else {

        res.status(404).end();
    }
});

const getId = () => {

    const maxId = notes.length > 0 
                  ? Math.max(...notes.map((n) => n.id))
                  : 0;
    return String(maxId + 1);
}

app.post('/api/notes', (req, res) => {

    const body = req.body;
     
    if ( !body.content ) {

        res.status(400).json({
            error: 'Content is missing'
            
        })
    } else {

    const note = {

        content: body.content,
        important: body.important || false,
        id: getId(),
    }
    notes = notes.concat(note);
    console.log(note);
    res.json(note);
 }
})

app.delete('/api/notes/:id', (req, res) => {

    const id = req.params.id;
    notes = notes.filter((note) => note.id !== id);

    res.status(204).end();
});

morgan.token('type', function (req, res) {

    const data = JSON.stringify(req.body);
    return data;
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
 
     console.log(`Server running on ${PORT}`);
});
