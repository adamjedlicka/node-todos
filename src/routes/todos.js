import express from 'express'
import { sendDeleteToAllConnections, sendTodosToAllConnections, sendTodoToAllConnections } from '../websockets.js'
import { createTodo, deleteTodo, getTodoById, updateTodo } from '../db/todos.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  const text = String(req.body.text)

  await createTodo(
    { text },
    {
      fetchFreshTodo: false,
    }
  )

  sendTodosToAllConnections()

  res.redirect('/')
})

router.get('/toggle/:id', async (req, res, next) => {
  const id = Number(req.params.id)

  const todo = await getTodoById(id)

  if (!todo) return next()

  await updateTodo({ ...todo, done: !todo.done })

  sendTodosToAllConnections()
  sendTodoToAllConnections(id)

  res.redirect('back')
})

router.get('/delete/:id', async (req, res, next) => {
  const id = Number(req.params.id)

  const todo = await getTodoById(id)

  if (!todo) return next()

  await deleteTodo(todo)

  sendTodosToAllConnections()
  sendDeleteToAllConnections(id)

  res.redirect('/')
})

router.get('/detail/:id', async (req, res, next) => {
  const id = Number(req.params.id)

  const todo = await getTodoById(id)

  if (!todo) return next()

  res.render('detail', {
    todo,
  })
})

router.post('/edit/:id', async (req, res, next) => {
  const id = Number(req.params.id)
  const text = String(req.body.text)

  const todo = await getTodoById(id)

  if (!todo) return next()

  todo.text = text
  await updateTodo(todo)

  sendTodosToAllConnections()
  sendTodoToAllConnections(id)

  res.redirect('back')
})

export default router
