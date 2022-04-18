import express from 'express'
import cookieParser from 'cookie-parser'
import db, { createUser, getUserByToken } from './db.js'
import { sendDeleteToAllConnections, sendTodosToAllConnections, sendTodoToAllConnections } from './websockets.js'

export const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(async (req, res, next) => {
  const myToken = req.cookies.token

  if (myToken) {
    res.locals.user = await getUserByToken(myToken)
  } else {
    res.locals.user = null
  }

  next()
})

app.get('/', async (req, res, next) => {
  const query = db('todos').select('*')

  if (req.query.done) {
    query.where('done', req.query.done === 'true')
  }

  if (req.query.search) {
    query.whereLike('text', `%${req.query.search}%`)
  }

  const todos = await query

  res.render('index', {
    title: 'ToDos!',
    todos,
  })
})

app.post('/add', async (req, res) => {
  const text = String(req.body.text)

  await db('todos').insert({
    text,
  })

  sendTodosToAllConnections()

  res.redirect('/')
})

app.get('/toggle/:id', async (req, res, next) => {
  const id = Number(req.params.id)

  const todo = await db('todos').select('*').where('id', id).first()

  if (!todo) return next()

  await db('todos').update({ done: !todo.done }).where('id', id)

  sendTodosToAllConnections()
  sendTodoToAllConnections(id)

  res.redirect('back')
})

app.get('/delete/:id', async (req, res, next) => {
  const id = Number(req.params.id)

  const todo = await db('todos').select('*').where('id', id).first()

  if (!todo) return next()

  await db('todos').delete().where('id', id)

  sendTodosToAllConnections()
  sendDeleteToAllConnections(id)

  res.redirect('/')
})

app.get('/detail/:id', async (req, res, next) => {
  const id = Number(req.params.id)

  const todo = await db('todos').select('*').where('id', id).first()

  if (!todo) return next()

  res.render('detail', {
    todo,
  })
})

app.post('/edit/:id', async (req, res, next) => {
  const id = Number(req.params.id)
  const text = String(req.body.text)

  const todo = await db('todos').select('*').where('id', id).first()

  if (!todo) return next()

  await db('todos').update({ text }).where('id', id)

  sendTodosToAllConnections()
  sendTodoToAllConnections(id)

  res.redirect('back')
})

app.get('/register', async (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const name = req.body.name
  const password = req.body.password

  const user = await createUser(name, password)

  res.cookie('token', user.token)

  res.redirect('/')
})

app.use((req, res) => {
  console.log('404', req.method, req.url)

  res.render('404')
})
