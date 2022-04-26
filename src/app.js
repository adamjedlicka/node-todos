import express from 'express'
import cookieParser from 'cookie-parser'
import todosRouter from './routes/todos.js'
import usersRouter from './routes/users.js'
import loadUser from './middlewares/loadUser.js'
import { getAllTodos } from './db/todos.js'

export const app = express()

app.set('view engine', 'ejs')

console.log(process.env.APP_URL)

app.locals.appUrl = process.env.APP_URL

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(loadUser)

app.get('/', async (req, res, next) => {
  const todos = await getAllTodos({
    done: req.query.done && req.query.done === 'true',
    search: req.query.search,
  })

  res.render('index', {
    title: 'ToDos!',
    todos,
  })
})

app.use(todosRouter)
app.use(usersRouter)

app.use((req, res) => {
  console.log('404', req.method, req.url)

  res.render('404')
})
