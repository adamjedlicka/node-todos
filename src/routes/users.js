import express from 'express'
import { createUser, getUser } from '../db/users.js'

const router = express.Router()

router.get('/register', async (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const name = req.body.name
    const password = req.body.password

    const user = await createUser(name, password)

    res.cookie('token', user.token)

    res.redirect('/')
  } catch {
    res.render('register', {
      error: 'Registrace se nepovedla',
    })
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const name = req.body.name
  const password = req.body.password

  const user = await getUser(name, password)

  if (user) {
    res.cookie('token', user.token)

    res.redirect('/')
  } else {
    res.render('login', {
      error: 'Chybné jméno nebo heslo',
    })
  }
})

router.get('/logout', (req, res) => {
  res.cookie('token', undefined)

  res.redirect('back')
})

export default router
