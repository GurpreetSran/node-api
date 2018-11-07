const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
 
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('post/todos', () => {
    it('should create a new todo', (done) => {
        const text = 'This is coming from testing';
        
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
    it('should get all todos for current user', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should retun a todo when valid id passed', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not retun a todo created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 when valid id does not match', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 when invalid id passes', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo by id', (done) => {
        const hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 when valid id does not match', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 when invalid id passes', (done) => {
        request(app)
            .delete('/todos/invalid')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo', (done) => {
        const id = todos[0]._id.toHexString();
        const text = "updated text"

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                    completed: true,
                    text
                })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.completed).toBe(true);
                expect(response.body.todo.text).toBe(text);
                expect(typeof response.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id.toHexString();
        const text = "updated text!!!!"

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                    completed: false,
                    text
                })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });
});


describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((response) => {
                expect(response.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    
    it('should create a user', (done) => {
        const email = 'dummy@test.com';
        const password= 'pass1234';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((response) => {
                expect(response.header['x-auth']).toBeTruthy();
                expect(response.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should not create user if email not in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email, 
                password: 'passwordtest'
            })
            .expect(400)
            .end(done);
    });

    it('should return validation error if request is invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'dfsdf@df', 
                password: '123'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /login/users', () => {
    it('should log user in when credentails are valid', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((response) => {
                expect(response.header['x-auth']).toBeTruthy();
                expect(response.body.email).toBe(users[1].email);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        'access': 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should not log user in when credentails are not valid', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: 'invalid'
            })
            .expect(400)
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on log out', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done();
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                });
            });
    });
});