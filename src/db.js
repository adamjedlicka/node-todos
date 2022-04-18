import crypto from 'crypto'
import knex from 'knex'
import knexfile from '../knexfile.js'

const db = knex(knexfile[process.env.NODE_ENV || 'development'])

export default db

export const getAllTodos = async () => {
  const todos = await db('todos').select('*')

  return todos
}

export const getTodoById = async (id) => {
  const todo = await db('todos').select('*').where({ id }).first()

  return todo
}

export const createUser = async (name, password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  const token = crypto.randomBytes(16).toString('hex')

  const ids = await db('users').insert({ name, salt, hash, token })

  const user = await db('users').where('id', ids[0]).first()

  return user
}

export const getUser = async (name, password) => {
  const user = await db('users').where({ name }).first()
  if (!user) return null

  const salt = user.salt
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  if (hash !== user.hash) return null

  return user
}

export const getUserByToken = async (token) => {
  const user = await db('users').where({ token }).first()

  return user
}
