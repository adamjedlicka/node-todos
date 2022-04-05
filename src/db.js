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
