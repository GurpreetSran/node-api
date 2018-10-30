const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongo bd server ', error);
    }

    console.log('Connected to Mongo DB Server');
    
    db.collection('Todos').find({text: 'something'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch docs')
    });
    
    db.close();
});