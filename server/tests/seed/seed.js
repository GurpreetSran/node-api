const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const todos = [
    {
        _id: new ObjectID(),
        text: 'fist todo from automated test',
        _creator: user1Id
    },
    {
        _id: new ObjectID(),
        text: 'second todo from automated test',
        completed: true,
        completedAt: 333,
        _creator: user2Id
    }
];

const users = [{
        _id: user1Id,
        email: 'automated_test@test.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: user1Id, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: user2Id,
        email: 'jen@example.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: user2Id, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    }];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne], [userTwo]);
    }).then(() => done());
}

module.exports = {
    todos, 
    users,
    populateTodos,
    populateUsers
}