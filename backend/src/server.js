import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import config from './config'
import { connect } from './utils/db'
import { login, signup, protect } from './utils/auth'
import userRouter from './resources/user/user.router'
import productRouter from './resources/product/product.router'
import customerRouter from './resources/customer/customer.router'
import orderRouter from './resources/order/order.router'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', signup)
app.post('/login', login)

app.use('/api', protect)

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/customer', customerRouter)
app.use('/api/order', orderRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`SALES DASHBOARD API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
