import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = (user) => {
  return jwt.sign({ id: user._id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  })
}

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'email, password required.' })
  }

  const users = await User.find({ email: req.body.email }).exec()
  if (users.length > 0) {
    return res
      .status(200)
      .json({ code: 'EMAIL_EXISTS', message: 'User is already registered.' })
  }

  try {
    req.body.role = 'admin' //please change this before production
    const _user = await User.create(req.body)
    const { password, ...user } = _user._doc
    const token = newToken(user)
    return res.status(201).send({ token, user })
  } catch (e) {
    return res.status(500).end()
  }
}

export const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }

  const invalid = {
    code: 'INVALID_EMAIL_PASSWORD',
    message: 'Invalid email and passoword combination',
  }

  try {
    const _user = await User.findOne({ email: req.body.email })
      .select('email password')
      .exec()

    if (!_user) {
      return res.status(401).send(invalid)
    }

    const match = await _user.checkPassword(req.body.password)

    if (!match) {
      return res.status(401).send(invalid)
    }

    const user = await User.findOne({ email: req.body.email })
      .select('-password')
      .lean()
      .exec()
    const token = newToken(_user)
    return res.status(200).send({ token, user })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  const unauthorizedResponse = {
    code: 'UNAUTHORIZED',
    message: 'Not authorized to access this route, please login first.',
  }
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json(unauthorizedResponse)
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).json(unauthorizedResponse)
  }

  const user = await User.findById(payload.id).select('-password').lean().exec()

  if (!user) {
    return res.status(401).end()
  }

  req.user = user
  next()
}
