const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const { username } = request.headers

  const userexist = users.find(user => user.username == username)

  if (!userexist) {
    return response.status(404).json({
      "error": "user not exist"
    })
  }

  request.user = userexist

  next()
}

app.post('/users', (request, response) => {
  // Complete aqui

  const { name, username } = request.body

  const userexist = users.find(user => username === user.username)


  if (userexist) {
    return response.status(400).json({
      "error": "user already exists"
    })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const user = request.user

  const todos = user.todos

  return response.status(200).json(todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user

  const { title, deadline } = request.body

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user

  const { title, deadline } = request.body

  const { id } = request.params

  const todo = user.todos.find(todo => todo.id == id)

  if (!todo) {
    return response.status(404).json({
      "error": "todo does not exists"
    })
  }

  Object.assign(todo, {
    title: title,
    deadline: new Date(deadline)
  })

  return response.json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const user = request.user

  const { id } = request.params

  const todo = user.todos.find(todo => todo.id == id)

  if (!todo) {
    return response.status(404).json({
      "error": "todo does not exists"
    })
  }

  Object.assign(todo, {
    done: true
  })

  return response.json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const user = request.user

  const { id } = request.params

  const todo = user.todos.find(todo => todo.id == id)

  if (!todo) {
    return response.status(404).json({
      "error": "todo does not exists"
    })
  }

  const todos = user.todos.filter(todo => todo.id != id)

  user.todos = todos

  return response.status(204).json(todos)


});

module.exports = app;