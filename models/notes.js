const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

console.log('connecting to', url);

mongoose.connect(url)
                    .then(() => {

                        console.log('connection establisted');
                    }) 
                    .catch((err) => {
                        console.error(err.message);
                    })

const noteSchema = mongoose.Schema({

    content: {
        type: String,
        minLength: 5,
        required: true,
    },
    important: Boolean,
});

noteSchema.set('toJSON', {

    transform: (document, return_object) => {
        return_object.id = return_object._id.toString();
        delete return_object._id;
        delete return_object.__v;
    }
});

module.exports = mongoose.model('Note', noteSchema);
