import test from 'ava'
import supertest from 'supertest'
import db from '../src/db.js'
import { app } from '../src/app.js'

test.beforeEach(async () => {
  await db.migrate.latest()
})

test.afterEach(async () => {
  await db.migrate.rollback()
})

test.serial('GET / returns lists of todos', async (t) => {
  const text = 'Testovací todo!!!'

  await db('todos').insert({ text })

  const response = await supertest(app).get('/')

  t.assert(response.text.includes(text))
})

test.serial('POST /add creates new todo', async (t) => {
  const text = 'Testovací todo!!!'

  const response = await supertest(app).post('/add').type('form').send({ text }).redirects(1)

  t.assert(response.text.includes(text))
})
