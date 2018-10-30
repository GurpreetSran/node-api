const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to mongo bd server ', error);
    }

    console.log('Connected to Mongo DB Server');
    
    db.collection('Todos').deleteMany({completed: true}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log('Unable to delete docs')
    });
    
    db.close();
});