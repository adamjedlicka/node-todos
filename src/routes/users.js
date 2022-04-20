import express from 'express'
import { createUser } from '../db/users.js'

const router = express.Router()

router.get('/register', async (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const name = req.body.name
  const password = req.body.password

  const user = await createUser(name, password)

  res.cookie('token', user.token)

  res.redirect('/')
})

export default router
