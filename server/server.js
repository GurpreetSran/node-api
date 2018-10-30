const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

const newTodo = new Todo({
    text: 'valid schema'
});

const newUser = new User({
    email: 'zoxhere@yahoo.com'
});

newTodo.save().then((doc) => {
    console.log('Saved todo ', doc);
}, (error) => {
    console.log('Saving todo error ', error);
});


newUser.save().then((doc) => {
    console.log('Saved user ', doc);
}, (error) => {
    console.log('Saving user error ', error);
});