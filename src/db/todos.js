import db from '../db.js'

export const getAllTodos = async ({ done, search } = {}) => {
  const query = db('todos').select('*')

  if (done !== undefined) {
    query.where('done', done)
  }

  if (search !== undefined) {
    query.whereLike('text', `%${search}%`)
  }

  const todos = await query

  return todos
}

export const getTodoById = async (id) => {
  const todo = await db('todos').select('*').where('id', id).first()

  return todo
}

export const createTodo = async (data, { fetchFreshTodo = true } = {}) => {
  const ids = await db('todos').insert(data)

  if (fetchFreshTodo) {
    const todo = await getTodoById(ids[0])

    return todo
  }
}

export const updateTodo = async (todo) => {
  await db('todos').update(todo).where('id', todo.id)
}

export const deleteTodo = async (todo) => {
  await db('todos').delete().where('id', todo.id)
}
