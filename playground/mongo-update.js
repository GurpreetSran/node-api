const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongo bd server ', error);
    }

    console.log('Connected to Mongo DB Server');
    
    db.collection('Todos').findOneAndUpdate({
        text: 'walk a dog'
    },
    {
        $set: {
            completed: true
        }
    },
    {
        returnOriginal: false
    }).then( (result) => {
        console.log(result);
    })
    
    db.close();
});