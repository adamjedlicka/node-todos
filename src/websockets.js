import ejs from 'ejs'
import { WebSocketServer, WebSocket } from 'ws'
import { getAllTodos, getTodoById } from './db.js'

/** @type {Set<WebSocket>} */
const connections = new Set()

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    connections.add(ws)

    ws.on('close', () => {
      connections.delete(ws)
    })
  })
}

export const sendTodosToAllConnections = async () => {
  const todos = await getAllTodos()

  const html = await ejs.renderFile('views/_todos.ejs', {
    todos,
  })

  for (const connection of connections) {
    const message = {
      type: 'todos',
      html,
    }

    const json = JSON.stringify(message)

    connection.send(json)
  }
}

export const sendTodoToAllConnections = async (todoId) => {
  const todo = await getTodoById(todoId)

  const html = await ejs.renderFile('views/_todo.ejs', {
    todo,
  })

  for (const connection of connections) {
    const message = {
      type: 'todo',
      id: todoId,
      html,
    }

    const json = JSON.stringify(message)

    connection.send(json)
  }
}

export const sendDeleteToAllConnections = async (todoId) => {
  for (const connection of connections) {
    const message = {
      type: 'delete',
      id: todoId,
    }

    const json = JSON.stringify(message)

    connection.send(json)
  }
}
