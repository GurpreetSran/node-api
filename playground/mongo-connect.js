const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongo bd server ', error);
    }

    console.log('Connected to Mongo DB Server');
    
    db.collection('Todos').insertOne({
        text: 'something',
        completed: false
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert todo', error)
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    
    db.close();
});