const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [
    {
        _id: new ObjectID(),
        text: 'fist todo'
    },
    {
        _id: new ObjectID(),
        text: 'second todo'
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos).then( () => done());
    });
});

describe('post/todos', () => {
    it('should create a new todo', (done) => {
        const text = 'This is coming from testing';
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo with invalid valid data', (done) => {        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
})

describe('GET /todos/:id', () => {
    it('should retun a todo when valid id passed', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 when valid id does not match', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 when invalid id passes', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
})